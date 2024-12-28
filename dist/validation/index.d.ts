/**
 * @module validation
 * @description Validation utilities for Nostr events, messages, and related data structures.
 * Provides functions to validate events, signatures, filters, and subscriptions according to the Nostr protocol.
 */
import { NostrEvent, SignedNostrEvent, ValidationResult, NostrFilter, NostrSubscription } from '../types/base';
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
export declare function validateEventId(event: SignedNostrEvent): ValidationResult;
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
export declare function validateEventSignature(event: SignedNostrEvent): ValidationResult;
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
export declare function validateEvent(event: SignedNostrEvent): ValidationResult;
/**
 * Validates a signed Nostr event by checking its structure and signature format.
 *
 * @param {SignedNostrEvent} event - The event to validate
 * @returns {ValidationResult} Object containing validation result and any error message
 * @example
 * ```typescript
 * const result = validateSignedEvent(event);
 * if (!result.isValid) {
 *   console.error(result.error);
 * }
 * ```
 */
export declare function validateSignedEvent(event: SignedNostrEvent): ValidationResult;
/**
 * Validates a Nostr event by checking its structure and fields.
 * @param event - The event to validate
 * @returns Validation result and any error message
 */
export declare function validateEventBase(event: NostrEvent | SignedNostrEvent): ValidationResult;
/**
 * Validates a Nostr filter
 * @param filter - The filter to validate
 * @returns Validation result
 */
export declare function validateFilter(filter: NostrFilter): ValidationResult;
/**
 * Validates a Nostr subscription
 * @param subscription - The subscription to validate
 * @returns Validation result
 */
export declare function validateSubscription(subscription: NostrSubscription): ValidationResult;
