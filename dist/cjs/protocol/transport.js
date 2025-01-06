"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEventMessage = createEventMessage;
exports.parseNostrMessage = parseNostrMessage;
const base_1 = require("../types/base");
const encoding_1 = require("../utils/encoding");
/**
 * Creates a properly formatted Nostr EVENT message
 * @param event The signed event to create a message from
 * @returns A properly formatted Nostr EVENT message array
 */
function createEventMessage(event) {
    return [base_1.NostrMessageType.EVENT, event];
}
/**
 * Parses a raw Nostr message
 * @param message The raw message to parse
 * @returns The parsed message components
 */
function parseNostrMessage(message) {
    const parsed = JSON.parse(message);
    if (!Array.isArray(parsed) || parsed.length < 2) {
        throw new Error('Invalid Nostr message format');
    }
    const [messageType, ...rest] = parsed;
    if (typeof messageType !== 'string') {
        throw new Error('Invalid message type');
    }
    // Handle Uint8Array reconstruction for events
    if (messageType === base_1.NostrMessageType.EVENT && rest[0]?.pubkey?.hex) {
        rest[0].pubkey.bytes = (0, encoding_1.hexToBytes)(rest[0].pubkey.hex);
    }
    return [messageType, ...rest];
}
//# sourceMappingURL=transport.js.map