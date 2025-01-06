"use strict";
/**
 * @module event/signing
 * @description Event signing and verification utilities for Nostr
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.signEvent = signEvent;
exports.verifySignature = verifySignature;
const secp256k1_js_1 = require("@noble/curves/secp256k1.js");
const utils_js_1 = require("@noble/curves/abstract/utils.js");
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
        const sig = secp256k1_js_1.schnorr.sign(hash, privateKey);
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
        return secp256k1_js_1.schnorr.verify((0, utils_js_1.hexToBytes)(event.sig), (0, utils_js_1.hexToBytes)(event.id), (0, utils_js_1.hexToBytes)(event.pubkey));
    }
    catch (error) {
        logger_js_1.logger.error({ error }, 'Failed to verify signature');
        return false;
    }
}
//# sourceMappingURL=signing.js.map