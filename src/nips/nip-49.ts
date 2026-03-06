/**
 * @module nips/nip-49
 * @description Implementation of NIP-49 (Private Key Encryption / ncryptsec)
 * @see https://github.com/nostr-protocol/nips/blob/master/49.md
 */

import { xchacha20poly1305 } from '@noble/ciphers/chacha.js';
import { scrypt } from '@noble/hashes/scrypt.js';
import { concatBytes, randomBytes } from '@noble/hashes/utils.js';
import { bech32 as scureBech32 } from '@scure/base';

type KeySecurityByte = 0x00 | 0x01 | 0x02;

/**
 * Encrypt a Nostr private key with a password, producing an ncryptsec bech32 string
 * @param sec - 32-byte secret key
 * @param password - Password for encryption
 * @param logn - Scrypt log2(N) parameter (default: 16, meaning N=65536)
 * @param ksb - Key security byte: 0x00=unknown, 0x01=unsafe, 0x02=safe (default: 0x02)
 * @returns bech32-encoded ncryptsec string
 */
export function encrypt(
  sec: Uint8Array,
  password: string,
  logn: number = 16,
  ksb: KeySecurityByte = 0x02
): string {
  const salt = randomBytes(16);
  const n = 2 ** logn;
  const normalizedPassword = password.normalize('NFKC');
  const key = scrypt(normalizedPassword, salt, { N: n, r: 8, p: 1, dkLen: 32 });
  const nonce = randomBytes(24);
  const aad = Uint8Array.from([ksb]);
  const cipher = xchacha20poly1305(key, nonce, aad);
  const ciphertext = cipher.encrypt(sec);
  // Binary format: version(1) + logn(1) + salt(16) + nonce(24) + ksb(1) + ciphertext(48 = 32 + 16 tag)
  const payload = concatBytes(
    Uint8Array.from([0x02]),
    Uint8Array.from([logn]),
    salt,
    nonce,
    aad,
    ciphertext
  );
  const words = scureBech32.toWords(payload);
  return scureBech32.encode('ncryptsec', words, 200);
}

/**
 * Decrypt an ncryptsec bech32 string back to the 32-byte secret key
 * @param ncryptsec - bech32-encoded ncryptsec string
 * @param password - Password used for encryption
 * @returns 32-byte secret key as Uint8Array
 */
export function decrypt(ncryptsec: string, password: string): Uint8Array {
  const { prefix, words } = scureBech32.decode(ncryptsec as `${string}1${string}`, 200);
  if (prefix !== 'ncryptsec') throw new Error('invalid ncryptsec prefix');
  const data = new Uint8Array(scureBech32.fromWords(words));
  const version = data[0];
  if (version !== 0x02) throw new Error(`unknown ncryptsec version: ${version}`);
  const logn = data[1];
  const salt = data.subarray(2, 18);
  const nonce = data.subarray(18, 42);
  const ksb = data[42];
  const ciphertext = data.subarray(43);
  const n = 2 ** logn;
  const normalizedPassword = password.normalize('NFKC');
  const key = scrypt(normalizedPassword, salt, { N: n, r: 8, p: 1, dkLen: 32 });
  const aad = Uint8Array.from([ksb]);
  const cipher = xchacha20poly1305(key, nonce, aad);
  return cipher.decrypt(ciphertext);
}
