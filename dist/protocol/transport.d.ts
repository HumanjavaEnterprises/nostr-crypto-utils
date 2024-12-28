import { NostrMessageType, SignedNostrEvent } from '../types/base';
/**
 * Creates a properly formatted Nostr EVENT message
 * @param event The signed event to create a message from
 * @returns A properly formatted Nostr EVENT message array
 */
export declare function createEventMessage(event: SignedNostrEvent): [NostrMessageType, SignedNostrEvent];
/**
 * Parses a raw Nostr message
 * @param message The raw message to parse
 * @returns The parsed message components
 */
export declare function parseNostrMessage(message: string): [NostrMessageType, ...unknown[]];
