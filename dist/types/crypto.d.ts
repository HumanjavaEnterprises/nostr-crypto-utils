/**
 * @module crypto
 * @description Cryptographic utilities for Nostr
 *
 * IMPORTANT: Nostr Protocol Cryptographic Requirements
 * While secp256k1 is the underlying elliptic curve used by Nostr, the protocol specifically
 * requires schnorr signatures as defined in NIP-01. This means:
 *
 * 1. Always use schnorr-specific functions:
 *    - schnorr.getPublicKey() for public key generation
 *    - schnorr.sign() for signing
 *    - schnorr.verify() for verification
 *
 * 2. Avoid using secp256k1 functions directly:
 *    - DON'T use secp256k1.getPublicKey()
 *    - DON'T use secp256k1.sign()
 *    - DON'T use secp256k1.verify()
 *
 * While both might work in some cases (as they use the same curve), the schnorr signature
 * scheme has specific requirements for key and signature formats that aren't guaranteed
 * when using the lower-level secp256k1 functions directly.
 */
import { KeyPair, PublicKeyDetails, NostrEvent, SignedNostrEvent, PublicKey } from './types/index';
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
declare global {
    interface Window {
        crypto: CryptoSubtle;
    }
    interface Global {
        crypto: CryptoSubtle;
    }
}
/**
 * Crypto implementation that works in both Node.js and browser environments
 */
declare class CustomCrypto {
    private cryptoInstance;
    private initPromise;
    constructor();
    private initialize;
    private ensureInitialized;
    getSubtle(): Promise<CryptoSubtle['subtle']>;
    getRandomValues<T extends Uint8Array | Int8Array | Uint16Array | Int16Array | Uint32Array | Int32Array>(array: T): Promise<T>;
}
export declare const customCrypto: CustomCrypto;
export declare const signSchnorr: (message: import("@noble/curves/utils").Hex, secretKey: import("@noble/curves/utils").PrivKey, auxRand?: import("@noble/curves/utils").Hex) => Uint8Array;
export declare const verifySchnorrSignature: (signature: import("@noble/curves/utils").Hex, message: import("@noble/curves/utils").Hex, publicKey: import("@noble/curves/utils").Hex) => boolean;
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
 * Gets a public key from a private key
 */
export declare function getPublicKey(privateKey: string): Promise<PublicKeyDetails>;
/**
 * Validates a key pair
 */
export declare function validateKeyPair(keyPair: KeyPair): Promise<boolean>;
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