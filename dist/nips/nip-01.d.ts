/**
 * @module nips/nip-01
 * @description Implementation of NIP-01: Basic Protocol Flow Description
 * @see https://github.com/nostr-protocol/nips/blob/master/01.md
 */
import type { NostrEvent, SignedNostrEvent } from '../types';
/**
 * Creates a new Nostr event with the specified parameters (NIP-01)
 * @param params - Event parameters
 * @returns Created event
 */
export declare function createEvent(params: {
    kind: number;
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
/**
 * Signs a Nostr event with a private key (NIP-01)
 * @param event - Event to sign
 * @param privateKey - Private key in hex format
 * @returns Signed event
 */
export declare function signEvent(event: NostrEvent, privateKey: string): Promise<SignedNostrEvent>;
/**
 * Verifies the signature of a signed Nostr event (NIP-01)
 * @param event - Event to verify
 * @returns True if signature is valid
 */
export declare function verifySignature(event: SignedNostrEvent): boolean;
/**
 * Validates a Nostr event structure (NIP-01)
 * @param event - Event to validate
 * @returns True if event structure is valid
 */
export declare function validateEvent(event: NostrEvent): boolean;
