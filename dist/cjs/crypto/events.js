"use strict";
/**
 * @module crypto/events
 * @description Event signing and verification for Nostr
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEvent = createEvent;
exports.signEvent = signEvent;
exports.verifySignature = verifySignature;
const logger_1 = require("../utils/logger");
const secp256k1_1 = require("@noble/curves/secp256k1");
const utils_1 = require("@noble/hashes/utils");
const sha256_1 = require("@noble/hashes/sha256");
const base_1 = require("../types/base");
const keys_1 = require("./keys");
/**
 * Creates an unsigned Nostr event
 */
function createEvent(params) {
    // Set default created_at if not provided
    if (!params.created_at) {
        params.created_at = Math.floor(Date.now() / 1000);
    }
    // Validate required fields
    if (!params.pubkey) {
        throw new Error('pubkey is required');
    }
    // Validate pubkey format
    if (!/^[0-9a-f]{64}$/i.test(params.pubkey)) {
        throw new Error('Invalid public key format');
    }
    return {
        kind: params.kind || base_1.NostrEventKind.TEXT_NOTE,
        created_at: params.created_at,
        content: params.content || '',
        pubkey: params.pubkey,
        tags: params.tags || []
    };
}
/**
 * Signs a Nostr event
 */
async function signEvent(event, privateKey) {
    // Validate required fields
    if (!event) {
        throw new Error('Event is required');
    }
    if (!privateKey) {
        throw new Error('Private key is required');
    }
    try {
        // Convert private key to bytes
        const privateKeyBytes = (0, utils_1.hexToBytes)(privateKey);
        // Create canonical event representation as per NIP-01
        const serialized = JSON.stringify([
            0,
            event.pubkey,
            event.created_at,
            event.kind,
            event.tags || [],
            event.content || ''
        ]);
        // Calculate event hash as per NIP-01
        const eventHash = (0, sha256_1.sha256)(new TextEncoder().encode(serialized));
        // Sign the event hash using schnorr (privateKey, message)
        const sig = secp256k1_1.schnorr.sign(eventHash, privateKeyBytes);
        // Return signed event
        return {
            ...event,
            id: (0, utils_1.bytesToHex)(eventHash),
            sig: (0, utils_1.bytesToHex)(sig)
        };
    }
    catch (error) {
        logger_1.logger.error({ error }, 'Failed to sign event');
        throw error;
    }
}
/**
 * Verifies a signed Nostr event
 */
async function verifySignature(event) {
    try {
        // Create canonical event representation as per NIP-01
        const serialized = JSON.stringify([
            0,
            event.pubkey,
            event.created_at,
            event.kind,
            event.tags || [],
            event.content || ''
        ]);
        // Calculate event hash as per NIP-01
        const eventHash = (0, sha256_1.sha256)(new TextEncoder().encode(serialized));
        // Verify event ID matches hash
        const calculatedId = (0, utils_1.bytesToHex)(eventHash);
        if (calculatedId !== event.id) {
            logger_1.logger.error({ calculated: calculatedId, actual: event.id }, 'Event ID mismatch');
            return false;
        }
        // Convert signature and pubkey
        const sigBytes = (0, utils_1.hexToBytes)(event.sig);
        const pubkeyObj = (0, keys_1.createPublicKey)(event.pubkey);
        const pubkeyBytes = pubkeyObj.schnorrBytes;
        // Verify signature using schnorr (sig, message, pubKey)
        try {
            return secp256k1_1.schnorr.verify(sigBytes, eventHash, pubkeyBytes);
        }
        catch (error) {
            logger_1.logger.error({ error }, 'Schnorr verification error');
            return false;
        }
    }
    catch (error) {
        logger_1.logger.error({ error }, 'Failed to verify signature');
        return false;
    }
}
//# sourceMappingURL=events.js.map