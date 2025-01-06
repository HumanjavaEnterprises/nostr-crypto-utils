/**
 * @module nips/nip-04
 * @description Implementation of NIP-04 (Encrypted Direct Messages)
 * @see https://github.com/nostr-protocol/nips/blob/master/04.md
 */
interface CryptoImplementation {
    getRandomValues<T extends ArrayBufferView>(array: T): T;
    subtle: {
        importKey(format: 'raw' | 'pkcs8' | 'spki' | 'jwk', keyData: BufferSource | JsonWebKey, algorithm: AlgorithmIdentifier | RsaHashedImportParams | EcKeyImportParams | HmacImportParams | AesKeyAlgorithm, extractable: boolean, keyUsages: KeyUsage[]): Promise<CryptoKey>;
        encrypt(algorithm: AlgorithmIdentifier | RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams, key: CryptoKey, data: BufferSource): Promise<ArrayBuffer>;
        decrypt(algorithm: AlgorithmIdentifier | RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams, key: CryptoKey, data: BufferSource): Promise<ArrayBuffer>;
    };
}
declare global {
    interface Window {
        crypto: CryptoImplementation;
    }
}
interface SharedSecret {
    sharedSecret: Uint8Array;
}
/**
 * Encrypts a message using NIP-04 encryption
 * @param message - Message to encrypt
 * @param recipientPubKey - Recipient's public key
 * @param senderPrivKey - Sender's private key
 * @returns Encrypted message string
 */
export declare function encryptMessage(message: string, recipientPubKey: string, senderPrivKey: string): Promise<string>;
/**
 * Decrypts a message using NIP-04 decryption
 * @param encryptedMessage - Encrypted message string
 * @param senderPubKey - Sender's public key
 * @param recipientPrivKey - Recipient's private key
 * @returns Decrypted message string
 */
export declare function decryptMessage(encryptedMessage: string, senderPubKey: string, recipientPrivKey: string): Promise<string>;
/**
 * Generates a shared secret for NIP-04 encryption
 * @param privateKey - Private key
 * @param publicKey - Public key
 * @returns Shared secret
 */
export declare function generateSharedSecret(privateKey: string, publicKey: string): SharedSecret;
export {};
//# sourceMappingURL=nip-04.d.ts.map