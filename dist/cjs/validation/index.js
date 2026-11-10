"use strict";
/**
 * @module validation
 * @description Validation utilities for Nostr events, messages, and related data structures.
 * Provides functions to validate events, signatures, filters, and subscriptions according to the Nostr protocol.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEventId = validateEventId;
exports.validateEventSignature = validateEventSignature;
exports.validateEvent = validateEvent;
exports.validateSignedEvent = validateSignedEvent;
exports.validateSignedEventFormat = validateSignedEventFormat;
exports.validateEventBase = validateEventBase;
exports.validateFilter = validateFilter;
exports.validateSubscription = validateSubscription;
exports.validateResponse = validateResponse;
const index_js_1 = require("../types/index.js");
const logger_js_1 = require("../utils/logger.js");
const sha2_js_1 = require("@noble/hashes/sha2.js");
const utils_js_1 = require("@noble/hashes/utils.js");
const secp256k1_js_1 = require("@noble/curves/secp256k1.js");
const strict_hex_js_1 = require("../utils/strict-hex.js");
/**
 * Gets the hex string from a PublicKey or string
 */
function getPublicKeyHex(pubkey) {
    return typeof pubkey === 'string' ? pubkey : pubkey.hex;
}
/**
 * Validates a Nostr event ID by checking if it matches the SHA-256 hash of the canonical event serialization.
 *
 * @param {SignedNostrEvent} event - The event to validate
 * @returns {ValidationResult} Object containing validation result and any error message
 * @example
 * ```typescript
 * const result = validateEventId(event);
 * if (!result.isValid) {
 *   console.error(result.error);
 * }
 * ```
 */
function validateEventId(event) {
    try {
        if (!(0, strict_hex_js_1.isHex32)(event?.id)) {
            return { isValid: false, error: 'Invalid event ID format' };
        }
        const serialized = JSON.stringify([
            0,
            getPublicKeyHex(event.pubkey),
            event.created_at,
            event.kind,
            event.tags,
            event.content
        ]);
        const hash = (0, utils_js_1.bytesToHex)((0, sha2_js_1.sha256)(new TextEncoder().encode(serialized)));
        return {
            isValid: hash === event.id,
            error: hash === event.id ? undefined : 'Invalid event ID'
        };
    }
    catch (error) {
        logger_js_1.logger.debug({ error }, 'Failed to validate event ID');
        return {
            isValid: false,
            error: 'Failed to validate event ID'
        };
    }
}
/**
 * Validates a Nostr event signature using Schnorr signature verification.
 *
 * @param {SignedNostrEvent} event - The event to validate
 * @returns {ValidationResult} Object containing validation result and any error message
 * @example
 * ```typescript
 * const result = validateEventSignature(event);
 * if (!result.isValid) {
 *   console.error(result.error);
 * }
 * ```
 */
function validateEventSignature(event) {
    try {
        if (!(0, strict_hex_js_1.isHex64)(event?.sig)) {
            return { isValid: false, error: 'Invalid signature format' };
        }
        if (!(0, strict_hex_js_1.isHex32)(getPublicKeyHex(event.pubkey))) {
            return { isValid: false, error: 'Invalid public key format' };
        }
        // Verify the signature
        const serialized = JSON.stringify([
            0,
            getPublicKeyHex(event.pubkey),
            event.created_at,
            event.kind,
            event.tags,
            event.content
        ]);
        const hash = (0, sha2_js_1.sha256)(new TextEncoder().encode(serialized));
        const pubkeyHex = getPublicKeyHex(event.pubkey);
        const pubkeyBytes = (0, utils_js_1.hexToBytes)(pubkeyHex);
        const isValid = secp256k1_js_1.schnorr.verify((0, utils_js_1.hexToBytes)(event.sig), hash, pubkeyBytes);
        return {
            isValid,
            error: isValid ? undefined : 'Invalid signature'
        };
    }
    catch (error) {
        logger_js_1.logger.debug({ error }, 'Failed to validate event signature');
        return {
            isValid: false,
            error: 'Failed to validate event signature'
        };
    }
}
/**
 * Validates a complete Nostr event by checking its structure, timestamps, ID, and signature.
 *
 * @param {SignedNostrEvent} event - The event to validate
 * @returns {ValidationResult} Object containing validation result and any error message
 * @example
 * ```typescript
 * const result = validateEvent(event);
 * if (!result.isValid) {
 *   console.error(result.error);
 * }
 * ```
 */
