import { NostrEvent, SignedNostrEvent } from './types/base';
import { NostrFilter, NostrSubscription } from './types/protocol';
/**
 * Result of a validation operation
 * @category Validation
 * @interface ValidationResult
 */
export interface ValidationResult {
    /** Whether the validation passed */
    isValid: boolean;
    /** List of validation errors if any */
    errors: string[];
}
/**
 * Validates a Nostr event against the protocol specification (NIP-01)
 * @category Validation
 * @param {NostrEvent} event - Event to validate
 * @returns {ValidationResult} Validation result containing any errors found
 * @example
 * ```typescript
 * const event = createEvent({
 *   kind: NostrEventKind.TEXT_NOTE,
 *   content: 'Hello Nostr!'
 * });
 * const validation = validateEvent(event);
 * if (!validation.isValid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
export declare function validateEvent(event: NostrEvent): ValidationResult;
/**
 * Validates a signed Nostr event (NIP-01)
 * @category Validation
 * @param {SignedNostrEvent} event - Signed event to validate
 * @returns {ValidationResult} Validation result containing any errors found
 * @example
 * ```typescript
 * const validation = validateSignedEvent(signedEvent);
 * if (!validation.isValid) {
 *   console.error('Invalid signature or event structure:', validation.errors);
 * }
 * ```
 */
export declare function validateSignedEvent(event: SignedNostrEvent): ValidationResult;
/**
 * Validates a Nostr filter against the protocol specification (NIP-01)
 * @category Validation
 * @param {NostrFilter} filter - Filter to validate
 * @returns {ValidationResult} Validation result containing any errors found
 * @example
 * ```typescript
 * const filter = {
 *   kinds: [1],
 *   authors: ['pubkey1', 'pubkey2'],
 *   limit: 10
 * };
 * const validation = validateFilter(filter);
 * if (!validation.isValid) {
 *   console.error('Invalid filter:', validation.errors);
 * }
 * ```
 */
export declare function validateFilter(filter: NostrFilter): ValidationResult;
/**
 * Validates a Nostr subscription request (NIP-01)
 * @category Validation
 * @param {NostrSubscription} subscription - Subscription to validate
 * @returns {ValidationResult} Validation result containing any errors found
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
export declare function validateSubscription(subscription: NostrSubscription): ValidationResult;
