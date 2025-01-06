/**
 * @module crypto/keys
 * @description Key pair generation and validation for Nostr
 */
import { KeyPair, PublicKeyDetails, ValidationResult, PublicKey } from '../types';
/**
 * Gets the compressed public key (33 bytes with prefix)
 */
declare function getCompressedPublicKey(privateKeyBytes: Uint8Array): Uint8Array;
/**
 * Gets the schnorr public key (32 bytes x-coordinate) as per BIP340
 */
declare function getSchnorrPublicKey(privateKeyBytes: Uint8Array): Uint8Array;
/**
 * Creates a PublicKeyDetails object from a hex string
 */
export declare function createPublicKey(hex: string): PublicKeyDetails;
/**
 * Generates a new key pair for use in Nostr
 */
export declare function generateKeyPair(seedPhrase?: string): Promise<KeyPair>;
/**
 * Gets the public key from a private key
 */
export declare function getPublicKey(privateKey: string): PublicKeyDetails;
/**
 * Validates a key pair
 */
export declare function validateKeyPair(publicKey: PublicKey, privateKey: string): Promise<ValidationResult>;
/**
 * Validates a Nostr public key
 */
export declare function validatePublicKey(publicKey: string): boolean;
export { getCompressedPublicKey, getSchnorrPublicKey };
//# sourceMappingURL=keys.d.ts.map