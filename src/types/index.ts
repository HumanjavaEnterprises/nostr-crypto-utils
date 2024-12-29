/**
 * @module types
 * @description Type definitions for Nostr protocol
 * @see https://github.com/nostr-protocol/nips
 */

/**
 * Re-export all types from base module
 * @packageDocumentation
 */
export type {
  /** Public key type */
  PublicKey,
  /** Public key in hex format */
  PublicKeyHex,
  /** Detailed public key information */
  PublicKeyDetails,
  /** Key pair for signing and encryption */
  KeyPair,
  /** Basic Nostr event */
  NostrEvent,
  /** Signed Nostr event */
  SignedNostrEvent,
  /** Validation result */
  ValidationResult,
  /** Nostr event filter */
  NostrFilter,
  /** Nostr subscription */
  NostrSubscription,
  /** Nostr message */
  NostrMessage,
  /** Nostr response */
  NostrResponse,
  /** Nostr error */
  NostrError,
  /** Encryption result */
  EncryptionResult,
} from './base';

/**
 * Re-export specific enums from base module
 * @packageDocumentation
 */
export { 
  /** Nostr event kind */
  NostrEventKind, 
  /** Nostr message type */
  NostrMessageType 
} from './base';

export * from './guards';
