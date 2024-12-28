/**
 * @module utils/functions
 * @description General utility functions for Nostr operations
 */

import type { NostrEvent, SignedNostrEvent } from '../types';
import { logger } from './';

/**
 * Formats an event for relay transmission
 */
export function formatEventForRelay(event: SignedNostrEvent): string {
  try {
    return JSON.stringify(['EVENT', event]);
  } catch (error) {
    logger.error('Failed to format event for relay:', error);
    throw error;
  }
}

/**
 * Parses a Nostr message from a relay
 */
export function parseNostrMessage(message: string): any {
  try {
    return JSON.parse(message);
  } catch (error) {
    logger.error('Failed to parse Nostr message:', error);
    throw error;
  }
}

/**
 * Creates a metadata event
 */
export function createMetadataEvent(metadata: {
  name?: string;
  about?: string;
  picture?: string;
  [key: string]: any;
}): NostrEvent {
  return {
    kind: 0,
    created_at: Math.floor(Date.now() / 1000),
    tags: [],
    content: JSON.stringify(metadata),
    pubkey: ''
  };
}

/**
 * Extracts referenced events from tags
 */
export function extractReferencedEvents(event: NostrEvent): string[] {
  return event.tags
    .filter(tag => tag[0] === 'e')
    .map(tag => tag[1]);
}
