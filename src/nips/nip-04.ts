/**
 * @module nips/nip-04
 * @description Implementation of NIP-04 (Encrypted Direct Messages).
 *
 * This module is the SINGLE canonical NIP-04 implementation for the package.
 * The blessed API is:
 *
 *   encryptMessage(message, senderPrivkey: PrivateKey, recipientPubkey: PublicKey): string
 *   decryptMessage(ciphertext, recipientPrivkey: PrivateKey, senderPubkey: PublicKey): string
 *
 * Branded key types (see ../types/keys) make argument-order mistakes a compile
 * error. The ECDH accepts 32-byte x-only Nostr public keys (the only form used
 * on the wire) by prepending the 02 prefix before deriving the shared secret.
 *
 * @see https://github.com/nostr-protocol/nips/blob/master/04.md
 *
 * @deprecated NIP-04 is `unrecommended` upstream — it leaks metadata and uses a
 * weaker scheme. Prefer NIP-17 Private Direct Messages (NIP-44 encryption +
 * NIP-59 gift wrap). Retained for compatibility with legacy events only.
 */

import { secp256k1 } from '@noble/curves/secp256k1.js';
import { cbc } from '@noble/ciphers/aes.js';
import { hexToBytes, randomBytes } from '@noble/hashes/utils.js';
import { logger } from '../utils/logger.js';
import { bytesToBase64, base64ToBytes } from '../encoding/base64.js';
import { asPrivateKey, type PrivateKey, type PublicKey } from '../types/keys.js';

const utf8Encoder = new TextEncoder();
const utf8Decoder = new TextDecoder();

/**
 * Derive the NIP-04 shared secret (x-coordinate of the ECDH point).
 * Accepts a 32-byte x-only pubkey (64 hex) — the standard Nostr key format —
 * by prepending the 02 prefix, or an already-prefixed 33-byte pubkey (66 hex).
 */
function deriveSharedX(privHex: string, pubHex: string): Uint8Array {
  const normalizedPub =
    pubHex.startsWith('02') || pubHex.startsWith('03') ? pubHex : '02' + pubHex;
  const sharedPoint = secp256k1.getSharedSecret(hexToBytes(privHex), hexToBytes(normalizedPub));
  const sharedX = sharedPoint.slice(1, 33);
  sharedPoint.fill(0);
  return sharedX;
}

/**
 * Encrypt a message using NIP-04 (AES-256-CBC over the ECDH shared secret).
 *
 * @param message - Plaintext message to encrypt
 * @param senderPrivkey - Sender's private key (branded {@link PrivateKey})
 * @param recipientPubkey - Recipient's x-only public key (branded {@link PublicKey})
 * @returns NIP-04 payload: `base64(ciphertext)?iv=base64(iv)`
 */
export function encryptMessage(
  message: string,
  senderPrivkey: PrivateKey,
  recipientPubkey: PublicKey
): string {
  try {
    // Defensive runtime validation (branding is erased at runtime).
    asPrivateKey(senderPrivkey);
    const sharedX = deriveSharedX(senderPrivkey, recipientPubkey);
    const iv = randomBytes(16);
    const ciphertext = cbc(sharedX, iv).encrypt(utf8Encoder.encode(message));
    sharedX.fill(0);
    return bytesToBase64(ciphertext) + '?iv=' + bytesToBase64(iv);
  } catch (error) {
    logger.error({ error }, 'Failed to encrypt message');
    throw error;
  }
}

/**
 * Decrypt a NIP-04 message.
 *
 * @param ciphertext - NIP-04 payload (`base64(ct)?iv=base64(iv)`), or legacy hex (iv||ct)
 * @param recipientPrivkey - Recipient's private key (branded {@link PrivateKey})
 * @param senderPubkey - Sender's x-only public key (branded {@link PublicKey})
 * @returns Decrypted plaintext
 */
export function decryptMessage(
  ciphertext: string,
  recipientPrivkey: PrivateKey,
  senderPubkey: PublicKey
): string {
  try {
    asPrivateKey(recipientPrivkey);
    const sharedX = deriveSharedX(recipientPrivkey, senderPubkey);

    let iv: Uint8Array;
    let ct: Uint8Array;
    if (ciphertext.includes('?iv=')) {
      // NIP-04 standard format: base64(ciphertext) + "?iv=" + base64(iv)
      const [ctB64, ivB64] = ciphertext.split('?iv=');
      ct = base64ToBytes(ctB64);
      iv = base64ToBytes(ivB64);
    } else {
      // Legacy hex format fallback: first 16 bytes are IV, rest is ciphertext
      const raw = hexToBytes(ciphertext);
      iv = raw.slice(0, 16);
      ct = raw.slice(16);
    }

    const plaintext = cbc(sharedX, iv).decrypt(ct);
    sharedX.fill(0);
    return utf8Decoder.decode(plaintext);
  } catch (error) {
    logger.error({ error }, 'Failed to decrypt message');
    throw error;
  }
}

interface SharedSecret {
  sharedSecret: Uint8Array;
}

/**
 * Generate the NIP-04 shared secret (x-coordinate) for a private/public key pair.
 * @param privateKey - Private key (64 hex)
 * @param publicKey - Public key (64 hex x-only, or 66 hex prefixed)
 */
export function generateSharedSecret(privateKey: string, publicKey: string): SharedSecret {
  if (!privateKey || !publicKey) {
    throw new Error('Invalid input parameters');
  }
  if (!/^[0-9a-f]{64}$/i.test(privateKey)) {
    throw new Error('Invalid private key format');
  }
  return { sharedSecret: deriveSharedX(privateKey, publicKey) };
}

export { generateSharedSecret as computeSharedSecret };

// Re-export branded key types and constructors so consumers of the nip04
// namespace can build the arguments the canonical API requires.
export { asPrivateKey, asPublicKey, type PrivateKey, type PublicKey } from '../types/keys.js';
