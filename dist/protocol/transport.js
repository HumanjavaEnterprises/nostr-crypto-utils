import { NostrMessageType } from '../types/base';
import { hexToBytes } from '../utils/encoding';
/**
 * Creates a properly formatted Nostr EVENT message
 * @param event The signed event to create a message from
 * @returns A properly formatted Nostr EVENT message array
 */
export function createEventMessage(event) {
    return [NostrMessageType.EVENT, event];
}
/**
 * Parses a raw Nostr message
 * @param message The raw message to parse
 * @returns The parsed message components
 */
export function parseNostrMessage(message) {
    const parsed = JSON.parse(message);
    if (!Array.isArray(parsed) || parsed.length < 2) {
        throw new Error('Invalid Nostr message format');
    }
    const [messageType, ...rest] = parsed;
    if (typeof messageType !== 'string') {
        throw new Error('Invalid message type');
    }
    // Handle Uint8Array reconstruction for events
    if (messageType === NostrMessageType.EVENT && rest[0]?.pubkey?.hex) {
        rest[0].pubkey.bytes = hexToBytes(rest[0].pubkey.hex);
    }
    return [messageType, ...rest];
}
