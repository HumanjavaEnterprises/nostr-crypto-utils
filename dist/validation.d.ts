import { NostrEvent, SignedNostrEvent } from './types/base';
import { NostrFilter, NostrSubscription } from './types/protocol';
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}
/**
 * Validates a Nostr event against the protocol specification
 */
export declare function validateEvent(event: NostrEvent): ValidationResult;
/**
 * Validates a signed Nostr event
 */
export declare function validateSignedEvent(event: SignedNostrEvent): ValidationResult;
/**
 * Validates a Nostr filter
 */
export declare function validateFilter(filter: NostrFilter): ValidationResult;
/**
 * Validates a Nostr subscription
 */
export declare function validateSubscription(subscription: NostrSubscription): ValidationResult;
