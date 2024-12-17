/**
 * Nostr protocol specific types and enums
 * @module protocol
 */

import { SignedNostrEvent } from './base';

/**
 * Standard Nostr message types as defined in NIP-01
 * @enum {string}
 * @see {@link https://github.com/nostr-protocol/nips/blob/master/01.md}
 */
export enum NostrMessageType {
  /** Client sending an event to a relay */
  EVENT = 'EVENT',
  /** Client requesting events from a relay */
  REQ = 'REQ',
  /** Client closing a subscription */
  CLOSE = 'CLOSE',
  /** Relay sending a notice/message to a client */
  NOTICE = 'NOTICE',
  /** Relay acknowledging an event */
  OK = 'OK',
  /** Relay requesting client authentication */
  AUTH = 'AUTH',
  /** Relay indicating end of stored events */
  EOSE = 'EOSE'
}

/**
 * Standard event kinds as defined in various NIPs
 * @enum {number}
 * @see {@link https://github.com/nostr-protocol/nips}
 */
export enum NostrEventKind {
  /** User metadata (NIP-01) - Contains user profile information in JSON format */
  METADATA = 0,
  /** Text note (NIP-01) - Basic text message or post */
  TEXT_NOTE = 1,
  /** Relay recommendation (NIP-01) - Suggests a relay URL to other users */
  RECOMMEND_SERVER = 2,
  /** Contact list (NIP-02) - List of followed pubkeys and relay URLs */
  CONTACTS = 3,
  /** Encrypted direct message (NIP-04) - End-to-end encrypted private message */
  ENCRYPTED_DIRECT_MESSAGE = 4,
  /** Event deletion (NIP-09) - Request to delete previous events */
  DELETE = 5,
  /** Event repost (NIP-18) - Share/repost another event */
  REPOST = 6,
  /** Reaction (NIP-25) - Emoji reaction to another event */
  REACTION = 7,
  /** Channel creation (NIP-28) - Creates a new chat channel */
  CHANNEL_CREATION = 40,
  /** Channel message (NIP-28) - Message in a chat channel */
  CHANNEL_MESSAGE = 42,
  /** Channel metadata (NIP-28) - Updates channel information */
  CHANNEL_METADATA = 41,
  /** Channel hide message (NIP-28) - Hides a message in a channel */
  CHANNEL_HIDE_MESSAGE = 43,
  /** Channel mute user (NIP-28) - Mutes a user in a channel */
  CHANNEL_MUTE_USER = 44
}

/**
 * Filter for querying events from relays (NIP-01)
 * Used to request specific events based on various criteria
 * @interface NostrFilter
 * @see {@link https://github.com/nostr-protocol/nips/blob/master/01.md#communication-between-clients-and-relays}
 */
export interface NostrFilter {
  /** List of event IDs to filter by */
  ids?: string[];
  /** List of pubkeys (authors) to filter by */
  authors?: string[];
  /** List of event kinds to filter by */
  kinds?: number[];
  /** List of referenced event IDs (e tag) */
  '#e'?: string[];
  /** List of referenced pubkeys (p tag) */
  '#p'?: string[];
  /** Return events after this timestamp */
  since?: number;
  /** Return events before this timestamp */
  until?: number;
  /** Maximum number of events to return */
  limit?: number;
  [key: `#${string}`]: string[] | undefined;
}

/**
 * Subscription request to a relay (NIP-01)
 * Used to establish a persistent connection for receiving events
 * @interface NostrSubscription
 * @see {@link https://github.com/nostr-protocol/nips/blob/master/01.md#from-client-to-relay-sending-events-and-creating-subscriptions}
 */
export interface NostrSubscription {
  /** Unique subscription identifier */
  id: string;
  /** Array of filters for this subscription */
  filters: NostrFilter[];
}

/**
 * Server response message from a relay
 * @interface NostrResponse
 * @see {@link https://github.com/nostr-protocol/nips/blob/master/01.md#communication-between-clients-and-relays}
 */
export interface NostrResponse {
  /** Type of response message */
  type: NostrMessageType;
  /** Response payload, varies by message type */
  payload: unknown;
}

/**
 * Error response from a relay
 * Provides detailed information about what went wrong
 * @interface NostrError
 */
export interface NostrError {
  /** Error code number */
  code: number;
  /** Human-readable error message */
  message: string;
  /** Additional error data (if any) */
  data?: unknown;
}

/**
 * Standard Nostr message format for client-relay communication
 * @interface NostrMessage
 * @see {@link https://github.com/nostr-protocol/nips/blob/master/01.md#communication-between-clients-and-relays}
 */
export interface NostrMessage {
  /** Message type (EVENT, REQ, etc.) */
  type: NostrMessageType;
  /** Subscription ID for subscription-related messages */
  subscriptionId?: string;
  /** Event data for EVENT messages */
  event?: SignedNostrEvent;
  /** Text message for NOTICE messages */
  message?: string;
}
