/**
 * @module nips/nip-49
 * @description Implementation of NIP-49 (Private Key Encryption / ncryptsec)
 * @see https://github.com/nostr-protocol/nips/blob/master/49.md
 */
type KeySecurityByte = 0x00 | 0x01 | 0x02;
/**
 * Default upper bound for the scrypt `log_n` accepted by {@link decrypt}.
 * log_n is attacker-controlled in a received ncryptsec; scrypt memory is
 * 128 * r * 2^log_n bytes, so 18 = 256 MiB. Raise it explicitly with
 * `{ maxLogN }` if you must open keys encrypted with stronger parameters.
 */
export declare const DEFAULT_MAX_LOG_N = 18;
/** Options for {@link decrypt}. */
export interface Nip49DecryptOptions {
    /** Largest accepted log_n (default {@link DEFAULT_MAX_LOG_N}). */
    maxLogN?: number;
}
/**
 * Encrypt a Nostr private key with a password, producing an ncryptsec bech32 string
 * @param sec - 32-byte secret key
 * @param password - Password for encryption
 * @param logn - Scrypt log2(N) parameter (default: 16, meaning N=65536)
 * @param ksb - Key security byte: 0x00=unknown, 0x01=unsafe, 0x02=safe (default: 0x02)
 * @returns bech32-encoded ncryptsec string
 */
export declare function encrypt(sec: Uint8Array, password: string, logn?: number, ksb?: KeySecurityByte): string;
/**
 * Decrypt an ncryptsec bech32 string back to the 32-byte secret key
 * @param ncryptsec - bech32-encoded ncryptsec string
 * @param password - Password used for encryption
 * @param opts - `maxLogN` caps the attacker-controlled scrypt cost (default 18)
 * @returns 32-byte secret key as Uint8Array
 */
export declare function decrypt(ncryptsec: string, password: string, opts?: Nip49DecryptOptions): Uint8Array;
export {};
