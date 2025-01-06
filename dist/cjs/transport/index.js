"use strict";
/**
 * @module transport
 * @description Functions for handling Nostr protocol messages and transport layer operations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseNostrMessage = parseNostrMessage;
exports.formatEventForRelay = formatEventForRelay;
exports.formatSubscriptionForRelay = formatSubscriptionForRelay;
exports.formatCloseForRelay = formatCloseForRelay;
const base_1 = require("../types/base");
/**
 * Parses a Nostr message from a relay
 */
function parseNostrMessage(message) {
    // Validate message format
    if (!Array.isArray(message)) {
        throw new Error('Invalid relay message: not an array');
    }
    if (message.length === 0) {
        throw new Error('Invalid relay message: empty array');
    }
    if (typeof message[0] !== 'string') {
        throw new Error('Invalid relay message: first element not a string');
    }
    const messageType = message[0];
    switch (messageType) {
        case base_1.NostrMessageType.EVENT:
            return { type: base_1.NostrMessageType.EVENT, payload: message[1] };
        case base_1.NostrMessageType.REQ:
            return { type: base_1.NostrMessageType.REQ, payload: { id: message[1], filter: message[2] } };
        case base_1.NostrMessageType.CLOSE:
            return { type: base_1.NostrMessageType.CLOSE, payload: message[1] };
        case base_1.NostrMessageType.EOSE:
            return { type: base_1.NostrMessageType.EOSE, payload: message[1] };
        case base_1.NostrMessageType.OK:
            return { type: base_1.NostrMessageType.OK, payload: { id: message[1], success: message[2], message: message[3] } };
        default:
            throw new Error(`Unknown message type: ${messageType}`);
    }
}
/**
 * Formats an event for relay transmission
 */
function formatEventForRelay(event) {
    return ['EVENT', event];
}
/**
 * Formats a subscription request for relay transmission
 */
function formatSubscriptionForRelay(id, filters) {
    if (!Array.isArray(filters)) {
        throw new Error('filters must be an array');
    }
    return ['REQ', id, ...filters];
}
/**
 * Formats a close message for relay transmission
 */
function formatCloseForRelay(id) {
    return ['CLOSE', id];
}
//# sourceMappingURL=index.js.map