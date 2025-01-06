/**
 * @module validation
 * @description Validation utilities for Nostr events, messages, and related data structures.
 * Provides functions to validate events, signatures, filters, and subscriptions according to the Nostr protocol.
 */

import { 
  NostrEvent, 
  SignedNostrEvent, 
  NostrFilter, 
  NostrSubscription, 
  ValidationResult, 
  PublicKey,
  NostrMessageType
} from '../types/index.js';

import { logger } from '../utils/logger.js';

import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/curves/abstract/utils';
import { schnorr } from '@noble/curves/secp256k1';

/**
 * Gets the hex string from a PublicKey
 */
function getPublicKeyHex(pubkey: PublicKey): string {
  return typeof pubkey === 'string' ? pubkey : pubkey.hex;
}

function hexToBytes(hex: string): Uint8Array {
  return new Uint8Array(hex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
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
export function validateEventId(event: SignedNostrEvent): ValidationResult {
  try {
    const serialized = JSON.stringify([
      0,
      getPublicKeyHex(event.pubkey),
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
    logger.error({ error }, 'Failed to validate event ID');
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
      getPublicKeyHex(event.pubkey),
      event.created_at,
      event.kind,
      event.tags,
      event.content
    ]);
    const hash = sha256(new TextEncoder().encode(serialized));
    const pubkeyHex = getPublicKeyHex(event.pubkey);
    const pubkeyBytes = hexToBytes(pubkeyHex);
    const isValid = schnorr.verify(event.sig, hash, pubkeyBytes);
    
    return {
      isValid,
      error: isValid ? undefined : 'Invalid signature'
    };
  } catch (error) {
    logger.error({ error }, 'Failed to validate event signature');
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

    // Get pubkey hex
    const pubkeyHex = getPublicKeyHex(event.pubkey);

    // Validate pubkey format
    if (!pubkeyHex || typeof pubkeyHex !== 'string' || pubkeyHex.length !== 64) {
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
    logger.error({ error }, 'Failed to validate signed event');
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

  // Validate pubkey format
  if (!event.pubkey) {
    return { isValid: false, error: 'Missing public key' };
  }

  // Get pubkey hex
  const pubkeyHex = getPublicKeyHex(event.pubkey);
  if (typeof pubkeyHex !== 'string' || !/^[0-9a-f]{64}$/.test(pubkeyHex)) {
    return { isValid: false, error: 'Invalid public key format' };
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
export function validateFilter(filter: NostrFilter): ValidationResult {
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
  } catch (error) {
    logger.error({ error }, 'Failed to validate filter');
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
export function validateSubscription(subscription: NostrSubscription): ValidationResult {
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
  } catch (error) {
    logger.error({ error }, 'Failed to validate subscription');
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
export function validateResponse(message: unknown): ValidationResult {
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
  if (!Object.values(NostrMessageType).includes(type as NostrMessageType)) {
    return {
      isValid: false,
      error: `Invalid message type: ${type}`
    };
  }

  // Type-specific validation
  switch (type) {
    case NostrMessageType.EVENT:
      if (message.length !== 2) {
        return {
          isValid: false,
          error: 'EVENT message must have exactly 2 elements'
        };
      }
      return validateSignedEvent(message[1] as SignedNostrEvent);

    case NostrMessageType.NOTICE:
      if (message.length !== 2 || typeof message[1] !== 'string') {
        return {
          isValid: false,
          error: 'NOTICE message must have exactly 2 elements with a string message'
        };
      }
      return { isValid: true };

    case NostrMessageType.OK:
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

    case NostrMessageType.EOSE:
      if (message.length !== 2 || typeof message[1] !== 'string') {
        return {
          isValid: false,
          error: 'EOSE message must have exactly 2 elements with a subscription ID'
        };
      }
      return { isValid: true };

    case NostrMessageType.REQ:
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
        const filterResult = validateFilter(message[i] as NostrFilter);
        if (!filterResult.isValid) {
          return filterResult;
        }
      }
      return { isValid: true };

    case NostrMessageType.CLOSE:
      if (message.length !== 2 || typeof message[1] !== 'string') {
        return {
          isValid: false,
          error: 'CLOSE message must have exactly 2 elements with a subscription ID'
        };
      }
      return { isValid: true };

    case NostrMessageType.AUTH:
      if (message.length !== 2) {
        return {
          isValid: false,
          error: 'AUTH message must have exactly 2 elements'
        };
      }
      return validateSignedEvent(message[1] as SignedNostrEvent);

    default:
      return {
        isValid: false,
        error: `Unsupported message type: ${type}`
      };
  }
}
