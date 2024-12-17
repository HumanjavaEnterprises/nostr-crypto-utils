import { NostrEvent, SignedNostrEvent } from './base';
import { NostrFilter, NostrSubscription, NostrResponse, NostrError, NostrMessageType } from './protocol';

/**
 * Type guard for NostrEvent
 */
export function isNostrEvent(obj: unknown): obj is NostrEvent {
  if (!obj || typeof obj !== 'object') return false;
  const event = obj as NostrEvent;

  // Check required fields
  if (typeof event.kind !== 'number' || event.kind < 0) return false;
  if (typeof event.content !== 'string') return false;
  if (!Array.isArray(event.tags)) return false;

  // Validate tags array - each tag must be an array of strings
  if (!event.tags.every(tag => Array.isArray(tag) && tag.every(item => typeof item === 'string'))) {
    return false;
  }

  // Optional fields
  if (event.created_at !== undefined && typeof event.created_at !== 'number') return false;
  if (event.pubkey !== undefined && typeof event.pubkey !== 'string') return false;

  return true;
}

/**
 * Type guard for SignedNostrEvent
 */
export function isSignedNostrEvent(obj: unknown): obj is SignedNostrEvent {
  if (!isNostrEvent(obj)) return false;
  const event = obj as SignedNostrEvent;

  // Check required fields for signed events
  if (typeof event.pubkey !== 'string') return false;
  if (typeof event.id !== 'string') return false;
  if (typeof event.sig !== 'string') return false;

  return true;
}

/**
 * Type guard for NostrFilter
 */
export function isNostrFilter(obj: unknown): obj is NostrFilter {
  if (!obj || typeof obj !== 'object') return false;
  const filter = obj as NostrFilter;

  // Check that all present fields have the correct type
  if (filter.ids !== undefined && (!Array.isArray(filter.ids) || !filter.ids.every(id => typeof id === 'string'))) {
    return false;
  }
  if (filter.authors !== undefined && (!Array.isArray(filter.authors) || !filter.authors.every(author => typeof author === 'string'))) {
    return false;
  }
  if (filter.kinds !== undefined && (!Array.isArray(filter.kinds) || !filter.kinds.every(kind => typeof kind === 'number'))) {
    return false;
  }
  if (filter.since !== undefined && typeof filter.since !== 'number') {
    return false;
  }
  if (filter.until !== undefined && typeof filter.until !== 'number') {
    return false;
  }
  if (filter.limit !== undefined && typeof filter.limit !== 'number') {
    return false;
  }

  // Check tag filters
  for (const [key, value] of Object.entries(filter)) {
    if (key.startsWith('#')) {
      if (!Array.isArray(value) || !value.every(item => typeof item === 'string')) {
        return false;
      }
    }
  }

  // Check for unknown properties
  const validKeys = ['ids', 'authors', 'kinds', 'since', 'until', 'limit'];
  const hasUnknownProps = Object.keys(filter).some(key => !validKeys.includes(key) && !key.startsWith('#'));
  if (hasUnknownProps) {
    return false;
  }

  return true;
}

/**
 * Type guard for NostrSubscription
 */
export function isNostrSubscription(obj: unknown): obj is NostrSubscription {
  if (!obj || typeof obj !== 'object') return false;
  const sub = obj as NostrSubscription;

  // Check required fields
  if (typeof sub.id !== 'string' || sub.id.length === 0) return false;
  if (!Array.isArray(sub.filters)) return false;

  // Check for unknown properties
  const validKeys = ['id', 'filters'];
  const hasUnknownProps = Object.keys(sub).some(key => !validKeys.includes(key));
  if (hasUnknownProps) {
    return false;
  }

  // Each filter must be a valid NostrFilter
  return sub.filters.every(filter => isNostrFilter(filter));
}

/**
 * Type guard for NostrResponse
 */
export function isNostrResponse(obj: unknown): obj is NostrResponse {
  if (!obj || typeof obj !== 'object') return false;
  
  const response = obj as Record<string, unknown>;
  return (
    typeof response.type === 'string' &&
    Object.values(NostrMessageType).includes(response.type as NostrMessageType) &&
    'payload' in response
  );
}

/**
 * Type guard for NostrError
 */
export function isNostrError(obj: unknown): obj is NostrError {
  if (!obj || typeof obj !== 'object') return false;
  
  const error = obj as Record<string, unknown>;
  return (
    typeof error.code === 'number' &&
    typeof error.message === 'string'
  );
}
