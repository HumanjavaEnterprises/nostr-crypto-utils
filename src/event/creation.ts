/**
 * @module event/creation
 * @description Event creation and serialization utilities for Nostr
 */

import { sha256 } from '@noble/hashes/sha256.js';
import { bytesToHex } from '@noble/hashes/utils.js';
import { logger } from '../utils/logger.js';
import type { NostrEvent, NostrEventKind } from '../types/index.js';

/**
 * Creates a new Nostr event with the specified parameters
 * @param params - Event parameters
 * @returns Created event
 */
export function createEvent(params: {
  kind: NostrEventKind;
  content: string;
  tags?: string[][];
  created_at?: number;
  pubkey?: string;
}): NostrEvent {
  const { 
    kind, 
    content, 
    tags = [], 
    created_at = Math.floor(Date.now() / 1000), 
    pubkey = '' 
  } = params;
  
  return {
    kind,
    content,
    tags,
    created_at,
    pubkey,
  };
}

/**
 * Serializes a Nostr event for signing/hashing (NIP-01)
 * @param event - Event to serialize
 * @returns Serialized event JSON string
 */
export function serializeEvent(event: NostrEvent): string {
  return JSON.stringify([
    0,
    event.pubkey,
    event.created_at,
    event.kind,
    event.tags,
    event.content
  ]);
}

/**
 * Calculates the hash of a Nostr event (NIP-01)
 * @param event - Event to hash
 * @returns Event hash in hex format
 */
export async function getEventHash(event: NostrEvent): Promise<string> {
  try {
    const serialized = serializeEvent(event);
    const hash = await sha256(new TextEncoder().encode(serialized));
    return bytesToHex(hash);
  } catch (error) {
    logger.error({ error }, 'Failed to get event hash');
    throw error;
  }
}
