/**
 * @module nips/nip-04
 * @description Implementation of NIP-04 (Encrypted Direct Messages)
 * @see https://github.com/nostr-protocol/nips/blob/master/04.md
 */

import * as secp256k1 from '@noble/secp256k1';
import { webcrypto } from 'node:crypto';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { logger } from '../utils';

// Configure crypto for Node.js and test environments
interface CryptoImplementation {
  getRandomValues<T extends ArrayBufferView>(array: T): T;
  subtle: {
    importKey(
      format: 'raw' | 'pkcs8' | 'spki' | 'jwk',
      keyData: BufferSource | JsonWebKey,
      algorithm: AlgorithmIdentifier | RsaHashedImportParams | EcKeyImportParams | HmacImportParams | AesKeyAlgorithm,
      extractable: boolean,
      keyUsages: KeyUsage[]
    ): Promise<CryptoKey>;
    encrypt(
      algorithm: AlgorithmIdentifier | RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams,
      key: CryptoKey,
      data: BufferSource
    ): Promise<ArrayBuffer>;
    decrypt(
      algorithm: AlgorithmIdentifier | RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams,
      key: CryptoKey,
      data: BufferSource
    ): Promise<ArrayBuffer>;
  };
}

declare global {
  interface Window {
    crypto: CryptoImplementation;
  }
}

let customCrypto: CryptoImplementation;

if (typeof window !== 'undefined' && window.crypto) {
  customCrypto = window.crypto;
} else {
  customCrypto = webcrypto as unknown as CryptoImplementation;
}

interface EncryptedMessage {
  content: string;
  iv: string;
}

interface DecryptedMessage {
  content: string;
}

interface SharedSecret {
  sharedSecret: Uint8Array;
}

/**
 * Encrypts a message using NIP-04 encryption
 * @param message - Message to encrypt
 * @param recipientPubKey - Recipient's public key
 * @param senderPrivKey - Sender's private key
 * @returns Encrypted message
 */
export async function encrypt(
  message: string,
  recipientPubKey: string,
  senderPrivKey: string
): Promise<EncryptedMessage> {
  try {
    const sharedSecret = secp256k1.getSharedSecret(senderPrivKey, '02' + recipientPubKey);
    const sharedKey = await customCrypto.subtle.importKey(
      'raw',
      sharedSecret.slice(1),
      { name: 'AES-CBC', length: 256 },
      true,
      ['encrypt']
    );
    
    const iv = customCrypto.getRandomValues(new Uint8Array(16));
    const encrypted = await customCrypto.subtle.encrypt(
      { name: 'AES-CBC', iv },
      sharedKey,
      new TextEncoder().encode(message)
    );
    
    const encryptedArray = new Uint8Array(encrypted);
    const combined = new Uint8Array(iv.length + encryptedArray.length);
    combined.set(iv);
    combined.set(encryptedArray, iv.length);
    
    return { content: bytesToHex(combined), iv: bytesToHex(iv) };
  } catch (error) {
    logger.error('Failed to encrypt message:', error);
    throw error;
  }
}

/**
 * Decrypts a message using NIP-04 decryption
 * @param encryptedMessage - Encrypted message
 * @param senderPubKey - Sender's public key
 * @param recipientPrivKey - Recipient's private key
 * @returns Decrypted message
 */
export async function decrypt(
  encryptedMessage: EncryptedMessage,
  senderPubKey: string,
  recipientPrivKey: string
): Promise<DecryptedMessage> {
  try {
    const sharedSecret = secp256k1.getSharedSecret(recipientPrivKey, '02' + senderPubKey);
    const sharedKey = await customCrypto.subtle.importKey(
      'raw',
      sharedSecret.slice(1),
      { name: 'AES-CBC', length: 256 },
      true,
      ['decrypt']
    );
    
    const encrypted = hexToBytes(encryptedMessage.content);
    const iv = hexToBytes(encryptedMessage.iv);
    const ciphertext = encrypted.slice(16);
    
    const decrypted = await customCrypto.subtle.decrypt(
      { name: 'AES-CBC', iv },
      sharedKey,
      ciphertext
    );
    
    return { content: new TextDecoder().decode(decrypted) };
  } catch (error) {
    logger.error('Failed to decrypt message:', error);
    throw error;
  }
}

/**
 * Generates a shared secret for NIP-04 encryption
 * @param privateKey - Private key
 * @param publicKey - Public key
 * @returns Shared secret
 */
export function getSharedSecret(
  privateKey: string,
  publicKey: string
): SharedSecret {
  try {
    return { sharedSecret: secp256k1.getSharedSecret(privateKey, '02' + publicKey).slice(1) };
  } catch (error) {
    logger.error('Failed to generate shared secret:', error);
    throw error;
  }
}
