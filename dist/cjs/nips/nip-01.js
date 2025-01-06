"use strict";
/**
 * @module nips/nip-01
 * @description Implementation of NIP-01: Basic Protocol Flow Description
 * @see https://github.com/nostr-protocol/nips/blob/master/01.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEvent = createEvent;
exports.serializeEvent = serializeEvent;
exports.getEventHash = getEventHash;
exports.signEvent = signEvent;
exports.verifySignature = verifySignature;
exports.calculateEventId = calculateEventId;
exports.validateEvent = validateEvent;
const secp256k1_1 = require("@noble/curves/secp256k1");
const sha256_1 = require("@noble/hashes/sha256");
const utils_1 = require("@noble/curves/abstract/utils");
const logger_1 = require("../utils/logger");
/**
 * Creates a new Nostr event with the specified parameters (NIP-01)
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
        const hash = (0, sha256_1.sha256)(new TextEncoder().encode(serialized));
        return (0, utils_1.bytesToHex)(hash);
    }
    catch (error) {
        logger_1.logger.error({ error }, 'Failed to get event hash');
        throw error;
    }
}
/**
 * Signs a Nostr event with a private key (NIP-01)
 * @param event - Event to sign
 * @param privateKey - Private key in hex format
 * @returns Signed event
 */
async function signEvent(event, privateKey) {
    try {
        const hash = await getEventHash(event);
        const sig = secp256k1_1.schnorr.sign((0, utils_1.hexToBytes)(hash), privateKey);
        return {
            ...event,
            id: hash,
            sig: (0, utils_1.bytesToHex)(sig),
        };
    }
    catch (error) {
        logger_1.logger.error({ error }, 'Failed to sign event');
        throw error;
    }
}
/**
 * Verifies the signature of a signed Nostr event (NIP-01)
 * @param event - Event to verify
 * @returns True if signature is valid
 */
function verifySignature(event) {
    try {
        // Verify event ID
        const expectedId = calculateEventId(event);
        if (event.id !== expectedId) {
            return false;
        }
        // Verify signature
        return secp256k1_1.schnorr.verify((0, utils_1.hexToBytes)(event.sig), (0, utils_1.hexToBytes)(event.id), (0, utils_1.hexToBytes)(event.pubkey));
    }
    catch (error) {
        logger_1.logger.error({ error }, 'Failed to verify signature');
        return false;
    }
}
/**
 * Calculates the event ID according to NIP-01
 * @param event - Event to calculate ID for
 * @returns Event ID in hex format
 */
function calculateEventId(event) {
    const serialized = serializeEvent(event);
    const hash = (0, sha256_1.sha256)(new TextEncoder().encode(serialized));
    return (0, utils_1.bytesToHex)(hash);
}
/**
 * Validates a Nostr event structure (NIP-01)
 * @param event - Event to validate
 * @returns True if event structure is valid
 */
function validateEvent(event) {
    try {
        if (typeof event.content !== 'string')
            return false;
        if (typeof event.created_at !== 'number')
            return false;
        if (typeof event.kind !== 'number')
            return false;
        if (!Array.isArray(event.tags))
            return false;
        if (typeof event.pubkey !== 'string')
            return false;
        // Validate tags structure
        for (const tag of event.tags) {
            if (!Array.isArray(tag))
                return false;
            if (tag.length === 0)
                return false;
            if (typeof tag[0] !== 'string')
                return false;
        }
        return true;
    }
    catch (error) {
        logger_1.logger.error({ error }, 'Failed to validate event');
        return false;
    }
}
//# sourceMappingURL=nip-01.js.map