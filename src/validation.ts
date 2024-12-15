import { NostrEvent, SignedNostrEvent } from './types/base';
import { NostrFilter, NostrSubscription, NostrResponse, NostrError } from './types/protocol';
import { isNostrEvent, isSignedNostrEvent, isNostrFilter, isNostrSubscription } from './types/guards';
import { NOSTR_KIND } from './constants';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates a Nostr event against the protocol specification
 */
export function validateEvent(event: NostrEvent): ValidationResult {
  const errors: string[] = [];

  // Basic type validation
  if (!isNostrEvent(event)) {
    errors.push('Invalid event structure');
    return { isValid: false, errors };
  }

  // Validate created_at
  if (event.created_at) {
    const now = Math.floor(Date.now() / 1000);
    if (event.created_at > now + 60 * 60) { // 1 hour in the future
      errors.push('Event timestamp is too far in the future');
    }
  }

  // Validate kind
  if (event.kind < 0) {
    errors.push('Event kind must be a non-negative integer');
  }

  // Validate tags structure
  if (event.tags) {
    for (const [index, tag] of event.tags.entries()) {
      if (!Array.isArray(tag) || tag.length === 0) {
        errors.push(`Invalid tag structure at index ${index}`);
        continue;
      }
      if (typeof tag[0] !== 'string') {
        errors.push(`Tag identifier at index ${index} must be a string`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates a signed Nostr event
 */
export function validateSignedEvent(event: SignedNostrEvent): ValidationResult {
  const errors: string[] = [];

  // Basic type validation
  if (!isSignedNostrEvent(event)) {
    errors.push('Invalid signed event structure');
    return { isValid: false, errors };
  }

  // Validate base event properties
  const baseValidation = validateEvent(event);
  errors.push(...baseValidation.errors);

  // Validate id length (32 bytes hex)
  if (event.id.length !== 64 || !/^[0-9a-f]{64}$/.test(event.id)) {
    errors.push('Invalid event id format');
  }

  // Validate signature length (64 bytes hex)
  if (event.sig.length !== 128 || !/^[0-9a-f]{128}$/.test(event.sig)) {
    errors.push('Invalid signature format');
  }

  // Validate pubkey length (32 bytes hex)
  if (event.pubkey.length !== 64 || !/^[0-9a-f]{64}$/.test(event.pubkey)) {
    errors.push('Invalid public key format');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates a Nostr filter
 */
export function validateFilter(filter: NostrFilter): ValidationResult {
  const errors: string[] = [];

  // Basic type validation
  if (!isNostrFilter(filter)) {
    errors.push('Invalid filter structure');
    return { isValid: false, errors };
  }

  // Validate arrays contain correct types
  if (filter.ids && !filter.ids.every(id => typeof id === 'string' && /^[0-9a-f]{64}$/.test(id))) {
    errors.push('Invalid event id format in ids filter');
  }

  if (filter.authors && !filter.authors.every(author => typeof author === 'string' && /^[0-9a-f]{64}$/.test(author))) {
    errors.push('Invalid public key format in authors filter');
  }

  if (filter.kinds && !filter.kinds.every(kind => Number.isInteger(kind) && kind >= 0)) {
    errors.push('Invalid event kind in kinds filter');
  }

  // Validate timestamps
  if (filter.since && (!Number.isInteger(filter.since) || filter.since < 0)) {
    errors.push('Invalid since timestamp');
  }

  if (filter.until && (!Number.isInteger(filter.until) || filter.until < 0)) {
    errors.push('Invalid until timestamp');
  }

  if (filter.since && filter.until && filter.since > filter.until) {
    errors.push('since timestamp cannot be greater than until timestamp');
  }

  // Validate limit
  if (filter.limit && (!Number.isInteger(filter.limit) || filter.limit < 0)) {
    errors.push('Invalid limit value');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates a Nostr subscription
 */
export function validateSubscription(subscription: NostrSubscription): ValidationResult {
  const errors: string[] = [];

  // Basic type validation
  if (!isNostrSubscription(subscription)) {
    errors.push('Invalid subscription structure');
    return { isValid: false, errors };
  }

  // Validate subscription ID
  if (!subscription.id || typeof subscription.id !== 'string' || subscription.id.length === 0) {
    errors.push('Invalid subscription id');
  }

  // Validate filters
  if (!Array.isArray(subscription.filters) || subscription.filters.length === 0) {
    errors.push('Subscription must contain at least one filter');
  } else {
    for (const [index, filter] of subscription.filters.entries()) {
      const filterValidation = validateFilter(filter);
      if (!filterValidation.isValid) {
        errors.push(`Invalid filter at index ${index}: ${filterValidation.errors.join(', ')}`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
