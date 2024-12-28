import { NostrEvent, NostrFilter, NostrSubscription, SignedNostrEvent, PublicKey } from '../types';
import { isNostrEvent, isNostrFilter, isSignedNostrEvent } from '../types/guards';
import { schnorr } from '@noble/curves/secp256k1';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { sha256 } from '@noble/hashes/sha256';

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
export function validateEvent(event: NostrEvent): ValidationResult {
  const errors: string[] = [];

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
  } else if (!event.tags.every(tag => Array.isArray(tag) && tag.every(item => typeof item === 'string'))) {
    errors.push('Each tag must be an array of strings');
  }

  return {
    isValid: errors.length === 0,
    error: errors.length > 0 ? errors[0] : undefined
  };
}

/**
 * Gets the hex representation of a public key
 * @param pubkey - Public key in either hex or details format
 * @returns Hex representation of the public key
 */
function getPublicKeyHex(pubkey: PublicKey): string {
  return typeof pubkey === 'string' ? pubkey : pubkey.hex;
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
 *   console.error('Invalid signature or event structure:', validation.error);
 * }
 * ```
 */
export function validateSignedEvent(event: SignedNostrEvent): ValidationResult {
  const errors: string[] = [];
  
  // Check if the event matches the SignedNostrEvent type structure
  if (!isSignedNostrEvent(event)) {
    errors.push('Invalid signed event structure');
  }

  const baseValidation = validateEvent(event);
  if (!baseValidation.isValid) {
    errors.push(baseValidation.error || '');
  }

  // Check pubkey format (64 character hex string)
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
      const isValid = schnorr.verify(
        hexToBytes(event.sig),
        hexToBytes(event.id),
        hexToBytes(event.pubkey)
      );
      if (!isValid) {
        errors.push('Invalid signature');
      }
    } catch (error) {
      errors.push(`Signature verification failed: ${error instanceof Error ? error.message : 'unknown error'}`);
    }
  }

  return {
    isValid: errors.length === 0,
    error: errors.length > 0 ? errors[0] : undefined
  };
}

/**
 * Validates a filter object
 * @param filter - Filter to validate
 * @returns Validation result
 */
export function validateFilter(filter: NostrFilter): ValidationResult {
  // Check if the filter matches the NostrFilter type structure
  if (!isNostrFilter(filter)) {
    return {
      isValid: false,
      error: 'Filter kinds must be non-negative integers'
    };
  }

  return {
    isValid: true,
    error: undefined
  };
}

/**
 * Validates a subscription object
 * @param subscription - Subscription to validate
 * @returns Validation result
 */
export function validateSubscription(subscription: NostrSubscription): ValidationResult {
  if (!subscription.id) {
    return {
      isValid: false,
      error: 'Subscription must have an id'
    };
  }

  if (!subscription.filters || !Array.isArray(subscription.filters) || subscription.filters.length === 0) {
    return {
      isValid: false,
      error: 'Subscription must have at least one filter'
    };
  }

  for (const filter of subscription.filters) {
    const filterResult = validateFilter(filter);
    if (!filterResult.isValid) {
      return filterResult;
    }
  }

  return {
    isValid: true,
    error: undefined
  };
}
