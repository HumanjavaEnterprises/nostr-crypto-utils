/**
 * @module validation
 * @description Validation utilities for Nostr events, messages, and related data structures.
 * Provides functions to validate events, signatures, filters, and subscriptions according to the Nostr protocol.
 */
import { NostrEvent, SignedNostrEvent, NostrFilter, NostrSubscription, ValidationResult } from '../types/index.js';
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
 * Validates a signed Nostr event: structure, canonical id/pubkey/sig format,
 * id = hash(event), AND the schnorr signature. Equivalent to {@link validateEvent}.
 *
 * Before 0.10.0 this only checked the format of `id`/`sig`; that check is now
 * {@link validateSignedEventFormat}.
 *
 * @param {SignedNostrEvent} event - The event to validate
 * @returns {ValidationResult} Object containing validation result and any error message
 */
export declare function validateSignedEvent(event: SignedNostrEvent): ValidationResult;
/**
 * FORMAT-ONLY check of a signed event: structure plus canonical lowercase hex
 * `pubkey` (64), `id` (64) and `sig` (128). Does NOT recompute the id or verify
 * the signature — use {@link validateEvent} to decide whether an event is authentic.
 *
 * @param {SignedNostrEvent} event - The event to check
 * @returns {ValidationResult} Object containing validation result and any error message
 */
export declare function validateSignedEventFormat(event: SignedNostrEvent): ValidationResult;
/**
 * Validates a Nostr event by checking its structure and fields.
 * @param event - The event to validate
 * @returns Validation result and any error message
 */
export declare function validateEventBase(event: NostrEvent | SignedNostrEvent): ValidationResult;
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
export declare function validateFilter(filter: NostrFilter): ValidationResult;
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
export declare function validateSubscription(subscription: NostrSubscription): ValidationResult;
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
export declare function validateResponse(message: unknown): ValidationResult;
