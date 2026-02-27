/**
 * @module crypto
 * @description Cryptographic utilities for Nostr
 * 
 * IMPORTANT: Nostr Protocol Cryptographic Requirements
 * While secp256k1 is the underlying elliptic curve used by Nostr, the protocol specifically
 * requires schnorr signatures as defined in NIP-01. This means:
 * 
 * 1. Always use schnorr-specific functions:
 *    - schnorr.getPublicKey() for public key generation
 *    - schnorr.sign() for signing
 *    - schnorr.verify() for verification
 * 
 * 2. Avoid using secp256k1 functions directly:
 *    - DON'T use secp256k1.getPublicKey()
 *    - DON'T use secp256k1.sign()
 *    - DON'T use secp256k1.verify()
 * 
 * While both might work in some cases (as they use the same curve), the schnorr signature
 * scheme has specific requirements for key and signature formats that aren't guaranteed
 * when using the lower-level secp256k1 functions directly.
 */

import { schnorr, secp256k1 } from '@noble/curves/secp256k1';
import { bytesToHex, hexToBytes } from '@noble/curves/abstract/utils';
import { sha256 } from '@noble/hashes/sha256';
import { randomBytes } from '@noble/hashes/utils';
import { KeyPair, PublicKeyDetails, NostrEvent, SignedNostrEvent, PublicKey } from './types/index';
import { logger } from './utils/logger';
import { bytesToBase64, base64ToBytes } from './encoding/base64';


/**
 * Custom crypto interface for cross-platform compatibility
 */
export interface CryptoSubtle {
  subtle: {
    generateKey(
      algorithm: RsaHashedKeyGenParams | EcKeyGenParams,
      extractable: boolean,
      keyUsages: readonly KeyUsage[]
    ): Promise<CryptoKeyPair>;
    importKey(
      format: 'raw' | 'pkcs8' | 'spki',
      keyData: ArrayBuffer,
      algorithm: RsaHashedImportParams | EcKeyImportParams | AesKeyAlgorithm,
      extractable: boolean,
      keyUsages: readonly KeyUsage[]
    ): Promise<CryptoKey>;
    encrypt(
      algorithm: { name: string; iv: Uint8Array },
      key: CryptoKey,
      data: ArrayBuffer
    ): Promise<ArrayBuffer>;
    decrypt(
      algorithm: { name: string; iv: Uint8Array },
      key: CryptoKey,
      data: ArrayBuffer
    ): Promise<ArrayBuffer>;
  };
  getRandomValues<T extends Uint8Array | Int8Array | Uint16Array | Int16Array | Uint32Array | Int32Array>(array: T): T;
}

declare global {
  interface Window {
    crypto: CryptoSubtle;
  }
  interface Global {
    crypto: CryptoSubtle;
  }
}

// Get the appropriate crypto implementation
const getCrypto = async (): Promise<CryptoSubtle> => {
  if (typeof window !== 'undefined' && window.crypto) {
    return window.crypto;
  }
  if (typeof global !== 'undefined' && (global as Global).crypto) {
    return (global as Global).crypto;
  }
  try {
    const cryptoModule = await import('crypto');
    if (cryptoModule.webcrypto) {
      return cryptoModule.webcrypto as CryptoSubtle;
    }
  } catch {
    logger.debug('Node crypto not available');
  }

  throw new Error('No WebCrypto implementation available');
};

/**
 * Crypto implementation that works in both Node.js and browser environments
 */
class CustomCrypto {
  private cryptoInstance: CryptoSubtle | null = null;
  private initPromise: Promise<void>;

  constructor() {
    this.initPromise = this.initialize();
  }

  private async initialize(): Promise<void> {
    this.cryptoInstance = await getCrypto();
  }

  private async ensureInitialized(): Promise<CryptoSubtle> {
    await this.initPromise;
    if (!this.cryptoInstance) {
      throw new Error('Crypto implementation not initialized');
    }
    return this.cryptoInstance;
  }

