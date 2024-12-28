/**
 * @module crypto/keys
 * @description Key pair generation and validation for Nostr
 */
import { KeyPair, ValidationResult, PublicKey } from '../types/base';
/**
 * Gets the compressed public key (33 bytes with prefix)
 */
declare function getCompressedPublicKey(privateKeyBytes: Uint8Array): Uint8Array;
/**
 * Gets the schnorr public key (32 bytes x-coordinate) as per BIP340
 */
declare function getSchnorrPublicKey(privateKeyBytes: Uint8Array): Uint8Array;
/**
 * Creates a PublicKey object from a hex string
 */
export declare function createPublicKey(hex: string): PublicKey;
/**
 * Generates a new key pair for use in Nostr
 */
export declare function generateKeyPair(seedPhrase?: string): Promise<KeyPair>;
/**
 * Gets the public key from a private key
 */
export declare function getPublicKey(privateKey: string): PublicKey;
/**
 * Validates a key pair
 */
export declare function validateKeyPair(keyPair: KeyPair): Promise<ValidationResult>;
/**
 * Validates a Nostr public key
 */
export declare function validatePublicKey(publicKey: PublicKey): boolean;
export { getCompressedPublicKey, getSchnorrPublicKey };
