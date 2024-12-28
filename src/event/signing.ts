/**
 * @module event/signing
 * @description Event signing and verification utilities for Nostr
 */

import { schnorr } from '@noble/curves/secp256k1';
import { bytesToHex, hexToBytes } from '@noble/curves/abstract/utils';
import { logger } from '../utils/logger';
import { getEventHash } from './creation';
import type { NostrEvent, SignedNostrEvent } from '../types';

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
    logger.error({ error }, 'Failed to sign event');
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
    return schnorr.verify(
      hexToBytes(event.sig),
      hexToBytes(event.id),
      hexToBytes(event.pubkey)
    );
  } catch (error) {
    logger.error({ error }, 'Failed to verify signature');
    return false;
  }
}
