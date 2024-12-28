/**
 * @module types/base
 * @description Base types for Nostr
 */

/**
 * Represents a public key
 */
export interface PublicKey {
  /** Public key in hex format */
  hex: string;
  /** Public key as bytes */
  bytes: Uint8Array;
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
  ids?: string[];
  authors?: string[];  // For compatibility, keep as string[]
  kinds?: NostrEventKind[];
  since?: number;
  until?: number;
  limit?: number;
  search?: string;
  [key: string]: any;
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
