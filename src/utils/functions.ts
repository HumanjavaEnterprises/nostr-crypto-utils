/**
 * @module utils/functions
 * @description General utility functions for Nostr operations
 */

import { NostrEvent } from '../types';
import { logger } from './logger';

/**
 * Formats an event for relay transmission
 */
export function formatEventForRelay(event: unknown): string {
  try {
    return JSON.stringify(['EVENT', event]);
  } catch (error) {
    logger.error({ error }, 'Failed to format event for relay');
    throw error;
  }
}

/**
 * Parses a Nostr message from a relay
 */
export function parseNostrMessage(message: string): unknown {
  try {
    return JSON.parse(message);
  } catch (error) {
    logger.error({ error }, 'Failed to parse Nostr message');
    throw error;
  }
}

/**
 * Creates a metadata event
 */
export function createMetadataEvent(metadata: unknown): NostrEvent {
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
    .filter((tag: string[]) => tag[0] === 'e')
    .map((tag: string[]) => tag[1]);
}

/**
 * Convert hex string to Uint8Array
 * @param hex - Hex string to convert
 * @returns Uint8Array
 */
export function hexToBytes(hex: string): Uint8Array {
  if (typeof hex !== 'string') {
    throw new Error('Input must be a string');
  }
  
  if (hex.length % 2 !== 0) {
    throw new Error('Hex string must have even length');
  }

  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    const hexByte = hex.slice(i * 2, i * 2 + 2);
    const byte = parseInt(hexByte, 16);
    if (isNaN(byte)) {
      throw new Error('Invalid hex string');
    }
    bytes[i] = byte;
  }
  return bytes;
}

/**
 * Convert a value to a string representation
 */
export function valueToString(value: unknown): string {
  if (value instanceof Error) {
    return value.message;
  }
  if (typeof value === 'object' && value !== null) {
    try {
      return JSON.stringify(value);
    } catch (error) {
      logger.error({ error }, 'Failed to stringify object');
      return String(value);
    }
  }
  return String(value);
}

/**
 * Get tag value from event
 */
export function getTagValue(event: NostrEvent, tagName: string): string | undefined {
  const tag = event.tags.find((t: string[]) => t[0] === tagName);
  return tag ? tag[1] : undefined;
}

/**
 * Get all tag values from event
 */
export function getTagValues(event: NostrEvent, tagName: string): string[] {
  return event.tags
    .filter((t: string[]) => t[0] === tagName)
    .map((t: string[]) => t[1]);
}
