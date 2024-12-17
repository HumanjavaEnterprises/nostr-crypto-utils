import { NostrEvent, NostrFilter, NostrSubscription, SignedNostrEvent } from './types';
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}
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
export declare function validateEvent(event: NostrEvent): ValidationResult;
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
export declare function validateSignedEvent(event: SignedNostrEvent): ValidationResult;
/**
 * Validates a Nostr filter
 * @category Validation
 * @param {NostrFilter} filter - Filter to validate
 * @returns {ValidationResult} Validation result containing any errors found or true if valid
 */
export declare function validateFilter(filter: NostrFilter): ValidationResult;
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
export declare function validateSubscription(subscription: NostrSubscription): ValidationResult;
