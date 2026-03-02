/**
 * @module nips/nip-44
 * @description Implementation of NIP-44 (Versioned Encrypted Payloads)
 * @see https://github.com/nostr-protocol/nips/blob/master/44.md
 */
/**
 * Calculate padded length for NIP-44 message padding
 */
declare function calcPaddedLen(len: number): number;
/**
 * Derive conversation key from private key and public key using ECDH + HKDF
 */
declare function getConversationKey(privkeyA: Uint8Array, pubkeyB: string): Uint8Array;
/**
 * Encrypt plaintext using NIP-44 v2
 * @param plaintext - The message to encrypt
 * @param conversationKey - 32-byte conversation key from getConversationKey
 * @param nonce - Optional 32-byte nonce (random if not provided)
 * @returns Base64-encoded encrypted payload
 */
declare function encrypt(plaintext: string, conversationKey: Uint8Array, nonce?: Uint8Array): string;
/**
 * Decrypt a NIP-44 v2 payload
 * @param payload - Base64-encoded encrypted payload
 * @param conversationKey - 32-byte conversation key from getConversationKey
 * @returns Decrypted plaintext string
 */
declare function decrypt(payload: string, conversationKey: Uint8Array): string;
/**
 * v2 API object matching nostr-tools shape for compatibility
 */
export declare const v2: {
    utils: {
        getConversationKey: typeof getConversationKey;
        calcPaddedLen: typeof calcPaddedLen;
    };
    encrypt: typeof encrypt;
    decrypt: typeof decrypt;
};
export { getConversationKey, encrypt, decrypt, calcPaddedLen };
//# sourceMappingURL=nip-44.d.ts.map