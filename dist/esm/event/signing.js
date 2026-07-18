/**
 * @module event/signing
 * @description Event signing and verification utilities for Nostr
 */
import { schnorr } from '@noble/curves/secp256k1.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils.js';
import { logger } from '../utils/logger.js';
import { getEventHash, serializeEvent } from './creation.js';
/**
 * Signs a Nostr event with a private key (NIP-01)
 * @param event - Event to sign
 * @param privateKey - Private key in hex format
 * @returns Signed event
 */
export async function signEvent(event, privateKey) {
    try {
        const hash = await getEventHash(event);
        const sig = schnorr.sign(hexToBytes(hash), hexToBytes(privateKey));
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
        // Recompute the id from the serialized event and require it to match the
        // claimed id BEFORE verifying the signature. Without this, an event whose
        // content/tags were swapped but whose (id, sig) remain a valid pair would
        // pass verification, letting forged content read as authentic.
        const computedId = bytesToHex(sha256(new TextEncoder().encode(serializeEvent(event))));
        if (computedId !== event.id) {
            logger.error('Event id does not match hash of content');
            return false;
        }
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
        logger.error({ error }, 'Error validating event');
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