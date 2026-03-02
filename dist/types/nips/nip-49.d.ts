/**
 * @module nips/nip-49
 * @description Implementation of NIP-49 (Private Key Encryption / ncryptsec)
 * @see https://github.com/nostr-protocol/nips/blob/master/49.md
 */
type KeySecurityByte = 0x00 | 0x01 | 0x02;
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
 * @returns 32-byte secret key as Uint8Array
 */
export declare function decrypt(ncryptsec: string, password: string): Uint8Array;
export {};
//# sourceMappingURL=nip-49.d.ts.map