/**
 * @module nips/nip-01
 * @description Implementation of NIP-01: Basic Protocol Flow Description
 * @see https://github.com/nostr-protocol/nips/blob/master/01.md
 */

import { schnorr } from '@noble/curves/secp256k1';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/curves/abstract/utils';
import { logger } from '../utils';
import type { NostrEvent, SignedNostrEvent } from '../types';

/**
 * Creates a new Nostr event with the specified parameters (NIP-01)
 * @param params - Event parameters
 * @returns Created event
 */
export function createEvent(params: {
  kind: number;
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
    const hash = sha256(new TextEncoder().encode(serialized));
    return bytesToHex(hash);
  } catch (error) {
    logger.error('Failed to get event hash:', error);
    throw error;
  }
}

/**
 * Signs a Nostr event with a private key (NIP-01)
 * @param event - Event to sign
 * @param privateKey - Private key in hex format
 * @returns Signed event
 */
export async function signEvent(
  event: NostrEvent, 
  privateKey: string
): Promise<SignedNostrEvent> {
  try {
    const hash = await getEventHash(event);
    const sig = schnorr.sign(hash, privateKey);
    
    return {
      ...event,
      id: hash,
      sig: bytesToHex(sig),
    };
  } catch (error) {
    logger.error('Failed to sign event:', error);
    throw error;
  }
}

/**
 * Verifies the signature of a signed Nostr event (NIP-01)
 * @param event - Event to verify
 * @returns True if signature is valid
 */
export function verifySignature(event: SignedNostrEvent): boolean {
  try {
    return schnorr.verify(event.sig, event.id, event.pubkey);
  } catch (error) {
    logger.error('Failed to verify signature:', error);
    return false;
  }
}

/**
 * Validates a Nostr event structure (NIP-01)
 * @param event - Event to validate
 * @returns True if event structure is valid
 */
export function validateEvent(event: NostrEvent): boolean {
  try {
    if (typeof event.content !== 'string') return false;
    if (typeof event.created_at !== 'number') return false;
    if (typeof event.kind !== 'number') return false;
    if (!Array.isArray(event.tags)) return false;
    if (typeof event.pubkey !== 'string') return false;
    
    // Validate tags structure
    for (const tag of event.tags) {
      if (!Array.isArray(tag)) return false;
      if (tag.length === 0) return false;
      if (typeof tag[0] !== 'string') return false;
    }
    
    return true;
  } catch (error) {
    logger.error('Failed to validate event:', error);
    return false;
  }
}
