import { isNostrEvent, isNostrFilter, isNostrSubscription, isSignedNostrEvent } from '../types/guards';
import { schnorr } from '@noble/curves/secp256k1';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { sha256 } from '@noble/hashes/sha256';
/**
 * Validates a Nostr event against the protocol specification (NIP-01)
 * @category Validation
 * @param {NostrEvent} event - Event to validate
 * @returns {ValidationResult} Validation result containing any errors found or true if valid
 * @example
 * ```typescript
 * const event = createEvent({
 *   kind: NostrEventKind.TEXT_NOTE,
 *   content: 'Hello Nostr!'
 * });
 * const validation = validateEvent(event);
 * if (!validation.isValid) {
 *   console.error('Validation error:', validation.errors);
 * }
 * ```
 */
export function validateEvent(event) {
    const errors = [];
    // Check if the event matches the NostrEvent type structure
    if (!isNostrEvent(event)) {
        errors.push('Invalid event structure');
    }
    // Check kind
    if (typeof event.kind !== 'number' || event.kind < 0) {
        errors.push('Event kind must be a non-negative integer');
    }
    // Check content
    if (!event.content || typeof event.content !== 'string') {
        errors.push('Event content must be a non-empty string');
    }
    // Check timestamp
    if (event.created_at !== undefined) {
        const now = Math.floor(Date.now() / 1000);
        if (event.created_at > now + 60) {
            errors.push('Event timestamp is too far in the future');
        }
        if (event.created_at < 0) {
            errors.push('Invalid timestamp: must be non-negative');
        }
    }
    // Validate tags structure
    if (!Array.isArray(event.tags)) {
        errors.push('Event tags must be an array');
    }
    else if (!event.tags.every(tag => Array.isArray(tag) && tag.every(item => typeof item === 'string'))) {
        errors.push('Each tag must be an array of strings');
    }
    return {
        isValid: errors.length === 0,
        errors
    };
}
/**
 * Validates a signed Nostr event (NIP-01)
 * @category Validation
 * @param {SignedNostrEvent} event - Signed event to validate
 * @returns {ValidationResult} Validation result containing any errors found or true if valid
 * @example
 * ```typescript
 * const validation = validateSignedEvent(signedEvent);
 * if (!validation.isValid) {
 *   console.error('Invalid signature or event structure:', validation.errors);
 * }
 * ```
 */
export function validateSignedEvent(event) {
    const errors = [];
    // Check if the event matches the SignedNostrEvent type structure
    if (!isSignedNostrEvent(event)) {
        errors.push('Invalid signed event structure');
    }
    const baseValidation = validateEvent(event);
    if (!baseValidation.isValid) {
        errors.push(...baseValidation.errors);
    }
    // Check pubkey format
    if (!/^[0-9a-f]{64}$/i.test(event.pubkey)) {
        errors.push('Invalid public key format');
    }
    // Check event ID format
    if (!/^[0-9a-f]{64}$/i.test(event.id)) {
        errors.push('Invalid event ID format');
    }
    // Check signature format
    if (!/^[0-9a-f]{128,130}$/i.test(event.sig)) {
        errors.push('Invalid signature format');
    }
    if (errors.length === 0) {
        // Verify event ID
        const serializedEvent = JSON.stringify([
            0,
            event.pubkey,
            event.created_at,
            event.kind,
            event.tags,
            event.content,
        ]);
        const expectedId = bytesToHex(sha256(new TextEncoder().encode(serializedEvent)));
        if (event.id !== expectedId) {
            errors.push('Invalid event ID');
        }
        // Verify signature
        try {
            const isValid = schnorr.verify(hexToBytes(event.sig), hexToBytes(event.id), hexToBytes(event.pubkey));
            if (!isValid) {
                errors.push('Invalid signature');
            }
        }
        catch (error) {
            errors.push(`Signature verification failed: ${error instanceof Error ? error.message : 'unknown error'}`);
        }
    }
    return {
        isValid: errors.length === 0,
        errors
    };
}
/**
 * Validates a Nostr filter
 * @category Validation
 * @param {NostrFilter} filter - Filter to validate
 * @returns {ValidationResult} Validation result containing any errors found or true if valid
 */
export function validateFilter(filter) {
    const errors = [];
    if (!isNostrFilter(filter)) {
        errors.push('Invalid filter structure');
    }
    // Check numeric fields are non-negative
    if (filter.since !== undefined && filter.since < 0) {
        errors.push('Since timestamp must be non-negative');
    }
    if (filter.until !== undefined && filter.until < 0) {
        errors.push('Until timestamp must be non-negative');
    }
    if (filter.limit !== undefined && filter.limit < 0) {
        errors.push('Limit must be non-negative');
    }
    // Validate timestamp order
    if (filter.since !== undefined && filter.until !== undefined && filter.since > filter.until) {
        errors.push('since timestamp cannot be greater than until timestamp');
    }
    // Validate arrays contain correct types
    if (filter.ids && !filter.ids.every(id => /^[0-9a-f]{64}$/i.test(id))) {
        errors.push('Invalid event id format in ids filter');
    }
    if (filter.authors && !filter.authors.every(author => /^[0-9a-f]{64}$/i.test(author))) {
        errors.push('Invalid public key format in authors filter');
    }
    if (filter.kinds && !filter.kinds.every(kind => Number.isInteger(kind) && kind >= 0)) {
        errors.push('Invalid event kind in kinds filter');
    }
    return {
        isValid: errors.length === 0,
        errors
    };
}
/**
 * Validates a Nostr subscription request (NIP-01)
 * @category Validation
 * @param {NostrSubscription} subscription - Subscription to validate
 * @returns {ValidationResult} Validation result containing any errors found or true if valid
 * @example
 * ```typescript
 * const subscription = {
 *   id: 'sub1',
 *   filters: [{
 *     kinds: [1],
 *     limit: 10
 *   }]
 * };
 * const validation = validateSubscription(subscription);
 * if (!validation.isValid) {
 *   console.error('Invalid subscription:', validation.errors);
 * }
 * ```
 */
export function validateSubscription(subscription) {
    const errors = [];
    // Check if the subscription matches the NostrSubscription type structure
    if (!isNostrSubscription(subscription)) {
        errors.push('Invalid subscription structure');
    }
    // Check subscription ID
    if (!subscription.id || typeof subscription.id !== 'string') {
        errors.push('Subscription must have a valid ID string');
    }
    // Check filters array
    if (!Array.isArray(subscription.filters) || subscription.filters.length === 0) {
        errors.push('Subscription must contain at least one filter');
    }
    else {
        // Validate each filter
        subscription.filters.forEach((filter, index) => {
            const filterValidation = validateFilter(filter);
            if (!filterValidation.isValid) {
                errors.push(`Filter ${index + 1} is invalid: ${filterValidation.errors.join(', ')}`);
            }
        });
    }
    return {
        isValid: errors.length === 0,
        errors
    };
}