  async getSubtle(): Promise<CryptoSubtle['subtle']> {
    const crypto = await this.ensureInitialized();
    return crypto.subtle;
  }

  async getRandomValues<T extends Uint8Array | Int8Array | Uint16Array | Int16Array | Uint32Array | Int32Array>(array: T): Promise<T> {
    const crypto = await this.ensureInitialized();
    return crypto.getRandomValues(array);
  }
}

// Create and export default instance
export const customCrypto = new CustomCrypto();

// Export schnorr functions
export const signSchnorr = schnorr.sign;
export const verifySchnorrSignature = schnorr.verify;

/**
 * Gets the compressed public key (33 bytes with prefix)
 */
export function getCompressedPublicKey(privateKeyBytes: Uint8Array): Uint8Array {
  return secp256k1.getPublicKey(privateKeyBytes, true);
}

/**
 * Gets the schnorr public key (32 bytes x-coordinate) as per BIP340
 */
export function getSchnorrPublicKey(privateKeyBytes: Uint8Array): Uint8Array {
  return schnorr.getPublicKey(privateKeyBytes);
}

/**
 * Generates a new key pair
 */
export async function generateKeyPair(): Promise<KeyPair> {
  const privateKeyBytes = randomBytes(32);
  const privateKey = bytesToHex(privateKeyBytes);
  privateKeyBytes.fill(0); // zero source material
  const publicKey = await getPublicKey(privateKey);

  return {
    privateKey,
    publicKey
  };
}

/**
 * Gets a public key from a private key
 */
export async function getPublicKey(privateKey: string): Promise<PublicKeyDetails> {
  try {
    const privateKeyBytes = hexToBytes(privateKey);
    const publicKeyBytes = schnorr.getPublicKey(privateKeyBytes);
    return {
      hex: bytesToHex(publicKeyBytes),
      bytes: publicKeyBytes
    };
  } catch (error) {
    logger.error({ error }, 'Failed to get public key');
    throw error;
  }
}

/**
 * Validates a key pair
 */
export async function validateKeyPair(keyPair: KeyPair): Promise<boolean> {
  try {
    const derivedPubKey = await getPublicKey(keyPair.privateKey);
    return derivedPubKey.hex === keyPair.publicKey.hex;
  } catch (error) {
    logger.error({ error }, 'Failed to validate key pair');
    return false;
  }
}

/**
 * Creates a new event
 */
export function createEvent(event: Partial<NostrEvent>): NostrEvent {
  const timestamp = Math.floor(Date.now() / 1000);

  return {
    ...event,
    created_at: event.created_at || timestamp,
    tags: event.tags || [],
    content: event.content || '',
    kind: event.kind || 1
  } as NostrEvent;
}

/**
 * Signs an event
 */
export async function signEvent(event: NostrEvent, privateKey: string): Promise<SignedNostrEvent> {
  try {
    // Serialize event for signing (NIP-01 format)
    const serialized = JSON.stringify([
      0,
      event.pubkey,
      event.created_at,
      event.kind,
      event.tags,
      event.content
    ]);

    // Calculate event hash
    const eventHash = sha256(new TextEncoder().encode(serialized));

    // Convert private key to bytes and sign
    const privateKeyBytes = hexToBytes(privateKey);
    const signatureBytes = schnorr.sign(eventHash, privateKeyBytes);

    // Create signed event
    return {
      ...event,
      id: bytesToHex(eventHash),
      sig: bytesToHex(signatureBytes)
    };
  } catch (error) {
    logger.error({ error }, 'Failed to sign event');
    throw error;
  }
}

/**
 * Verifies an event signature
 */
export async function verifySignature(event: SignedNostrEvent): Promise<boolean> {
  try {
    // Serialize event for verification (NIP-01 format)
    const serialized = JSON.stringify([
      0,
      event.pubkey,
      event.created_at,
      event.kind,
      event.tags,
      event.content
    ]);

    // Calculate event hash
    const eventHash = sha256(new TextEncoder().encode(serialized));

    // Verify event ID
    const calculatedId = bytesToHex(eventHash);
    if (calculatedId !== event.id) {
      logger.error('Event ID mismatch');
      return false;
    }

    // Convert hex strings to bytes
    const signatureBytes = hexToBytes(event.sig);
    const pubkeyBytes = hexToBytes(event.pubkey);

    // Verify signature
    return schnorr.verify(signatureBytes, eventHash, pubkeyBytes);
  } catch (error) {
    logger.error({ error }, 'Failed to verify signature');
    return false;
  }
}

