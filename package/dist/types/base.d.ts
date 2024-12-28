/**
 * Base types for Nostr protocol
 */
/**
 * Represents a key pair for Nostr cryptographic operations
 * @interface KeyPair
 */
export interface KeyPair {
    /** The private key in hex format (64 characters) */
    privateKey: string;
    /** The public key in hex format (64 characters) */
    publicKey: string;
}
/**
 * Base Nostr event interface as defined in NIP-01
 * @interface NostrEvent
 * @see {@link https://github.com/nostr-protocol/nips/blob/master/01.md}
 */
export interface NostrEvent {
    /** Event kind number (0=metadata, 1=text note, etc.) */
    kind: number;
    /** Event content. Format varies by kind */
    content: string;
    /** Unix timestamp in seconds */
    created_at: number;
    /** Array of tags. Each tag is an array of strings */
    tags: string[][];
    /** Public key of the event creator in hex format */
    pubkey?: string;
}
/**
 * Signed Nostr event interface, extending NostrEvent with required signature fields
 * @interface SignedNostrEvent
 */
export interface SignedNostrEvent extends NostrEvent {
    /** Event ID in hex format (64 characters) */
    id: string;
    /** Public key of the event creator in hex format (64 characters) */
    pubkey: string;
    /** Unix timestamp in seconds */
    created_at: number;
    /** Schnorr signature of the event ID in hex format (128 characters) */
    sig: string;
}
/**
 * Result of an encryption operation
 * @interface EncryptionResult
 */
export interface EncryptionResult {
    /** The encrypted content */
    ciphertext: string;
    /** The initialization vector used for encryption */
    iv: string;
}
/**
 * Result of a validation operation
 * @interface ValidationResult
 */
export interface ValidationResult {
    /** Whether the validation passed */
    isValid: boolean;
    /** Array of error messages if validation failed */
    errors: string[];
}
