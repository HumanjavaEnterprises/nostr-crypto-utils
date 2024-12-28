/**
 * @module validation
 * @description Validation utilities for Nostr events, messages, and related data structures.
 * Provides functions to validate events, signatures, filters, and subscriptions according to the Nostr protocol.
 */

import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/curves/abstract/utils';
import { schnorr } from '@noble/curves/secp256k1';
import { NostrEvent, SignedNostrEvent, ValidationResult, NostrFilter, NostrSubscription, NostrEventKind } from '../types/base';
import { logger } from '../utils';
import { validatePublicKey } from '../crypto/keys';

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
export function validateEventId(event: SignedNostrEvent): ValidationResult {
  try {
    const serialized = JSON.stringify([
      0,
      event.pubkey.hex,  // Use hex representation for pubkey
      event.created_at,
      event.kind,
      event.tags,
      event.content
    ]);
    const hash = bytesToHex(sha256(new TextEncoder().encode(serialized)));
    return {
      isValid: hash === event.id,
      error: hash === event.id ? undefined : 'Invalid event ID'
    };
  } catch (error) {
    logger.error('Failed to validate event ID:', error);
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
export function validateEventSignature(event: SignedNostrEvent): ValidationResult {
  try {
    // Verify the signature
    const serialized = JSON.stringify([
      0,
      event.pubkey.hex,  // Use hex representation for pubkey
      event.created_at,
      event.kind,
      event.tags,
      event.content
    ]);
    const hash = sha256(new TextEncoder().encode(serialized));
    const isValid = schnorr.verify(event.sig, hash, event.pubkey.hex);  // Use hex representation for pubkey
    
    return {
      isValid,
      error: isValid ? undefined : 'Invalid signature'
    };
  } catch (error) {
    logger.error('Failed to validate event signature:', error);
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
export function validateEvent(event: SignedNostrEvent): ValidationResult {
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
export function validateSignedEvent(event: SignedNostrEvent): ValidationResult {
  try {
    // Check basic event structure
    const baseValidation = validateEventBase(event);
    if (!baseValidation.isValid) {
      return baseValidation;
    }

    // Validate pubkey format
    if (!event.pubkey || !event.pubkey.hex || typeof event.pubkey.hex !== 'string' || event.pubkey.hex.length !== 64) {
      return {
        isValid: false,
        error: 'Invalid public key format'
      };
    }

    // Validate signature format
    if (!event.sig || typeof event.sig !== 'string' || event.sig.length !== 128) {
      return {
        isValid: false,
        error: 'Invalid signature format'
      };
    }

    // Validate ID format
    if (!event.id || typeof event.id !== 'string' || event.id.length !== 64) {
      return {
        isValid: false,
        error: 'Invalid event ID format'
      };
    }

    return { isValid: true };
  } catch (error) {
    logger.error('Failed to validate signed event:', error);
    return {
      isValid: false,
      error: 'Failed to validate signed event'
    };
  }
}

/**
 * Validates a Nostr event by checking its structure and fields.
 * @param event - The event to validate
 * @returns Validation result and any error message
 */
export function validateEventBase(event: NostrEvent | SignedNostrEvent): ValidationResult {
  // Check required fields
  if (!event || typeof event !== 'object') {
    return { isValid: false, error: 'Invalid event structure' };
  }

  // Validate kind
  if (typeof event.kind !== 'number' || event.kind < 0) {
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

  // Validate tags
  if (!Array.isArray(event.tags)) {
    return { isValid: false, error: 'Event tags must be an array' };
  }

  // Additional validation for signed events
  if ('id' in event && 'sig' in event) {
    const signedEvent = event as SignedNostrEvent;
    
    // Validate signature format
    if (!/^[0-9a-f]{128}$/.test(signedEvent.sig)) {
      return { isValid: false, error: 'Invalid signature format' };
    }

    // Validate id format
    if (!/^[0-9a-f]{64}$/.test(signedEvent.id)) {
      return { isValid: false, error: 'Invalid event ID format' };
    }
  }

  return { isValid: true };
}

/**
 * Validates a Nostr filter
 * @param filter - The filter to validate
 * @returns Validation result
 */
export function validateFilter(filter: NostrFilter): ValidationResult {
  if (!filter || typeof filter !== 'object') {
    return { isValid: false, error: 'Invalid filter structure' };
  }

  // Validate kinds if present
  if (filter.kinds) {
    if (!Array.isArray(filter.kinds)) {
      return { isValid: false, error: 'Filter kinds must be an array' };
    }
    
    for (const kind of filter.kinds) {
      if (typeof kind !== 'number' || kind < 0 || !Number.isInteger(kind)) {
        return { isValid: false, error: 'Filter kinds must be non-negative integers' };
      }
    }
  }

  return { isValid: true };
}

/**
 * Validates a Nostr subscription
 * @param subscription - The subscription to validate
 * @returns Validation result
 */
export function validateSubscription(subscription: NostrSubscription): ValidationResult {
  if (!subscription || typeof subscription !== 'object') {
    return { isValid: false, error: 'Invalid subscription structure' };
  }

  if (!Array.isArray(subscription.filters) || subscription.filters.length === 0) {
    return { isValid: false, error: 'Subscription must have at least one filter' };
  }

  for (const filter of subscription.filters) {
    const result = validateFilter(filter);
    if (!result.isValid) {
      return result;
    }
  }

  return { isValid: true };
}
