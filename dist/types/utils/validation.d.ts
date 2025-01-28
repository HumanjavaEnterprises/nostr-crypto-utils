import { NostrEvent, NostrFilter, NostrSubscription, SignedNostrEvent } from '../types';
export interface ValidationResult {
    isValid: boolean;
    error: string | undefined;
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
 *   console.error('Validation error:', validation.error);
 * }
 * ```
 */
export declare function validateEvent(event: NostrEvent): ValidationResult;
/**
 * Gets the hex representation of a public key
 * @param pubkey - Public key in either hex or details format
 * @returns Hex representation of the public key
 */
export declare function getPublicKeyHex(pubkey: string): string;
/**
 * Validates a signed Nostr event (NIP-01)
 * @category Validation
 * @param {SignedNostrEvent} event - Signed event to validate
 * @returns {ValidationResult} Validation result containing any errors found or true if valid
 * @example
 * ```typescript
 * const validation = validateSignedEvent(signedEvent);
 * if (!validation.isValid) {
 *   console.error('Invalid signature or event structure:', validation.error);
 * }
 * ```
 */
export declare function validateSignedEvent(event: SignedNostrEvent): ValidationResult;
/**
 * Validates a public key hex string
 * @param {string} pubkey - Public key to validate
 * @returns {ValidationResult} Validation result
 */
export declare function validatePublicKey(pubkey: string): ValidationResult;
/**
 * Validates a filter object
 * @param filter - Filter to validate
 * @returns Validation result
 */
export declare function validateFilter(filter: NostrFilter): ValidationResult;
/**
 * Validates a subscription object
 * @param subscription - Subscription to validate
 * @returns Validation result
 */
export declare function validateSubscription(subscription: NostrSubscription): ValidationResult;
//# sourceMappingURL=validation.d.ts.map