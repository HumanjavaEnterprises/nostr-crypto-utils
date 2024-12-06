import type { KeyPair, NostrEvent, SignedNostrEvent, ValidationResult } from './types';
/**
 * Generate a new secp256k1 key pair for use with NOSTR
 * @param seedPhrase - Optional seed phrase to use for key generation
 * @returns Promise<KeyPair> A promise that resolves to a key pair object
 */
export declare function generateKeyPair(seedPhrase?: string): Promise<KeyPair>;
/**
 * Derive a public key from a private key
 * @param privateKey - Hex-encoded private key
 * @returns Promise<string> A promise that resolves to the hex-encoded public key
 */
export declare function derivePublicKey(privateKey: string): Promise<string>;
/**
 * Validate a key pair
 * @param publicKey - Hex-encoded public key
 * @param privateKey - Hex-encoded private key
 * @returns Promise<ValidationResult> A promise that resolves to the validation result
 */
export declare function validateKeyPair(publicKey: string, privateKey: string): Promise<ValidationResult>;
/**
 * Calculate the hash of a NOSTR event
 * @param event - The event to hash
 * @returns Promise<string> A promise that resolves to the hex-encoded event hash
 */
export declare function getEventHash(event: NostrEvent): Promise<string>;
/**
 * Sign a NOSTR event
 * @param event - The event to sign
 * @param privateKey - Hex-encoded private key
 * @returns Promise<SignedNostrEvent> A promise that resolves to the signed event
 */
export declare function signEvent(event: NostrEvent, privateKey: string): Promise<SignedNostrEvent>;
/**
 * Verify the signature of a signed NOSTR event
 * @param event - The signed event to verify
 * @returns Promise<boolean> A promise that resolves to true if the signature is valid
 */
export declare function verifySignature(event: SignedNostrEvent): Promise<boolean>;
/**
 * Encrypt a message using NIP-04
 * @param message - The message to encrypt
 * @param recipientPubKey - Recipient's hex-encoded public key
 * @param senderPrivKey - Sender's hex-encoded private key
 * @returns Promise<string> A promise that resolves to the encrypted message
 */
export declare function encrypt(message: string, recipientPubKey: string, senderPrivKey: string): Promise<string>;
/**
 * Decrypt a message using NIP-04
 * @param encryptedMessage - The encrypted message
 * @param senderPubKey - Sender's hex-encoded public key
 * @param recipientPrivKey - Recipient's hex-encoded private key
 * @returns Promise<string> A promise that resolves to the decrypted message
 */
export declare function decrypt(encryptedMessage: string, senderPubKey: string, recipientPrivKey: string): Promise<string>;
