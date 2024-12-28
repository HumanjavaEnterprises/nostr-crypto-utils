/**
 * @module types/protocol
 * @description Nostr protocol types
 */

import type { SignedNostrEvent as NostrEvent, NostrFilter, PublicKey } from './base';

// Re-export types from base that are used in this module
export type { NostrFilter, PublicKey };

/**
 * Standard Nostr message types as defined in NIP-01
 * @enum {string}
 * @see {@link https://github.com/nostr-protocol/nips/blob/master/01.md}
 */
export type NostrMessageType = 'EVENT' | 'REQ' | 'CLOSE' | 'NOTICE' | 'EOSE' | 'OK' | 'AUTH';

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
  payload?: unknown;
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
  type: NostrMessageType;
  /**
   * Human-readable error message
   */
  message: string;
}
