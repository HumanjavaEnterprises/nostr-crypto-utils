/**
 * @module crypto/events
 * @description Event signing and verification for Nostr
 */

import { NostrEvent, SignedNostrEvent } from '../types';
import { logger } from '../utils/logger';
import { schnorr } from '@noble/curves/secp256k1';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { sha256 } from '@noble/hashes/sha256';
import { NostrEventKind } from '../types/base';
import { createPublicKey } from './keys';

interface EventInput {
  pubkey: string; // Required, must be hex string
  kind?: number; // Optional, defaults to TEXT_NOTE
  content?: string; // Optional, defaults to empty string
  tags?: string[][]; // Optional, defaults to empty array
  created_at?: number; // Optional, defaults to current timestamp
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

  // Validate pubkey format
  if (!/^[0-9a-f]{64}$/i.test(params.pubkey)) {
    throw new Error('Invalid public key format');
  }

  return {
    kind: params.kind || NostrEventKind.TEXT_NOTE,
    created_at: params.created_at,
    content: params.content || '',
    pubkey: params.pubkey,
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
      event.pubkey,
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
    logger.error({ error }, 'Failed to sign event');
    throw error;
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
      event.pubkey,
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
      logger.error({ calculated: calculatedId, actual: event.id }, 'Event ID mismatch');
      return false;
    }

    // Convert signature and pubkey
    const sigBytes = hexToBytes(event.sig);
    const pubkeyObj = createPublicKey(event.pubkey);
    const pubkeyBytes = pubkeyObj.schnorrBytes;

    // Verify signature using schnorr (sig, message, pubKey)
    try {
      return schnorr.verify(sigBytes, eventHash, pubkeyBytes);
    } catch (error) {
      logger.error({ error }, 'Schnorr verification error');
      return false;
    }
  } catch (error) {
    logger.error({ error }, 'Failed to verify signature');
    return false;
  }
}
