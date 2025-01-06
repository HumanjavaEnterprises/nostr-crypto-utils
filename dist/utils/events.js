/**
 * @module utils/events
 * @description Event creation utility functions
 */
import { NostrEventKind } from '../types';
import { createEvent } from '../crypto';
/**
 * Creates a text note event
 * @param content - Text content
 * @param pubkey - Public key
 * @returns Created event
 */
export function createTextNoteEvent(content, pubkey) {
    return createEvent({
        kind: NostrEventKind.TEXT_NOTE,
        content,
        pubkey
    });
}
/**
 * Creates a metadata event
 * @param metadata - User metadata
 * @param pubkey - Public key
 * @returns Created event
 */
export function createMetadataEvent(metadata, pubkey) {
    return createEvent({
        kind: NostrEventKind.SET_METADATA,
        content: JSON.stringify(metadata),
        pubkey
    });
}
/**
 * Creates a channel message event
 * @param content - Message content
 * @param channelId - Channel ID
 * @param pubkey - Public key
 * @returns Created event
 */
export function createChannelMessageEvent(content, channelId, pubkey) {
    return createEvent({
        kind: NostrEventKind.CHANNEL_MESSAGE,
        content,
        pubkey,
        tags: [['e', channelId]]
    });
}
/**
 * Creates a direct message event
 * @param content - Message content
 * @param recipientPubKey - Recipient's public key
 * @param pubkey - Sender's public key
 * @returns Created event
 */
export function createDirectMessageEvent(content, recipientPubKey, pubkey) {
    return createEvent({
        kind: NostrEventKind.ENCRYPTED_DIRECT_MESSAGE,
        content,
        pubkey,
        tags: [['p', recipientPubKey]]
    });
}
//# sourceMappingURL=events.js.map