function validateEvent(event) {
    // A wire event's pubkey is a lowercase hex string — nothing else.
    if (!event || typeof event !== 'object' || !(0, strict_hex_js_1.isHex32)(event.pubkey)) {
        return { isValid: false, error: 'Invalid public key format' };
    }
    // First validate the event structure
    const baseValidation = validateEventBase(event);
    if (!baseValidation.isValid) {
        return baseValidation;
    }
    // Then validate the event ID
    const idValidation = validateEventId(event);
    if (!idValidation.isValid) {
        return idValidation;
    }
    // Finally validate the signature
    return validateEventSignature(event);
}
/**
 * Validates a signed Nostr event: structure, canonical id/pubkey/sig format,
 * id = hash(event), AND the schnorr signature. Equivalent to {@link validateEvent}.
 *
 * Before 0.10.0 this only checked the format of `id`/`sig`; that check is now
 * {@link validateSignedEventFormat}.
 *
 * @param {SignedNostrEvent} event - The event to validate
 * @returns {ValidationResult} Object containing validation result and any error message
 */
function validateSignedEvent(event) {
    return validateEvent(event);
}
/**
 * FORMAT-ONLY check of a signed event: structure plus canonical lowercase hex
 * `pubkey` (64), `id` (64) and `sig` (128). Does NOT recompute the id or verify
 * the signature — use {@link validateEvent} to decide whether an event is authentic.
 *
 * @param {SignedNostrEvent} event - The event to check
 * @returns {ValidationResult} Object containing validation result and any error message
 */
function validateSignedEventFormat(event) {
    if (!event || typeof event !== 'object' || !(0, strict_hex_js_1.isHex32)(event.pubkey)) {
        return { isValid: false, error: 'Invalid public key format' };
    }
    const baseValidation = validateEventBase(event);
    if (!baseValidation.isValid) {
        return baseValidation;
    }
    if (!(0, strict_hex_js_1.isHex64)(event.sig)) {
        return { isValid: false, error: 'Invalid signature format' };
    }
    if (!(0, strict_hex_js_1.isHex32)(event.id)) {
        return { isValid: false, error: 'Invalid event ID format' };
    }
    return { isValid: true };
}
/**
 * Validates a Nostr event by checking its structure and fields.
 * @param event - The event to validate
 * @returns Validation result and any error message
 */
