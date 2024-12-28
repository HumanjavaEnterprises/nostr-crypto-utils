/**
 * @module types/guards
 * @description Type guard functions for Nostr types
 */

import { NostrEvent, SignedNostrEvent, NostrFilter, NostrSubscription, NostrResponse, NostrError } from './base';

/**
 * Type guard for NostrEvent
 */
export function isNostrEvent(event: unknown): event is NostrEvent {
  if (typeof event !== 'object' || event === null) {
    return false;
  }

  const validEvent = event as Record<string, unknown>;

  // Required fields
  if (typeof validEvent.kind !== 'number' || !Number.isInteger(validEvent.kind) || validEvent.kind < 0) {
    return false;
  }

  if (typeof validEvent.content !== 'string') {
    return false;
  }

  if (typeof validEvent.created_at !== 'number' || !Number.isInteger(validEvent.created_at)) {
    return false;
  }

  // Check pubkey structure
  if (validEvent.pubkey !== undefined) {
    if (typeof validEvent.pubkey === 'string') {
      if (!validEvent.pubkey) {
        return false;
      }
    } else if (typeof validEvent.pubkey === 'object' && validEvent.pubkey !== null) {
      const pubkey = validEvent.pubkey as Record<string, unknown>;
      if (typeof pubkey.hex !== 'string' || !pubkey.hex) {
        return false;
      }
    } else {
      return false;
    }
  }

  // Check tags array
  if (!Array.isArray(validEvent.tags)) {
    return false;
  }

  // Check tag array elements
  if (!validEvent.tags.every(tag => Array.isArray(tag) && tag.every(item => typeof item === 'string'))) {
    return false;
  }

  return true;
}

/**
 * Type guard for SignedNostrEvent
 */
export function isSignedNostrEvent(event: unknown): event is SignedNostrEvent {
  if (!event || typeof event !== 'object') {
    return false;
  }

  const signedEvent = event as Record<string, unknown>;

  // Check required fields from NostrEvent
  if (!isNostrEvent(event)) {
    return false;
  }

  // Check pubkey is present and valid
  if (typeof signedEvent.pubkey === 'string') {
    if (!signedEvent.pubkey) {
      return false;
    }
  } else if (typeof signedEvent.pubkey === 'object' && signedEvent.pubkey !== null) {
    const pubkey = signedEvent.pubkey as Record<string, unknown>;
    if (typeof pubkey.hex !== 'string' || !pubkey.hex) {
      return false;
    }
  } else {
    return false;
  }

  // Check id field
  if (typeof signedEvent.id !== 'string' || !signedEvent.id) {
    return false;
  }

  // Check sig field
  if (typeof signedEvent.sig !== 'string' || !signedEvent.sig) {
    return false;
  }

  return true;
}

/**
 * Type guard for NostrFilter
 */
export function isNostrFilter(filter: unknown): filter is NostrFilter {
  if (typeof filter !== 'object' || filter === null) {
    return false;
  }

  const validFilter = filter as Record<string, unknown>;
  const validKeys = ['ids', 'authors', 'kinds', 'since', 'until', 'limit', '#e', '#p', '#t'];
  const filterKeys = Object.keys(validFilter);

  // Check if all keys in the filter are valid
  if (!filterKeys.every(key => validKeys.includes(key))) {
    return false;
  }

  // Validate array fields
  if (validFilter.ids !== undefined && (!Array.isArray(validFilter.ids) || !validFilter.ids.every(id => typeof id === 'string'))) {
    return false;
  }
  if (validFilter.authors !== undefined && (!Array.isArray(validFilter.authors) || !validFilter.authors.every(author => typeof author === 'string'))) {
    return false;
  }
  if (validFilter.kinds !== undefined && (!Array.isArray(validFilter.kinds) || !validFilter.kinds.every(kind => typeof kind === 'number' && Number.isInteger(kind) && kind >= 0))) {
    return false;
  }
  if (validFilter['#e'] !== undefined && (!Array.isArray(validFilter['#e']) || !validFilter['#e'].every(e => typeof e === 'string'))) {
    return false;
  }
  if (validFilter['#p'] !== undefined && (!Array.isArray(validFilter['#p']) || !validFilter['#p'].every(p => typeof p === 'string'))) {
    return false;
  }
  if (validFilter['#t'] !== undefined && (!Array.isArray(validFilter['#t']) || !validFilter['#t'].every(t => typeof t === 'string'))) {
    return false;
  }

  // Validate number fields
  if (validFilter.since !== undefined && typeof validFilter.since !== 'number') return false;
  if (validFilter.until !== undefined && typeof validFilter.until !== 'number') return false;
  if (validFilter.limit !== undefined && typeof validFilter.limit !== 'number') return false;

  return true;
}

/**
 * Type guard for NostrSubscription
 */
export function isNostrSubscription(sub: unknown): sub is NostrSubscription {
  if (typeof sub !== 'object' || sub === null) {
    return false;
  }

  const validSub = sub as Record<string, unknown>;

  if (typeof validSub.id !== 'string') {
    return false;
  }

  if (!Array.isArray(validSub.filters)) {
    return false;
  }

  if (!validSub.filters.every(filter => isNostrFilter(filter))) {
    return false;
  }

  return true;
}

/**
 * Type guard for NostrResponse
 */
export function isNostrResponse(response: unknown): response is NostrResponse {
  if (typeof response !== 'object' || response === null) {
    return false;
  }

  const validResponse = response as Record<string, unknown>;

  if (typeof validResponse.type !== 'string') {
    return false;
  }

  if (validResponse.subscriptionId !== undefined && typeof validResponse.subscriptionId !== 'string') {
    return false;
  }

  if (validResponse.event !== undefined && !isSignedNostrEvent(validResponse.event)) {
    return false;
  }

  if (validResponse.message !== undefined && typeof validResponse.message !== 'string') {
    return false;
  }

  return true;
}

/**
 * Type guard for NostrError
 */
export function isNostrError(error: unknown): error is NostrError {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const validError = error as Record<string, unknown>;

  return (
    typeof validError.type === 'string' &&
    typeof validError.message === 'string'
  );
}
