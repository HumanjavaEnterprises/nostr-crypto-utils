/**
 * @module types/base
 * @description Core type definitions for Nostr protocol
 */

/**
 * Represents a public key in hex format
 * @see https://github.com/nostr-protocol/nips/blob/master/01.md
 */
export type PublicKeyHex = string;

/**
 * Represents a public key with additional formats
 * @see https://github.com/nostr-protocol/nips/blob/master/01.md
 */
export interface PublicKeyDetails {
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
 * Public key can be either a hex string or a detailed object
 */
export type PublicKey = PublicKeyHex | PublicKeyDetails;

/**
 * Key pair used for signing and encryption
 * @see https://github.com/nostr-protocol/nips/blob/master/01.md
 */
export interface KeyPair {
  /** Private key in hex format */
  privateKey: string;
  /** Public key details */
  publicKey: PublicKeyDetails;
}

/**
 * Enum defining all possible Nostr event kinds as specified in various NIPs
 * @see https://github.com/nostr-protocol/nips
 */
export enum NostrEventKind {
  /** NIP-01: Set metadata about the user */
  SET_METADATA = 0,
  /** NIP-01: Plain text note */
  TEXT_NOTE = 1,
  /** NIP-01: Recommend relay to followers */
  RECOMMEND_SERVER = 2,
  /** NIP-02: Contact list and relay list metadata */
  CONTACTS = 3,
  /** NIP-04: Encrypted direct message */
  ENCRYPTED_DIRECT_MESSAGE = 4,
  /** NIP-09: Event deletion */
  EVENT_DELETION = 5,
  /** NIP-25: Reactions to events */
  REACTION = 7,
  /** NIP-28: Channel creation */
  CHANNEL_CREATE = 40,
  /** NIP-28: Channel metadata */
  CHANNEL_METADATA = 41,
  /** NIP-28: Channel message */
  CHANNEL_MESSAGE = 42,
  /** NIP-28: Hide message in channel */
  CHANNEL_HIDE_MESSAGE = 43,
  /** NIP-28: Mute user in channel */
  CHANNEL_MUTE_USER = 44,
  /** NIP-42: Authentication */
  AUTH = 22242,
  /** NIP-42: Authentication response */
  AUTH_RESPONSE = 22243
}

/**
 * Basic Nostr event interface
 * @see https://github.com/nostr-protocol/nips/blob/master/01.md
 */
export interface NostrEvent {
  /** Event kind as defined in NIPs */
  kind: NostrEventKind;
  /** Content of the event */
  content: string;
  /** Array of tags associated with the event */
  tags: string[][];
  /** Unix timestamp in seconds */
  created_at: number;
  /** Public key of the event creator in hex format */
  pubkey: string;
}

/**
 * Signed Nostr event interface, extends NostrEvent with signature
 * @see https://github.com/nostr-protocol/nips/blob/master/01.md
 */
export interface SignedNostrEvent extends NostrEvent {
  /** Event ID (32-bytes sha256 of the serialized event data) */
  id: string;
  /** Schnorr signature of the event ID */
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
 * @see https://github.com/nostr-protocol/nips/blob/master/01.md
 */
export interface NostrFilter {
  /** Filter by event IDs */
  ids?: string[];
  /** Filter by author public keys */
  authors?: string[];
  /** Filter by event kinds */
  kinds?: NostrEventKind[];
  /** Filter by start timestamp */
  since?: number;
  /** Filter by end timestamp */
  until?: number;
  /** Limit number of results */
  limit?: number;
  /** Filter by event references */
  '#e'?: string[];
  /** Filter by pubkey references */
  '#p'?: string[];
  /** Filter by arbitrary tag */
  [key: `#${string}`]: string[] | undefined;
  /** Full-text search query */
  search?: string;
}

/**
 * Subscription for Nostr events
 * @see https://github.com/nostr-protocol/nips/blob/master/01.md
 */
export interface NostrSubscription {
  /** Unique subscription identifier */
  id: string;
  /** Array of filters to apply to the subscription */
  filters: NostrFilter[];
}

/**
 * Nostr message types for client-relay communication
 * @see https://github.com/nostr-protocol/nips/blob/master/01.md
 */
export enum NostrMessageType {
  EVENT = 'EVENT',
  REQ = 'REQ',
  CLOSE = 'CLOSE',
  NOTICE = 'NOTICE',
  EOSE = 'EOSE',
  OK = 'OK',
  AUTH = 'AUTH',
  ERROR = 'ERROR',
  COUNT = 'COUNT'
}

/**
 * Nostr message interface
 */
export interface NostrMessage {
  /** Type of the message */
  type: NostrMessageType;
  /** Payload of the message */
  payload: unknown;
}

/**
 * Nostr response interface
 */
export interface NostrResponse {
  /** Type of the response */
  type: NostrMessageType;
  /** Event data if applicable */
  event?: SignedNostrEvent;
  /** Subscription ID if applicable */
  subscriptionId?: string;
  /** Filters if applicable */
  filters?: NostrFilter[];
  /** Event ID if applicable */
  eventId?: string;
  /** Whether the request was accepted */
  accepted?: boolean;
  /** Message if applicable */
  message?: string;
}

/**
 * Nostr error interface
 */
export interface NostrError {
  /** Error code */
  code: string;
  /** Error message */
  message: string;
  /** Additional error details */
  details?: Record<string, unknown>;
}

/**
 * Encryption result interface
 */
export interface EncryptionResult {
  /** Encrypted ciphertext */
  ciphertext: string;
  /** Initialization vector */
  iv: string;
}