/**
 * Encrypts a message using NIP-04
 */
export async function encrypt(
  message: string,
  recipientPubKey: PublicKey | string,
  senderPrivKey: string
): Promise<string> {
  try {
    const recipientPubKeyHex = typeof recipientPubKey === 'string' ? recipientPubKey : recipientPubKey.hex;
    const sharedPoint = secp256k1.getSharedSecret(hexToBytes(senderPrivKey), hexToBytes(recipientPubKeyHex));
    const sharedX = sharedPoint.slice(1, 33);

    // Generate random IV
    const iv = randomBytes(16);
    const key = await customCrypto.getSubtle().then((subtle) => subtle.importKey(
      'raw',
      sharedX.buffer,
      { name: 'AES-CBC', length: 256 },
      false,
      ['encrypt']
    ));

    // Zero shared secret material now that AES key is imported
    sharedX.fill(0);
    sharedPoint.fill(0);

    // Encrypt the message
    const data = new TextEncoder().encode(message);
    const encrypted = await customCrypto.getSubtle().then((subtle) => subtle.encrypt(
      { name: 'AES-CBC', iv },
      key,
      data.buffer
    ));

    // NIP-04 standard format: base64(ciphertext) + "?iv=" + base64(iv)
    const ciphertextBase64 = bytesToBase64(new Uint8Array(encrypted));
    const ivBase64 = bytesToBase64(iv);

    return ciphertextBase64 + '?iv=' + ivBase64;
  } catch (error) {
    logger.error({ error }, 'Failed to encrypt message');
    throw error;
  }
}

/**
 * Decrypts a message using NIP-04
 */
export async function decrypt(
  encryptedMessage: string,
  senderPubKey: PublicKey | string,
  recipientPrivKey: string
): Promise<string> {
  try {
    const senderPubKeyHex = typeof senderPubKey === 'string' ? senderPubKey : senderPubKey.hex;
    const sharedPoint = secp256k1.getSharedSecret(hexToBytes(recipientPrivKey), hexToBytes(senderPubKeyHex));
    const sharedX = sharedPoint.slice(1, 33);

    // Parse NIP-04 standard format: base64(ciphertext) + "?iv=" + base64(iv)
    // Also support legacy hex format (iv + ciphertext concatenated) as fallback
    let iv: Uint8Array;
    let ciphertext: Uint8Array;

    if (encryptedMessage.includes('?iv=')) {
      // NIP-04 standard format
      const [ciphertextBase64, ivBase64] = encryptedMessage.split('?iv=');
      ciphertext = base64ToBytes(ciphertextBase64);
      iv = base64ToBytes(ivBase64);
    } else {
      // Legacy hex format fallback: first 16 bytes are IV, rest is ciphertext
      const encrypted = hexToBytes(encryptedMessage);
      iv = encrypted.slice(0, 16);
      ciphertext = encrypted.slice(16);
    }

    const key = await customCrypto.getSubtle().then((subtle) => subtle.importKey(
      'raw',
      sharedX.buffer,
      { name: 'AES-CBC', length: 256 },
      false,
      ['decrypt']
    ));

    // Zero shared secret material now that AES key is imported
    sharedX.fill(0);
    sharedPoint.fill(0);

    const decrypted = await customCrypto.getSubtle().then((subtle) => subtle.decrypt(
      { name: 'AES-CBC', iv },
      key,
      ciphertext.buffer as ArrayBuffer
    ));

    return new TextDecoder().decode(decrypted);
  } catch (error) {
    logger.error({ error }, 'Failed to decrypt message');
    throw error;
  }
}
