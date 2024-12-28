/**
 * @module event/creation
 * @description Event creation and serialization utilities for Nostr
 */
import type { NostrEvent, NostrEventKind } from '../types';
/**
 * Creates a new Nostr event with the specified parameters
 * @param params - Event parameters
 * @returns Created event
 */
export declare function createEvent(params: {
    kind: NostrEventKind;
    content: string;
    tags?: string[][];
    created_at?: number;
    pubkey?: string;
}): NostrEvent;
/**
 * Serializes a Nostr event for signing/hashing (NIP-01)
 * @param event - Event to serialize
 * @returns Serialized event JSON string
 */
export declare function serializeEvent(event: NostrEvent): string;
/**
 * Calculates the hash of a Nostr event (NIP-01)
 * @param event - Event to hash
 * @returns Event hash in hex format
 */
export declare function getEventHash(event: NostrEvent): Promise<string>;
