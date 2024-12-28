/**
 * @module types/base
 * @description Base types for Nostr
 */

/**
 * Represents a public key
 */
export interface PublicKey {
  /** Public key in hex format (33 bytes compressed) */
  hex: string;
  /** Public key in bytes format (33 bytes compressed) */
  bytes: Uint8Array;
  /** Schnorr public key in hex format (32 bytes x-coordinate) */
  schnorrHex: string;
  /** Schnorr public key in bytes format (32 bytes x-coordinate) */
  schnorrBytes: Uint8Array;
}

/**
 * Represents a key pair used for signing and encryption
 */
export interface KeyPair {
  /** Private key in hex format */
  privateKey: string;
  /** Public key */
  publicKey: PublicKey;
}

/**
 * Enum defining all possible Nostr event kinds as specified in various NIPs
 */
export enum NostrEventKind {
  /** NIP-01: Set metadata about the user who created the event */
  SET_METADATA = 0,
  /** NIP-01: Plain text note */
  TEXT_NOTE = 1,
  /** NIP-01: Recommend relay to followers */
  RECOMMEND_SERVER = 2,
  /** NIP-01: List of followed pubkeys and relays */
  CONTACTS = 3,
  /** NIP-04: Encrypted direct message */
  ENCRYPTED_DIRECT_MESSAGE = 4,
  /** NIP-09: Event deletion */
  EVENT_DELETION = 5,
  /** NIP-25: Reactions */
  REACTION = 7,
  /** NIP-28: Channel creation */
  CHANNEL_CREATE = 40,
  /** NIP-28: Channel metadata */
  CHANNEL_METADATA = 41,
  /** NIP-28: Channel message */
  CHANNEL_MESSAGE = 42,
  /** NIP-28: Hide message in channel */
  CHANNEL_HIDE = 43,
  /** NIP-28: Mute user in channel */
  CHANNEL_MUTE = 44
}

/**
 * Basic Nostr event interface
 */
export interface NostrEvent {
  kind: NostrEventKind;
  content: string;
  tags: string[][];
  created_at: number;
  pubkey: PublicKey;
}

/**
 * Signed Nostr event interface
 */
export interface SignedNostrEvent extends NostrEvent {
  /** Event ID (hex) */
  id: string;
  /** Signature (hex) */
  sig: string;
}

/**
 * Result of a validation operation
 */
export interface ValidationResult {
  /** Whether the validation passed */
  isValid: boolean;
  /** Error message if validation failed */
  error?: string;
}

/**
 * Filter for Nostr events
 */
export interface NostrFilter {
  /** Event IDs to match */
  ids?: string[];
  /** Author public keys to match */
  authors?: string[] | PublicKey[];
  /** Event kinds to match */
  kinds?: NostrEventKind[];
  /** Events after timestamp */
  since?: number;
  /** Events before timestamp */
  until?: number;
  /** Maximum number of events */
  limit?: number;
  /** Event references to match */
  '#e'?: string[];
  /** Pubkey references to match */
  '#p'?: string[] | PublicKey[];
  /** Tag references to match */
  '#t'?: string[];
  /** Search string */
  search?: string;
}

/**
 * Subscription for Nostr events
 */
export interface NostrSubscription {
  id: string;
  filters: NostrFilter[];
}

/**
 * Nostr message
 */
export interface NostrMessage {
  type: string;
  payload: any;
}

/**
 * Enum defining all possible Nostr message types
 */
export enum NostrMessageType {
  EVENT = 'EVENT',
  REQ = 'REQ',
  CLOSE = 'CLOSE',
  NOTICE = 'NOTICE',
  EOSE = 'EOSE',
  OK = 'OK',
  AUTH = 'AUTH',
  ERROR = 'ERROR'
}

/**
 * Nostr response
 */
export interface NostrResponse {
  success: boolean;
  message?: string;
  messageType: NostrMessageType;
  payload?: any;
}

/**
 * Nostr error
 */
export interface NostrError {
  code: string;
  message: string;
  details?: any;
}
