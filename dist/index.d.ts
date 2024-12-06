import type { KeyPair, NostrEvent, SignedNostrEvent, ValidationResult } from './types';
/**
 * Generate a private key for use with NOSTR
 */
export declare function generatePrivateKey(): string;
/**
 * Get a public key from a private key
 */
export declare function getPublicKey(privateKey: string): string;
/**
 * Generate a new key pair
 */
export declare function generateKeyPair(): KeyPair;
/**
 * Get the hash of a NOSTR event
 */
export declare function getEventHash(event: NostrEvent): string;
/**
 * Sign a NOSTR event
 */
export declare function signEvent(event: NostrEvent, privateKey: string): SignedNostrEvent;
/**
 * Verify a signature
 */
export declare function verifySignature(event: SignedNostrEvent): boolean;
/**
 * Validate a key pair
 */
export declare function validateKeyPair(publicKey: string, privateKey: string): ValidationResult;
/**
 * Encrypt a message using NIP-04
 */
export declare function encrypt(message: string, recipientPubKey: string, senderPrivKey: string): Promise<string>;
/**
 * Decrypt a message using NIP-04
 */
export declare function decrypt(encryptedMessage: string, senderPubKey: string, recipientPrivKey: string): Promise<string>;
