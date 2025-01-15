/**
 * @module types/base
 * @description Core type definitions for Nostr protocol
 */

// Key Types
export type PublicKeyHex = string;
export type PrivateKeyHex = string;

export interface PublicKeyDetails {
  /** Public key in hex format */
  hex: string;
  /** NIP-05 identifier */
  nip05: string;
  /** Public key in bytes format */
  bytes: Uint8Array;
}

export type PublicKey = PublicKeyHex | PublicKeyDetails;

export interface KeyPair {
  /** Private key in hex format */
  privateKey: PrivateKeyHex;
  /** Public key details */
  publicKey: PublicKeyDetails;
}

// Event Types
export enum NostrEventKind {
  // NIP-01: Core Protocol
  SET_METADATA = 0,
  TEXT_NOTE = 1,
  RECOMMEND_SERVER = 2,
  CONTACTS = 3,
  ENCRYPTED_DIRECT_MESSAGE = 4,
  EVENT_DELETION = 5,
  REPOST = 6,
  REACTION = 7,

  // NIP-28: Public Chat
  CHANNEL_CREATION = 40,
  CHANNEL_METADATA = 41,
  CHANNEL_MESSAGE = 42,
  CHANNEL_HIDE_MESSAGE = 43,
  CHANNEL_MUTE_USER = 44,

  // NIP-42: Authentication
  AUTH = 22242,
  AUTH_RESPONSE = 22243
}

/** Base interface for all Nostr events */
export interface BaseNostrEvent {
  /** Event kind as defined in NIPs */
  kind: number;
  /** Content of the event */
  content: string;
  /** Array of tags */
  tags: string[][];
  /** Unix timestamp in seconds */
  created_at: number;
}

/** Interface for events that haven't been signed yet */
export interface UnsignedNostrEvent extends BaseNostrEvent {
  /** Optional public key */
  pubkey?: string;
}

/** Interface for signed events */
export interface SignedNostrEvent extends BaseNostrEvent {
  /** Public key of the event creator */
  pubkey: string;
  /** Event ID (sha256 of the serialized event) */
  id: string;
  /** Schnorr signature of the event ID */
  sig: string;
}

/** Alias for backward compatibility */
export type NostrEvent = SignedNostrEvent;

/** Type for creating new events */
export type UnsignedEvent = Omit<NostrEvent, 'id' | 'sig'>;

// Filter Types
export interface NostrFilter {
  ids?: string[];
  authors?: string[];
  kinds?: NostrEventKind[];
  since?: number;
  until?: number;
  limit?: number;
  '#e'?: string[];
  '#p'?: string[];
  search?: string;
  /** Support for arbitrary tags (NIP-12) */
  [key: `#${string}`]: string[] | undefined;
}

export interface NostrSubscription {
  id: string;
  filters: NostrFilter[];
}

// Message Types
export enum NostrMessageType {
  EVENT = 'EVENT',
  NOTICE = 'NOTICE',
  OK = 'OK',
  EOSE = 'EOSE',
  REQ = 'REQ',
  CLOSE = 'CLOSE',
  AUTH = 'AUTH'
}

export interface NostrMessage {
  type: NostrMessageType;
  event?: SignedNostrEvent;
  subscriptionId?: string;
  filters?: NostrFilter[];
  eventId?: string;
  accepted?: boolean;
  message?: string;
  count?: number;
  payload?: string | (string | boolean)[];  
}

export interface NostrResponse {
  type: NostrMessageType;
  event?: SignedNostrEvent;
  subscriptionId?: string;
  filters?: NostrFilter[];
  eventId?: string;
  accepted?: boolean;
  message?: string;
  count?: number;
}

// Utility Types
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface NostrError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
