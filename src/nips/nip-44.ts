/**
 * @module nips/nip-44
 * @description Implementation of NIP-44 (Versioned Encrypted Payloads)
 * @see https://github.com/nostr-protocol/nips/blob/master/44.md
 */

import { chacha20 } from '@noble/ciphers/chacha.js';
import { equalBytes } from '@noble/ciphers/utils.js';
import { secp256k1 } from '@noble/curves/secp256k1.js';
import { extract as hkdf_extract, expand as hkdf_expand } from '@noble/hashes/hkdf.js';
import { hmac } from '@noble/hashes/hmac.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { concatBytes, hexToBytes, randomBytes } from '@noble/hashes/utils.js';
import { base64 } from '@scure/base';

const utf8Encoder = new TextEncoder();
const utf8Decoder = new TextDecoder();

const minPlaintextSize = 1;
const maxPlaintextSize = 65535;

/**
 * Calculate padded length for NIP-44 message padding
 */
function calcPaddedLen(len: number): number {
  if (!Number.isSafeInteger(len) || len < 1) throw new Error('expected positive integer');
  if (len <= 32) return 32;
  const nextPower = 1 << (Math.floor(Math.log2(len - 1)) + 1);
  const chunk = nextPower <= 256 ? 32 : nextPower / 8;
  return chunk * (Math.floor((len - 1) / chunk) + 1);
}

/**
 * Pad plaintext per NIP-44 spec
 */
function pad(plaintext: string): Uint8Array {
  const unpadded = utf8Encoder.encode(plaintext);
  const unpaddedLen = unpadded.length;
  if (unpaddedLen < minPlaintextSize || unpaddedLen > maxPlaintextSize)
    throw new Error('invalid plaintext length: must be between 1 and 65535 bytes');
  const prefix = new Uint8Array(2);
  new DataView(prefix.buffer).setUint16(0, unpaddedLen, false); // big-endian
  const suffix = new Uint8Array(calcPaddedLen(unpaddedLen) - unpaddedLen);
  return concatBytes(prefix, unpadded, suffix);
}

/**
 * Unpad decrypted message per NIP-44 spec
 */
function unpad(padded: Uint8Array): string {
  const unpaddedLen = new DataView(padded.buffer, padded.byteOffset).getUint16(0, false);
  const unpadded = padded.subarray(2, 2 + unpaddedLen);
  if (
    unpaddedLen < minPlaintextSize ||
    unpaddedLen > maxPlaintextSize ||
    unpadded.length !== unpaddedLen ||
    padded.length !== 2 + calcPaddedLen(unpaddedLen)
  ) {
    throw new Error('invalid padding');
  }
  return utf8Decoder.decode(unpadded);
}

/**
 * Derive conversation key from private key and public key using ECDH + HKDF
 */
function getConversationKey(privkeyA: Uint8Array, pubkeyB: string): Uint8Array {
  const sharedPoint = secp256k1.getSharedSecret(privkeyA, hexToBytes('02' + pubkeyB));
  const sharedX = sharedPoint.subarray(1, 33);
  return hkdf_extract(sha256, sharedX, utf8Encoder.encode('nip44-v2'));
}

/**
 * Derive message keys (chacha key, chacha nonce, hmac key) from conversation key and nonce
 */
function getMessageKeys(conversationKey: Uint8Array, nonce: Uint8Array): {
  chacha_key: Uint8Array;
  chacha_nonce: Uint8Array;
  hmac_key: Uint8Array;
} {
  const keys = hkdf_expand(sha256, conversationKey, nonce, 76);
  return {
    chacha_key: keys.subarray(0, 32),
    chacha_nonce: keys.subarray(32, 44),
    hmac_key: keys.subarray(44, 76),
  };
}

/**
 * Encrypt plaintext using NIP-44 v2
 * @param plaintext - The message to encrypt
 * @param conversationKey - 32-byte conversation key from getConversationKey
 * @param nonce - Optional 32-byte nonce (random if not provided)
 * @returns Base64-encoded encrypted payload
 */
function encrypt(plaintext: string, conversationKey: Uint8Array, nonce: Uint8Array = randomBytes(32)): string {
  const { chacha_key, chacha_nonce, hmac_key } = getMessageKeys(conversationKey, nonce);
  const padded = pad(plaintext);
  const ciphertext = chacha20(chacha_key, chacha_nonce, padded);
  const mac = hmac(sha256, hmac_key, concatBytes(nonce, ciphertext));
  return base64.encode(concatBytes(new Uint8Array([2]), nonce, ciphertext, mac));
}

/**
 * Decrypt a NIP-44 v2 payload
 * @param payload - Base64-encoded encrypted payload
 * @param conversationKey - 32-byte conversation key from getConversationKey
 * @returns Decrypted plaintext string
 */
function decrypt(payload: string, conversationKey: Uint8Array): string {
  const data = base64.decode(payload);
  const version = data[0];
  if (version !== 2) throw new Error(`unknown encryption version: ${version}`);
  if (data.length < 99 || data.length > 65603) throw new Error('invalid payload size');
  const nonce = data.subarray(1, 33);
  const ciphertext = data.subarray(33, data.length - 32);
  const mac = data.subarray(data.length - 32);
  const { chacha_key, chacha_nonce, hmac_key } = getMessageKeys(conversationKey, nonce);
  const expectedMac = hmac(sha256, hmac_key, concatBytes(nonce, ciphertext));
  if (!equalBytes(mac, expectedMac)) throw new Error('invalid MAC');
  const padded = chacha20(chacha_key, chacha_nonce, ciphertext);
  return unpad(padded);
}

/**
 * v2 API object matching nostr-tools shape for compatibility
 */
export const v2 = {
  utils: {
    getConversationKey,
    calcPaddedLen,
  },
  encrypt,
  decrypt,
};

export { getConversationKey, encrypt, decrypt, calcPaddedLen };
