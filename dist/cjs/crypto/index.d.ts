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
        importKey(format: 'raw' | 'pkcs8' | 'spki', keyData: ArrayBuffer, algorithm: RsaHashedImportParams | EcKeyImportParams | AesKeyAlgorithm, extractable: boolean, keyUsages: readonly KeyUsage[]): Promise<CryptoKey>;
        exportKey(format: 'raw' | 'pkcs8' | 'spki', key: CryptoKey): Promise<ArrayBuffer>;
        encrypt(algorithm: RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams, key: CryptoKey, data: ArrayBuffer): Promise<ArrayBuffer>;
        decrypt(algorithm: RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams, key: CryptoKey, data: ArrayBuffer): Promise<ArrayBuffer>;
    };
    getRandomValues<T extends Uint8Array | Int8Array | Uint16Array | Int16Array | Uint32Array | Int32Array>(array: T): T;
}
interface AesKeyAlgorithm {
    name: string;
    length: number;
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
import { KeyPair, PublicKeyDetails, NostrEvent, SignedNostrEvent } from '../types';
export declare const signSchnorr: (message: import("@noble/curves/abstract/utils").Hex, privateKey: import("@noble/curves/abstract/utils").PrivKey, auxRand?: import("@noble/curves/abstract/utils").Hex) => Uint8Array;
export declare const verifySchnorrSignature: (signature: import("@noble/curves/abstract/utils").Hex, message: import("@noble/curves/abstract/utils").Hex, publicKey: import("@noble/curves/abstract/utils").Hex) => boolean;
/**
 * Gets the public key from a private key
 * @param privateKey - Private key in hex format
 * @returns Public key details
 */
export declare function getPublicKey(privateKey: string): Promise<PublicKeyDetails>;
/**
 * Validates a key pair
 * @param keyPair - Key pair to validate
 * @returns True if valid
 */
export declare function validateKeyPair(keyPair: KeyPair): Promise<boolean>;
/**
 * Creates a new event
 * @param event - Event data
 * @returns Created event
 */
export declare function createEvent(event: Partial<NostrEvent>): NostrEvent;
/**
 * Signs an event
 * @param event - Event to sign
 * @param privateKey - Private key to sign with
 * @returns Signed event
 */
export declare function signEvent(event: NostrEvent, privateKey: string): Promise<SignedNostrEvent>;
/**
 * Verifies an event signature
 * @param event - Signed event to verify
 * @returns True if signature is valid
 */
export declare function verifySignature(event: SignedNostrEvent): Promise<boolean>;
/**
 * Encrypts a message
 * @param message - Message to encrypt
 * @param privateKey - Sender's private key
 * @param recipientPubKey - Recipient's public key hex
 * @returns Encrypted message
 */
export declare function encryptMessage(message: string, privateKey: string, recipientPubKey: string): Promise<string>;
/**
 * Decrypts a message
 * @param encryptedMessage - Encrypted message
 * @param privateKey - Recipient's private key
 * @param senderPubKey - Sender's public key hex
 * @returns Decrypted message
 * @throws Error if decryption fails
 */
export declare function decryptMessage(encryptedMessage: string, privateKey: string, senderPubKey: string): Promise<string>;
export {};
//# sourceMappingURL=index.d.ts.map