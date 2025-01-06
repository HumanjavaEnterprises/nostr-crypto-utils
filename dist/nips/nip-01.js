/**
 * @module nips/nip-01
 * @description Implementation of NIP-01: Basic Protocol Flow Description
 * @see https://github.com/nostr-protocol/nips/blob/master/01.md
 */
import { schnorr } from '@noble/curves/secp256k1';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex, hexToBytes } from '@noble/curves/abstract/utils';
import { logger } from '../utils/logger';
/**
 * Creates a new Nostr event with the specified parameters (NIP-01)
 * @param params - Event parameters
 * @returns Created event
 */
export function createEvent(params) {
    const { kind, content, tags = [], created_at = Math.floor(Date.now() / 1000), pubkey = '' } = params;
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
export function serializeEvent(event) {
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
export async function getEventHash(event) {
    try {
        const serialized = serializeEvent(event);
        const hash = sha256(new TextEncoder().encode(serialized));
        return bytesToHex(hash);
    }
    catch (error) {
        logger.error({ error }, 'Failed to get event hash');
        throw error;
    }
}
/**
 * Signs a Nostr event with a private key (NIP-01)
 * @param event - Event to sign
 * @param privateKey - Private key in hex format
 * @returns Signed event
 */
export async function signEvent(event, privateKey) {
    try {
        const hash = await getEventHash(event);
        const sig = schnorr.sign(hexToBytes(hash), privateKey);
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
        // Verify event ID
        const expectedId = calculateEventId(event);
        if (event.id !== expectedId) {
            return false;
        }
        // Verify signature
        return schnorr.verify(hexToBytes(event.sig), hexToBytes(event.id), hexToBytes(event.pubkey));
    }
    catch (error) {
        logger.error({ error }, 'Failed to verify signature');
        return false;
    }
}
/**
 * Calculates the event ID according to NIP-01
 * @param event - Event to calculate ID for
 * @returns Event ID in hex format
 */
export function calculateEventId(event) {
    const serialized = serializeEvent(event);
    const hash = sha256(new TextEncoder().encode(serialized));
    return bytesToHex(hash);
}
/**
 * Validates a Nostr event structure (NIP-01)
 * @param event - Event to validate
 * @returns True if event structure is valid
 */
export function validateEvent(event) {
    try {
        if (typeof event.content !== 'string')
            return false;
        if (typeof event.created_at !== 'number')
            return false;
        if (typeof event.kind !== 'number')
            return false;
        if (!Array.isArray(event.tags))
            return false;
        if (typeof event.pubkey !== 'string')
            return false;
        // Validate tags structure
        for (const tag of event.tags) {
            if (!Array.isArray(tag))
                return false;
            if (tag.length === 0)
                return false;
            if (typeof tag[0] !== 'string')
                return false;
        }
        return true;
    }
    catch (error) {
        logger.error({ error }, 'Failed to validate event');
        return false;
    }
}
//# sourceMappingURL=nip-01.js.map