function validateEventBase(event) {
    // Check required fields
    if (!event || typeof event !== 'object') {
        return { isValid: false, error: 'Invalid event structure' };
    }
    // Validate kind — kind 0 (metadata) is legal; reject only non-integers / negatives.
    if (!(typeof event.kind === 'number' && Number.isInteger(event.kind) && event.kind >= 0)) {
        return { isValid: false, error: 'Event kind must be a non-negative integer' };
    }
    // Validate timestamp
    const now = Math.floor(Date.now() / 1000);
    if (typeof event.created_at !== 'number' || event.created_at > now + 60) {
        return { isValid: false, error: 'Event timestamp cannot be in the future' };
    }
    // Validate content
    if (typeof event.content !== 'string') {
        return { isValid: false, error: 'Event content must be a string' };
    }
    // Validate pubkey format
    if (!event.pubkey) {
        return { isValid: false, error: 'Missing public key' };
    }
    // Get pubkey hex
    const pubkeyHex = getPublicKeyHex(event.pubkey);
    if (typeof pubkeyHex !== 'string' || !/^[0-9a-f]{64}$/.test(pubkeyHex)) {
        return { isValid: false, error: 'Invalid public key format' };
    }
    // id / sig are optional here (unsigned events), but when present they must be
    // canonical lowercase hex of the right length.
    const maybeSigned = event;
    if (maybeSigned.id !== undefined && !(0, strict_hex_js_1.isHex32)(maybeSigned.id)) {
        return { isValid: false, error: 'Invalid event ID format' };
    }
    if (maybeSigned.sig !== undefined && !(0, strict_hex_js_1.isHex64)(maybeSigned.sig)) {
        return { isValid: false, error: 'Invalid signature format' };
    }
    // Validate tags
    if (!Array.isArray(event.tags)) {
        return { isValid: false, error: 'Event tags must be an array' };
    }
    for (const tag of event.tags) {
        if (!Array.isArray(tag)) {
            return { isValid: false, error: 'Each tag must be an array' };
        }
        if (tag.length === 0) {
            return { isValid: false, error: 'Empty tags are not allowed' };
        }
        if (typeof tag[0] !== 'string') {
            return { isValid: false, error: 'Tag identifier must be a string' };
        }
    }
    return { isValid: true };
}
/**
 * Validates a Nostr filter by checking its structure and fields.
 *
 * @param {NostrFilter} filter - The filter to validate
 * @returns {ValidationResult} Object containing validation result and any error message
 * @example
 * ```typescript
 * const result = validateFilter(filter);
 * if (!result.isValid) {
 *   console.error(result.error);
 * }
 * ```
 */
function validateFilter(filter) {
    try {
        // Validate filter structure
        if (!filter || typeof filter !== 'object') {
            return { isValid: false, error: 'Invalid filter structure' };
        }
        // Validate ids array if present
        if (filter.ids && (!Array.isArray(filter.ids) || !filter.ids.every(id => typeof id === 'string'))) {
            return { isValid: false, error: 'Filter ids must be an array of strings' };
        }
        // Validate authors array if present
        if (filter.authors && (!Array.isArray(filter.authors) || !filter.authors.every(author => typeof author === 'string'))) {
            return { isValid: false, error: 'Filter authors must be an array of strings' };
        }
        // Validate kinds array if present
        if (filter.kinds) {
            if (!Array.isArray(filter.kinds)) {
                return { isValid: false, error: 'Filter kinds must be an array of numbers' };
            }
            if (!filter.kinds.every(kind => typeof kind === 'number' && Number.isInteger(kind) && kind >= 0)) {
                return { isValid: false, error: 'Filter kinds must be non-negative integers' };
            }
        }
        // Validate timestamps
        if (filter.since && typeof filter.since !== 'number') {
            return { isValid: false, error: 'Filter since must be a number' };
        }
        if (filter.until && typeof filter.until !== 'number') {
            return { isValid: false, error: 'Filter until must be a number' };
        }
        // Validate limit
        if (filter.limit && typeof filter.limit !== 'number') {
            return { isValid: false, error: 'Filter limit must be a number' };
        }
        // Validate search
        if (filter.search && typeof filter.search !== 'string') {
            return { isValid: false, error: 'Filter search must be a string' };
        }
        return { isValid: true };
    }
    catch (error) {
        logger_js_1.logger.debug({ error }, 'Failed to validate filter');
        return { isValid: false, error: 'Failed to validate filter' };
    }
}
/**
 * Validates a Nostr subscription by checking its structure and filters.
 *
 * @param {NostrSubscription} subscription - The subscription to validate
 * @returns {ValidationResult} Object containing validation result and any error message
 * @example
 * ```typescript
 * const result = validateSubscription(subscription);
 * if (!result.isValid) {
 *   console.error(result.error);
 * }
 * ```
 */
