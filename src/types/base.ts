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
 * Represents a key pair used for signing and encryption
 * @see https://github.com/nostr-protocol/nips/blob/master/01.md
 */
export interface KeyPair {
  privateKey: string;
  publicKey: PublicKeyDetails;
}

/**
 * Enum defining all possible Nostr event kinds as specified in various NIPs
 * @see https://github.com/nostr-protocol/nips
 */
export enum NostrEventKind {
  SET_METADATA = 0,
  TEXT_NOTE = 1,
  RECOMMEND_SERVER = 2,
  CONTACTS = 3,
  ENCRYPTED_DIRECT_MESSAGE = 4,
  EVENT_DELETION = 5,
  REACTION = 7,
  CHANNEL_CREATE = 40,
  CHANNEL_METADATA = 41,
  CHANNEL_MESSAGE = 42,
  CHANNEL_HIDE_MESSAGE = 43,
  CHANNEL_MUTE_USER = 44,
  AUTH = 22242,
  AUTH_RESPONSE = 22243
}

/**
 * Basic Nostr event interface
 * @see https://github.com/nostr-protocol/nips/blob/master/01.md
 */
export interface NostrEvent {
  kind: NostrEventKind;
  content: string;
  tags: string[][];
  created_at: number;
  pubkey: string;
}

/**
 * Signed Nostr event interface
 * @see https://github.com/nostr-protocol/nips/blob/master/01.md
 */
export interface SignedNostrEvent extends NostrEvent {
  id: string;
  sig: string;
}

/**
 * Result of a validation operation
 */
export interface ValidationResult {
  isValid: boolean;
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
  id: string;
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
  type: NostrMessageType;
  payload: unknown;
}

/**
 * Nostr response interface
 */
export interface NostrResponse {
  type: NostrMessageType;
  event?: SignedNostrEvent;
  subscriptionId?: string;
  filters?: NostrFilter[];
  eventId?: string;
  accepted?: boolean;
  message?: string;
}

/**
 * Nostr error interface
 */
export interface NostrError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Encryption result interface
 */
export interface EncryptionResult {
  ciphertext: string;
  iv: string;
}
