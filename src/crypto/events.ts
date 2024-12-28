/**
 * @module crypto/events
 * @description Functions for creating and signing Nostr events
 */

import { schnorr } from '@noble/curves/secp256k1';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { sha256 } from '@noble/hashes/sha256';
import { NostrEvent, SignedNostrEvent, NostrEventKind, PublicKey } from '../types/base';
import { getPublicKey } from './keys';
import { logger } from '../utils';
import { _internal } from './keys';

interface EventInput {
  pubkey?: PublicKey | string; // Can be either PublicKey object or hex string
  kind: NostrEventKind; // Required
  created_at?: number; // Optional
  content?: string; // Optional
  tags?: string[][]; // Optional
}

/**
 * Creates an unsigned Nostr event
 */
export function createEvent(params: EventInput): NostrEvent {
  if (!params.pubkey) {
    throw new Error('pubkey is required');
  }

  // Convert string pubkey to PublicKey object if needed
  const pubkeyObj = typeof params.pubkey === 'string' 
    ? { hex: params.pubkey, bytes: hexToBytes(params.pubkey) }
    : params.pubkey;

  return {
    kind: params.kind || NostrEventKind.TEXT_NOTE,
    content: params.content || '',
    tags: params.tags || [],
    created_at: params.created_at || Math.floor(Date.now() / 1000),
    pubkey: pubkeyObj
  };
}

/**
 * Signs a Nostr event
 */
export async function signEvent(event: NostrEvent, privateKey: string): Promise<SignedNostrEvent> {
  // Validate required fields
  if (!event) {
    throw new Error('Event is required');
  }

  if (!privateKey) {
    throw new Error('Private key is required');
  }

  try {
    // Convert private key to bytes
    const privateKeyBytes = hexToBytes(privateKey);

    // Create canonical event representation
    const serialized = JSON.stringify([
      0,
      event.pubkey.hex,
      event.created_at,
      event.kind,
      event.tags,
      event.content
    ]);

    // Calculate event ID
    const eventHash = sha256(new TextEncoder().encode(serialized));
    const id = bytesToHex(eventHash);

    // Sign the event hash
    const sig = bytesToHex(schnorr.sign(eventHash, privateKeyBytes));

    // Return signed event
    return {
      ...event,
      id,
      sig
    };
  } catch (error) {
    logger.error('Failed to sign event:', error);
    throw new Error('Failed to sign event: ' + (error instanceof Error ? error.message : String(error)));
  }
}

/**
 * Verifies a signed Nostr event
 */
export async function verifySignature(event: SignedNostrEvent): Promise<boolean> {
  try {
    // Create canonical event representation
    const serialized = JSON.stringify([
      0,
      event.pubkey.hex,
      event.created_at,
      event.kind,
      event.tags,
      event.content
    ]);

    // Calculate event hash
    const eventHash = sha256(new TextEncoder().encode(serialized));

    // Verify signature using schnorr
    return schnorr.verify(hexToBytes(event.sig), eventHash, event.pubkey.bytes);
  } catch (error) {
    logger.error('Failed to verify signature:', error);
    return false;
  }
}