function validateSubscription(subscription) {
    try {
        // Validate subscription structure
        if (!subscription || typeof subscription !== 'object') {
            return { isValid: false, error: 'Invalid subscription structure' };
        }
        // Validate subscription ID
        if (!subscription.id || typeof subscription.id !== 'string') {
            return { isValid: false, error: 'Subscription must have a string ID' };
        }
        // Validate filters array
        if (!Array.isArray(subscription.filters)) {
            return { isValid: false, error: 'Subscription filters must be an array' };
        }
        // Validate each filter
        for (const filter of subscription.filters) {
            const filterValidation = validateFilter(filter);
            if (!filterValidation.isValid) {
                return filterValidation;
            }
        }
        return { isValid: true };
    }
    catch (error) {
        logger_js_1.logger.debug({ error }, 'Failed to validate subscription');
        return { isValid: false, error: 'Failed to validate subscription' };
    }
}
/**
 * Validates a Nostr relay response message.
 *
 * @param {unknown} message - The message to validate
 * @returns {ValidationResult} Object containing validation result and any error message
 * @example
 * ```typescript
 * const result = validateResponse(['EVENT', eventObj]);
 * if (!result.isValid) {
 *   console.error(result.error);
 * }
 * ```
 */
function validateResponse(message) {
    // Check if message is an array
    if (!Array.isArray(message)) {
        return {
            isValid: false,
            error: 'Invalid message format: must be an array'
        };
    }
    // Check if message has at least one element
    if (message.length === 0) {
        return {
            isValid: false,
            error: 'Invalid message format: array is empty'
        };
    }
    // Check if first element is a valid message type
    const type = message[0];
    if (!Object.values(index_js_1.NostrMessageType).includes(type)) {
        return {
            isValid: false,
            error: `Invalid message type: ${type}`
        };
    }
    // Type-specific validation
    switch (type) {
        case index_js_1.NostrMessageType.EVENT:
            if (message.length !== 2) {
                return {
                    isValid: false,
                    error: 'EVENT message must have exactly 2 elements'
                };
            }
            // Full verification: recompute the id and verify the schnorr signature,
            // so a relay cannot smuggle a well-formed-but-forged event through.
            return validateEvent(message[1]);
        case index_js_1.NostrMessageType.NOTICE:
            if (message.length !== 2 || typeof message[1] !== 'string') {
                return {
                    isValid: false,
                    error: 'NOTICE message must have exactly 2 elements with a string message'
                };
            }
            return { isValid: true };
        case index_js_1.NostrMessageType.OK:
            if (message.length !== 4 ||
                typeof message[1] !== 'string' ||
                typeof message[2] !== 'boolean' ||
                typeof message[3] !== 'string') {
                return {
                    isValid: false,
                    error: 'OK message must have exactly 4 elements: [type, eventId, success, message]'
                };
            }
            return { isValid: true };
        case index_js_1.NostrMessageType.EOSE:
            if (message.length !== 2 || typeof message[1] !== 'string') {
                return {
                    isValid: false,
                    error: 'EOSE message must have exactly 2 elements with a subscription ID'
                };
            }
            return { isValid: true };
        case index_js_1.NostrMessageType.REQ:
            if (message.length < 2) {
                return {
                    isValid: false,
                    error: 'REQ message must have at least 2 elements'
                };
            }
            if (typeof message[1] !== 'string') {
                return {
                    isValid: false,
                    error: 'REQ message must have a string subscription ID'
                };
            }
            // Validate each filter if present
            for (let i = 2; i < message.length; i++) {
                const filterResult = validateFilter(message[i]);
                if (!filterResult.isValid) {
                    return filterResult;
                }
            }
            return { isValid: true };
        case index_js_1.NostrMessageType.CLOSE:
            if (message.length !== 2 || typeof message[1] !== 'string') {
                return {
                    isValid: false,
                    error: 'CLOSE message must have exactly 2 elements with a subscription ID'
                };
            }
            return { isValid: true };
        case index_js_1.NostrMessageType.AUTH:
            if (message.length !== 2) {
                return {
                    isValid: false,
                    error: 'AUTH message must have exactly 2 elements'
                };
            }
            // Full verification (recompute id + verify signature), same as EVENT.
            return validateEvent(message[1]);
        default:
            return {
                isValid: false,
                error: `Unsupported message type: ${type}`
            };
    }
}
