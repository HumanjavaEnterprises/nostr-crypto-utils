/**
 * @module crypto
 * @description Cryptographic utilities for Nostr
 */
import { KeyPair, PublicKeyDetails, ValidationResult, NostrEvent, SignedNostrEvent, PublicKey } from './types/index.js';
/**
 * Custom crypto interface for cross-platform compatibility
 */
export interface CryptoSubtle {
    subtle: {
        generateKey(algorithm: RsaHashedKeyGenParams | EcKeyGenParams, extractable: boolean, keyUsages: readonly KeyUsage[]): Promise<CryptoKeyPair>;
        importKey(format: 'raw' | 'pkcs8' | 'spki', keyData: ArrayBuffer, algorithm: RsaHashedImportParams | EcKeyImportParams | AesKeyAlgorithm, extractable: boolean, keyUsages: readonly KeyUsage[]): Promise<CryptoKey>;
        encrypt(algorithm: {
            name: string;
            iv: Uint8Array;
        }, key: CryptoKey, data: ArrayBuffer): Promise<ArrayBuffer>;
        decrypt(algorithm: {
            name: string;
            iv: Uint8Array;
        }, key: CryptoKey, data: ArrayBuffer): Promise<ArrayBuffer>;
    };
    getRandomValues<T extends Uint8Array | Int8Array | Uint16Array | Int16Array | Uint32Array | Int32Array>(array: T): T;
}
/**
 * Crypto implementation that works in both Node.js and browser environments
 */
declare class CustomCrypto {
    readonly subtle: CryptoSubtle['subtle'];
    readonly getRandomValues: CryptoSubtle['getRandomValues'];
    constructor();
}
export declare const customCrypto: CustomCrypto;
export declare const signSchnorr: (message: import("@noble/curves/abstract/utils").Hex, privateKey: import("@noble/curves/abstract/utils").PrivKey, auxRand?: import("@noble/curves/abstract/utils").Hex) => Uint8Array;
export declare const verifySchnorrSignature: (signature: import("@noble/curves/abstract/utils").Hex, message: import("@noble/curves/abstract/utils").Hex, publicKey: import("@noble/curves/abstract/utils").Hex) => boolean;
/**
 * Gets the compressed public key (33 bytes with prefix)
 */
export declare function getCompressedPublicKey(privateKeyBytes: Uint8Array): Uint8Array;
/**
 * Gets the schnorr public key (32 bytes x-coordinate) as per BIP340
 */
export declare function getSchnorrPublicKey(privateKeyBytes: Uint8Array): Uint8Array;
/**
 * Generates a new key pair
 */
export declare function generateKeyPair(): Promise<KeyPair>;
/**
 * Gets the public key from a private key
 */
export declare function getPublicKey(privateKey: string): Promise<PublicKeyDetails>;
/**
 * Validates a key pair
 */
export declare function validateKeyPair(publicKey: PublicKey, privateKey: string): Promise<ValidationResult>;
/**
 * Creates a new event
 */
export declare function createEvent(event: Partial<NostrEvent>): NostrEvent;
/**
 * Signs an event
 */
export declare function signEvent(event: NostrEvent, privateKey: string): Promise<SignedNostrEvent>;
/**
 * Verifies an event signature
 */
export declare function verifySignature(event: SignedNostrEvent): Promise<boolean>;
/**
 * Encrypts a message using NIP-04
 */
export declare function encrypt(message: string, recipientPubKey: PublicKey | string, senderPrivKey: string): Promise<string>;
/**
 * Decrypts a message using NIP-04
 */
export declare function decrypt(encryptedMessage: string, senderPubKey: PublicKey | string, recipientPrivKey: string): Promise<string>;
export {};
//# sourceMappingURL=crypto.d.ts.map