/**
 * @module transport
 * @description Functions for handling Nostr protocol messages and transport layer operations
 */

import { NostrEvent, NostrFilter, NostrMessageType } from '../types/base';

export interface NostrMessage {
  messageType: NostrMessageType;
  success: boolean;
  message?: string;
  payload?: unknown;
}

/**
 * Parses a Nostr message from a relay
 */
export function parseNostrMessage(message: unknown): { type: NostrMessageType; payload: unknown } | null {
  // Validate message format
  if (!Array.isArray(message)) {
    throw new Error('Invalid relay message: not an array');
  }
  if (message.length === 0) {
    throw new Error('Invalid relay message: empty array');
  }
  if (typeof message[0] !== 'string') {
    throw new Error('Invalid relay message: first element not a string');
  }

  const messageType = message[0] as NostrMessageType;
  switch (messageType) {
    case NostrMessageType.EVENT:
      return { type: NostrMessageType.EVENT, payload: message[1] };
    case NostrMessageType.REQ:
      return { type: NostrMessageType.REQ, payload: { id: message[1], filter: message[2] } };
    case NostrMessageType.CLOSE:
      return { type: NostrMessageType.CLOSE, payload: message[1] };
    case NostrMessageType.EOSE:
      return { type: NostrMessageType.EOSE, payload: message[1] };
    case NostrMessageType.OK:
      return { type: NostrMessageType.OK, payload: { id: message[1], success: message[2], message: message[3] } };
    default:
      throw new Error(`Unknown message type: ${messageType}`);
  }
}

/**
 * Formats an event for relay transmission
 */
export function formatEventForRelay(event: NostrEvent): [string, NostrEvent] {
  return ['EVENT', event];
}

/**
 * Formats a subscription request for relay transmission
 */
export function formatSubscriptionForRelay(id: string, filters: NostrFilter[]): [string, string, ...NostrFilter[]] {
  if (!Array.isArray(filters)) {
    throw new Error('filters must be an array');
  }
  return ['REQ', id, ...filters];
}

/**
 * Formats a close message for relay transmission
 */
export function formatCloseForRelay(id: string): [string, string] {
  return ['CLOSE', id];
}
