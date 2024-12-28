/**
 * @module types/protocol
 * @description Nostr protocol types
 */

import type { SignedNostrEvent as NostrEvent } from './base';

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
  /** Relay indicating end of stored events */
  EOSE = 'EOSE',
  /** Authentication request/response */
  AUTH = 'AUTH'
}

/**
 * Event kinds as defined in NIP-01
 * @enum {number}
 * @see {@link https://github.com/nostr-protocol/nips/blob/master/01.md#event-kinds}
 */
export enum NostrEventKind {
  TEXT_NOTE = 1,
  CONTACTS = 3,
  ENCRYPTED_DIRECT_MESSAGE = 4,
  EVENT_DELETION = 5
}

/**
 * Filter for querying events from relays (NIP-01)
 * Used to request specific events based on various criteria
 * @interface NostrFilter
 * @see {@link https://github.com/nostr-protocol/nips/blob/master/01.md#communication-between-clients-and-relays}
 */
export interface NostrFilter {
  /**
   * List of event IDs to match
   */
  ids?: string[];
  /**
   * List of pubkeys to match as event authors
   */
  authors?: PublicKey[];
  /**
   * List of event kinds to match
   */
  kinds?: NostrEventKind[];
  /**
   * Events created after this timestamp
   */
  since?: number;
  /**
   * Events created before this timestamp
   */
  until?: number;
  /**
   * Maximum number of events to return
   */
  limit?: number;
  /**
   * List of event tags to match
   */
  '#e'?: string[];
  /**
   * List of pubkeys to match as event p tags
   */
  '#p'?: PublicKey[];
  /**
   * List of event tags to match
   */
  '#t'?: string[];
}

/**
 * Subscription request to a relay (NIP-01)
 * Used to establish a persistent connection for receiving events
 * @interface NostrSubscription
 * @see {@link https://github.com/nostr-protocol/nips/blob/master/01.md#from-client-to-relay-sending-events-and-creating-subscriptions}
 */
export interface NostrSubscription {
  /**
   * Unique identifier for this subscription
   */
  id: string;
  /**
   * Array of filters to apply. Events matching any filter will be returned
   */
  filters: NostrFilter[];
}

/**
 * Server response message from a relay
 * @interface NostrResponse
 * @see {@link https://github.com/nostr-protocol/nips/blob/master/01.md#communication-between-clients-and-relays}
 */
export interface NostrResponse {
  /**
   * Type of response message
   */
  type: NostrMessageType;
  /**
   * Subscription ID for subscription-related messages
   */
  subscriptionId?: string;
  /**
   * Event data for EVENT messages
   */
  event?: NostrEvent;
  /**
   * Text message for NOTICE messages
   */
  message?: string;
  /**
   * Payload data for AUTH messages
   */
  payload?: any;
}

/**
 * Error response from a relay
 * Provides detailed information about what went wrong
 * @interface NostrError
 */
export interface NostrError {
  /**
   * Error code for programmatic handling
   */
  type: NostrMessageType.NOTICE;
  /**
   * Human-readable error message
   */
  message: string;
}

/**
 * Public key representation
 */
export type PublicKey = {
  bytes: Uint8Array;
  hex: string;
}
