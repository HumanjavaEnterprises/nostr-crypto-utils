/**
 * @module nips/nip-49
 * @description Implementation of NIP-49 (Private Key Encryption / ncryptsec)
 * @see https://github.com/nostr-protocol/nips/blob/master/49.md
 */
import { xchacha20poly1305 } from '@noble/ciphers/chacha.js';
import { scrypt } from '@noble/hashes/scrypt.js';
import { concatBytes, randomBytes } from '@noble/hashes/utils.js';
import { bech32 as scureBech32 } from '@scure/base';
/**
 * Default upper bound for the scrypt `log_n` accepted by {@link decrypt}.
 * log_n is attacker-controlled in a received ncryptsec; scrypt memory is
 * 128 * r * 2^log_n bytes, so 18 = 256 MiB. Raise it explicitly with
 * `{ maxLogN }` if you must open keys encrypted with stronger parameters.
 */
export const DEFAULT_MAX_LOG_N = 18;
/** Hard ceiling for log_n on encrypt (scrypt in noble refuses > 1 GiB anyway). */
const MAX_ENCRYPT_LOG_N = 22;
/** Binary payload length: version(1) + logn(1) + salt(16) + nonce(24) + ksb(1) + ciphertext(48). */
const PAYLOAD_LENGTH = 91;
/**
 * Encrypt a Nostr private key with a password, producing an ncryptsec bech32 string
 * @param sec - 32-byte secret key
 * @param password - Password for encryption
 * @param logn - Scrypt log2(N) parameter (default: 16, meaning N=65536)
 * @param ksb - Key security byte: 0x00=unknown, 0x01=unsafe, 0x02=safe (default: 0x02)
 * @returns bech32-encoded ncryptsec string
 */
export function encrypt(sec, password, logn = 16, ksb = 0x02) {
    if (!(sec instanceof Uint8Array) || sec.length !== 32) {
        throw new Error('secret key must be 32 bytes');
    }
    if (!Number.isInteger(logn) || logn < 0 || logn > MAX_ENCRYPT_LOG_N) {
        throw new Error(`invalid log_n: must be an integer in 0..${MAX_ENCRYPT_LOG_N}`);
    }
    const salt = randomBytes(16);
    const n = 2 ** logn;
    const normalizedPassword = password.normalize('NFKC');
    const key = scrypt(normalizedPassword, salt, { N: n, r: 8, p: 1, dkLen: 32 });
    const nonce = randomBytes(24);
    const aad = Uint8Array.from([ksb]);
    const cipher = xchacha20poly1305(key, nonce, aad);
    const ciphertext = cipher.encrypt(sec);
    // Binary format: version(1) + logn(1) + salt(16) + nonce(24) + ksb(1) + ciphertext(48 = 32 + 16 tag)
    const payload = concatBytes(Uint8Array.from([0x02]), Uint8Array.from([logn]), salt, nonce, aad, ciphertext);
    const words = scureBech32.toWords(payload);
    return scureBech32.encode('ncryptsec', words, 200);
}
/**
 * Decrypt an ncryptsec bech32 string back to the 32-byte secret key
 * @param ncryptsec - bech32-encoded ncryptsec string
 * @param password - Password used for encryption
 * @param opts - `maxLogN` caps the attacker-controlled scrypt cost (default 18)
 * @returns 32-byte secret key as Uint8Array
 */
export function decrypt(ncryptsec, password, opts = {}) {
    const maxLogN = opts.maxLogN ?? DEFAULT_MAX_LOG_N;
    const { prefix, words } = scureBech32.decode(ncryptsec, 200);
    if (prefix !== 'ncryptsec')
        throw new Error('invalid ncryptsec prefix');
    const data = new Uint8Array(scureBech32.fromWords(words));
    if (data.length !== PAYLOAD_LENGTH)
        throw new Error(`invalid ncryptsec length: ${data.length}`);
    const version = data[0];
    if (version !== 0x02)
        throw new Error(`unknown ncryptsec version: ${version}`);
    const logn = data[1];
    if (logn > maxLogN)
        throw new Error(`ncryptsec log_n ${logn} exceeds maxLogN ${maxLogN}`);
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
