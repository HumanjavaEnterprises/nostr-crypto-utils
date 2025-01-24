import { validatePublicKey } from '../utils/validation';
import { logger } from '../utils/logger';
/**
 * Validates a Nostr public key
 * @param pubkey - Public key in hex format
 * @returns True if public key is valid
 */
export function isValidPublicKey(pubkey) {
    try {
        if (typeof pubkey !== 'string')
            return false;
        const result = validatePublicKey(pubkey);
        return result.isValid;
    }
    catch (error) {
        logger.error({ error }, 'Failed to validate public key');
        return false;
    }
}
//# sourceMappingURL=keys.js.map