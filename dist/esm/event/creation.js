/**
 * @module event/creation
 * @description Event creation and serialization utilities for Nostr
 */
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';
import { logger } from '../utils/logger';
/**
 * Creates a new Nostr event with the specified parameters
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
        const hash = await sha256(new TextEncoder().encode(serialized));
        return bytesToHex(hash);
    }
    catch (error) {
        logger.error({ error }, 'Failed to get event hash');
        throw error;
    }
}
//# sourceMappingURL=creation.js.map