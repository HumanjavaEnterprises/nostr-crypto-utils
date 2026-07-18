"use strict";
/**
 * @module event/signing
 * @description Event signing and verification utilities for Nostr
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.signEvent = signEvent;
exports.verifySignature = verifySignature;
exports.validateEvent = validateEvent;
exports.calculateEventId = calculateEventId;
const secp256k1_js_1 = require("@noble/curves/secp256k1.js");
const sha2_js_1 = require("@noble/hashes/sha2.js");
const utils_js_1 = require("@noble/hashes/utils.js");
const logger_js_1 = require("../utils/logger.js");
const creation_js_1 = require("./creation.js");
/**
 * Signs a Nostr event with a private key (NIP-01)
 * @param event - Event to sign
 * @param privateKey - Private key in hex format
 * @returns Signed event
 */
async function signEvent(event, privateKey) {
    try {
        const hash = await (0, creation_js_1.getEventHash)(event);
        const sig = secp256k1_js_1.schnorr.sign((0, utils_js_1.hexToBytes)(hash), (0, utils_js_1.hexToBytes)(privateKey));
        return {
            ...event,
            id: hash,
            sig: (0, utils_js_1.bytesToHex)(sig),
        };
    }
    catch (error) {
        logger_js_1.logger.error({ error }, 'Failed to sign event');
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
        // Recompute the id from the serialized event and require it to match the
        // claimed id BEFORE verifying the signature. Without this, an event whose
        // content/tags were swapped but whose (id, sig) remain a valid pair would
        // pass verification, letting forged content read as authentic.
        const computedId = (0, utils_js_1.bytesToHex)((0, sha2_js_1.sha256)(new TextEncoder().encode((0, creation_js_1.serializeEvent)(event))));
        if (computedId !== event.id) {
            logger_js_1.logger.error('Event id does not match hash of content');
            return false;
        }
        return secp256k1_js_1.schnorr.verify((0, utils_js_1.hexToBytes)(event.sig), (0, utils_js_1.hexToBytes)(event.id), (0, utils_js_1.hexToBytes)(event.pubkey));
    }
    catch (error) {
        logger_js_1.logger.error({ error }, 'Failed to verify signature');
        return false;
    }
}
/**
 * Validates a Nostr event
 * @param event - Event to validate
 * @returns True if event is valid
 */
function validateEvent(event) {
    try {
        // Check required fields
        if (!event.id || !event.pubkey || !event.sig) {
            return false;
        }
        // Verify signature
        return verifySignature(event);
    }
    catch (error) {
        logger_js_1.logger.error({ error }, 'Error validating event');
        return false;
    }
}
/**
 * Calculates the event ID for a Nostr event
 * @param event - Event to calculate ID for
 * @returns Event ID
 */
function calculateEventId(event) {
    return (0, creation_js_1.getEventHash)(event);
}
//# sourceMappingURL=signing.js.map