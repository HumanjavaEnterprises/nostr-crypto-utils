/**
 * @module crypto/events
 * @description Event signing and verification for Nostr
 */

import { schnorr } from '@noble/curves/secp256k1';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { sha256 } from '@noble/hashes/sha256';
import type { NostrEvent, SignedNostrEvent, PublicKey } from '../types/base';
import { NostrEventKind } from '../types/base';
import { createPublicKey } from './keys';
import { logger } from '../utils';

interface EventInput {
  pubkey: PublicKey | string; // Required, can be either PublicKey object or hex string
  kind?: NostrEventKind;
  content?: string;
  tags?: string[][];
  created_at?: number;
}

/**
 * Creates an unsigned Nostr event
 */
export function createEvent(params: EventInput): NostrEvent {
  // Set default created_at if not provided
  if (!params.created_at) {
    params.created_at = Math.floor(Date.now() / 1000);
  }

  // Validate required fields
  if (!params.pubkey) {
    throw new Error('pubkey is required');
  }

  // Convert string pubkey to PublicKey object if needed
  const pubkeyObj = typeof params.pubkey === 'string' 
    ? createPublicKey(params.pubkey)
    : params.pubkey;

  return {
    kind: params.kind || NostrEventKind.TEXT_NOTE,
    created_at: params.created_at,
    content: params.content || '',
    pubkey: pubkeyObj,
    tags: params.tags || []
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

    // Create canonical event representation as per NIP-01
    const serialized = JSON.stringify([
      0,
      event.pubkey.hex,
      event.created_at,
      event.kind,
      event.tags || [],
      event.content || ''
    ]);

    // Calculate event hash as per NIP-01
    const eventHash = sha256(new TextEncoder().encode(serialized));

    // Sign the event hash using schnorr (privateKey, message)
    const sig = schnorr.sign(eventHash, privateKeyBytes);

    // Return signed event
    return {
      ...event,
      id: bytesToHex(eventHash),
      sig: bytesToHex(sig)
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
    // Create canonical event representation as per NIP-01
    const serialized = JSON.stringify([
      0,
      event.pubkey.hex,
      event.created_at,
      event.kind,
      event.tags || [],
      event.content || ''
    ]);

    // Calculate event hash as per NIP-01
    const eventHash = sha256(new TextEncoder().encode(serialized));

    // Verify event ID matches hash
    const calculatedId = bytesToHex(eventHash);
    if (calculatedId !== event.id) {
      logger.error('Event ID mismatch', { calculated: calculatedId, actual: event.id });
      return false;
    }

    // Convert signature and use schnorr public key
    const sigBytes = hexToBytes(event.sig);

    // Verify signature using schnorr (sig, message, pubKey)
    try {
      return schnorr.verify(sigBytes, eventHash, event.pubkey.schnorrBytes);
    } catch (error) {
      logger.error('Schnorr verification error:', error);
      return false;
    }
  } catch (error) {
    logger.error('Failed to verify signature:', error);
    return false;
  }
}
