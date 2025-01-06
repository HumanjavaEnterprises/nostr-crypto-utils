"use strict";
/**
 * @module utils/events
 * @description Event creation utility functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTextNoteEvent = createTextNoteEvent;
exports.createMetadataEvent = createMetadataEvent;
exports.createChannelMessageEvent = createChannelMessageEvent;
exports.createDirectMessageEvent = createDirectMessageEvent;
const types_1 = require("../types");
const crypto_1 = require("../crypto");
/**
 * Creates a text note event
 * @param content - Text content
 * @param pubkey - Public key
 * @returns Created event
 */
function createTextNoteEvent(content, pubkey) {
    return (0, crypto_1.createEvent)({
        kind: types_1.NostrEventKind.TEXT_NOTE,
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
function createMetadataEvent(metadata, pubkey) {
    return (0, crypto_1.createEvent)({
        kind: types_1.NostrEventKind.SET_METADATA,
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
function createChannelMessageEvent(content, channelId, pubkey) {
    return (0, crypto_1.createEvent)({
        kind: types_1.NostrEventKind.CHANNEL_MESSAGE,
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
function createDirectMessageEvent(content, recipientPubKey, pubkey) {
    return (0, crypto_1.createEvent)({
        kind: types_1.NostrEventKind.ENCRYPTED_DIRECT_MESSAGE,
        content,
        pubkey,
        tags: [['p', recipientPubKey]]
    });
}
//# sourceMappingURL=events.js.map