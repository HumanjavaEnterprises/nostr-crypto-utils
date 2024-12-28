import { NostrMessageType, NostrEvent, SignedNostrEvent } from '../types/base';

/**
 * Creates a properly formatted Nostr EVENT message
 * @param event The signed event to create a message from
 * @returns A properly formatted Nostr EVENT message array
 */
export function createEventMessage(event: SignedNostrEvent): [NostrMessageType, SignedNostrEvent] {
    return [NostrMessageType.EVENT, event];
}

/**
 * Parses a raw Nostr message
 * @param message The raw message to parse
 * @returns The parsed message components
 */
export function parseNostrMessage(message: string): [NostrMessageType, ...unknown[]] {
    const parsed = JSON.parse(message);
    if (!Array.isArray(parsed) || parsed.length < 2) {
        throw new Error('Invalid Nostr message format');
    }
    
    const [messageType, ...rest] = parsed;
    if (typeof messageType !== 'string') {
        throw new Error('Invalid message type');
    }
    
    return [messageType as NostrMessageType, ...rest];
}
