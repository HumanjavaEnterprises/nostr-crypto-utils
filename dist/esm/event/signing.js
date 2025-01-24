/**
 * @module event/signing
 * @description Event signing and verification utilities for Nostr
 */
import { schnorr } from '@noble/curves/secp256k1';
import { bytesToHex, hexToBytes } from '@noble/curves/abstract/utils';
import { logger } from '../utils/logger';
import { getEventHash } from './creation';
/**
 * Signs a Nostr event with a private key (NIP-01)
 * @param event - Event to sign
 * @param privateKey - Private key in hex format
 * @returns Signed event
 */
export async function signEvent(event, privateKey) {
    try {
        const hash = await getEventHash(event);
        const sig = schnorr.sign(hash, privateKey);
        return {
            ...event,
            id: hash,
            sig: bytesToHex(sig),
        };
    }
    catch (error) {
        logger.error({ error }, 'Failed to sign event');
        throw error;
    }
}
/**
 * Verifies the signature of a signed Nostr event (NIP-01)
 * @param event - Event to verify
 * @returns True if signature is valid
 */
export function verifySignature(event) {
    try {
        return schnorr.verify(hexToBytes(event.sig), hexToBytes(event.id), hexToBytes(event.pubkey));
    }
    catch (error) {
        logger.error({ error }, 'Failed to verify signature');
        return false;
    }
}
/**
 * Validates a Nostr event
 * @param event - Event to validate
 * @returns True if event is valid
 */
export function validateEvent(event) {
    try {
        // Check required fields
        if (!event.id || !event.pubkey || !event.sig) {
            return false;
        }
        // Verify signature
        return verifySignature(event);
    }
    catch (error) {
        logger.error('Error validating event:', error);
        return false;
    }
}
/**
 * Calculates the event ID for a Nostr event
 * @param event - Event to calculate ID for
 * @returns Event ID
 */
export function calculateEventId(event) {
    return getEventHash(event);
}
//# sourceMappingURL=signing.js.map