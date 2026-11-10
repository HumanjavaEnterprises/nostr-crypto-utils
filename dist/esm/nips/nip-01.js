/**
 * @module nips/nip-01
 * @description Implementation of NIP-01: Basic Protocol Flow Description
 * @see https://github.com/nostr-protocol/nips/blob/master/01.md
 */
import { schnorr } from '@noble/curves/secp256k1.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils.js';
import { logger } from '../utils/logger.js';
import { isHex32, isHex64 } from '../utils/strict-hex.js';
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
        logger.debug({ error }, 'Failed to get event hash');
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
        const privateKeyBytes = hexToBytes(privateKey);
        // Same rule as the root signEvent: never produce an unverifiable event.
        const derivedPubkey = bytesToHex(schnorr.getPublicKey(privateKeyBytes));
        if (!event.pubkey) {
            event = { ...event, pubkey: derivedPubkey };
        }
        else if (event.pubkey !== derivedPubkey) {
            throw new Error('event.pubkey does not match the signing key');
        }
        const hash = await getEventHash(event);
        const sig = schnorr.sign(hexToBytes(hash), privateKeyBytes);
        return {
            ...event,
            id: hash,
            sig: bytesToHex(sig),
        };
    }
    catch (error) {
        logger.debug({ error }, 'Failed to sign event');
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
        if (!event || typeof event !== 'object')
            return false;
        if (!isHex32(event.id) || !isHex32(event.pubkey) || !isHex64(event.sig))
            return false;
        // Verify event ID
        const expectedId = calculateEventId(event);
        if (event.id !== expectedId) {
            return false;
        }
        // Verify signature
        return schnorr.verify(hexToBytes(event.sig), hexToBytes(event.id), hexToBytes(event.pubkey));
    }
    catch (error) {
        logger.debug({ error }, 'Failed to verify signature');
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
 * STRUCTURE-ONLY check of a Nostr event (NIP-01): field types and tag shape.
 * Does NOT check the id, hex format or signature — use the root
 * `validateEvent` or `verifySignature` to decide whether an event is authentic.
 * @param event - Event to check
 * @returns True if the event structure is well-formed
 */
export function validateEventStructure(event) {
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
        logger.debug({ error }, 'Failed to validate event');
        return false;
    }
}
/**
 * @deprecated Structure-only, despite the name — it does NOT verify the id or
 * signature (unlike the root `validateEvent`). Use {@link validateEventStructure}
 * for the same check, or the root `validateEvent` / `verifySignature` for trust.
 */
export const validateEvent = validateEventStructure;
