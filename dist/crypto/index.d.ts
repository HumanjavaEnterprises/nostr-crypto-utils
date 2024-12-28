/**
 * @module crypto
 * @description Cryptographic utilities for Nostr
 */
/**
 * Custom crypto interface for cross-platform compatibility
 */
export interface CryptoSubtle {
    subtle: {
        generateKey(algorithm: RsaHashedKeyGenParams | EcKeyGenParams, extractable: boolean, keyUsages: readonly KeyUsage[]): Promise<CryptoKeyPair>;
        importKey(format: 'raw' | 'pkcs8' | 'spki', keyData: ArrayBuffer, algorithm: RsaHashedImportParams | EcKeyImportParams, extractable: boolean, keyUsages: readonly KeyUsage[]): Promise<CryptoKey>;
        exportKey(format: 'raw' | 'pkcs8' | 'spki', key: CryptoKey): Promise<ArrayBuffer>;
        encrypt(algorithm: RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams, key: CryptoKey, data: ArrayBuffer): Promise<ArrayBuffer>;
        decrypt(algorithm: RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams, key: CryptoKey, data: ArrayBuffer): Promise<ArrayBuffer>;
    };
    getRandomValues<T extends Uint8Array | Int8Array | Uint16Array | Int16Array | Uint32Array | Int32Array>(array: T): T;
}
/**
 * Crypto implementation that works in both Node.js and browser environments
 */
export declare class CustomCrypto implements CryptoSubtle {
    subtle: CryptoSubtle['subtle'];
    getRandomValues: CryptoSubtle['getRandomValues'];
    constructor();
}
export declare const customCrypto: CustomCrypto;
export { generateKeyPair, getPublicKey, validateKeyPair } from './keys';
export { createEvent, signEvent, verifySignature } from './events';
export { encrypt as encryptMessage, decrypt as decryptMessage } from './encryption';
export { generateKeyPair as generatePrivateKey } from './keys';
