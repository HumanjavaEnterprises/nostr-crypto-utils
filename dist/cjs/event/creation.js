"use strict";
/**
 * @module event/creation
 * @description Event creation and serialization utilities for Nostr
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEvent = createEvent;
exports.serializeEvent = serializeEvent;
exports.getEventHash = getEventHash;
const sha256_js_1 = require("@noble/hashes/sha256.js");
const utils_js_1 = require("@noble/hashes/utils.js");
const logger_js_1 = require("../utils/logger.js");
/**
 * Creates a new Nostr event with the specified parameters
 * @param params - Event parameters
 * @returns Created event
 */
function createEvent(params) {
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
function serializeEvent(event) {
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
async function getEventHash(event) {
    try {
        const serialized = serializeEvent(event);
        const hash = await (0, sha256_js_1.sha256)(new TextEncoder().encode(serialized));
        return (0, utils_js_1.bytesToHex)(hash);
    }
    catch (error) {
        logger_js_1.logger.error({ error }, 'Failed to get event hash');
        throw error;
    }
}
//# sourceMappingURL=creation.js.map