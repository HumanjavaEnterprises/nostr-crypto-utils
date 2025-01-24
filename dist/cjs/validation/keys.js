"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidPublicKey = isValidPublicKey;
const validation_1 = require("../utils/validation");
const logger_1 = require("../utils/logger");
/**
 * Validates a Nostr public key
 * @param pubkey - Public key in hex format
 * @returns True if public key is valid
 */
function isValidPublicKey(pubkey) {
    try {
        if (typeof pubkey !== 'string')
            return false;
        const result = (0, validation_1.validatePublicKey)(pubkey);
        return result.isValid;
    }
    catch (error) {
        logger_1.logger.error({ error }, 'Failed to validate public key');
        return false;
    }
}
//# sourceMappingURL=keys.js.map