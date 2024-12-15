import { NostrEvent, SignedNostrEvent } from './base';
import { NostrFilter, NostrSubscription, NostrResponse, NostrError, NostrMessageType } from './protocol';

/**
 * Type guard for NostrEvent
 */
export function isNostrEvent(event: any): event is NostrEvent {
  return (
    typeof event === 'object' &&
    event !== null &&
    typeof event.kind === 'number' &&
    typeof event.content === 'string' &&
    typeof event.created_at === 'number' &&
    Array.isArray(event.tags) && 
    event.tags.every((tag: any) => Array.isArray(tag) && tag.every((item: any) => typeof item === 'string')) &&
    (event.pubkey === undefined || typeof event.pubkey === 'string')
  );
}

/**
 * Type guard for SignedNostrEvent
 */
export function isSignedNostrEvent(event: any): event is SignedNostrEvent {
  return (
    typeof event === 'object' &&
    event !== null &&
    typeof event.id === 'string' &&
    typeof event.sig === 'string' &&
    typeof event.pubkey === 'string' &&
    typeof event.kind === 'number' &&
    typeof event.content === 'string' &&
    typeof event.created_at === 'number' &&
    Array.isArray(event.tags) &&
    event.tags.every((tag: any) => Array.isArray(tag) && tag.every((item: any) => typeof item === 'string'))
  );
}

/**
 * Type guard for NostrFilter
 */
export function isNostrFilter(obj: unknown): obj is NostrFilter {
  if (!obj || typeof obj !== 'object') return false;
  
  const filter = obj as NostrFilter;
  const hasValidProperty = (
    'ids' in filter ||
    'authors' in filter ||
    'kinds' in filter ||
    '#e' in filter ||
    '#p' in filter ||
    'since' in filter ||
    'until' in filter ||
    'limit' in filter
  );

  if (!hasValidProperty) return false;

  return (
    (!('ids' in filter) || (Array.isArray(filter.ids) && filter.ids.every(id => typeof id === 'string'))) &&
    (!('authors' in filter) || (Array.isArray(filter.authors) && filter.authors.every(author => typeof author === 'string'))) &&
    (!('kinds' in filter) || (Array.isArray(filter.kinds) && filter.kinds.every(kind => typeof kind === 'number'))) &&
    (!('#e' in filter) || (Array.isArray(filter['#e']) && filter['#e'].every(e => typeof e === 'string'))) &&
    (!('#p' in filter) || (Array.isArray(filter['#p']) && filter['#p'].every(p => typeof p === 'string'))) &&
    (!('since' in filter) || typeof filter.since === 'number') &&
    (!('until' in filter) || typeof filter.until === 'number') &&
    (!('limit' in filter) || typeof filter.limit === 'number')
  );
}

/**
 * Type guard for NostrSubscription
 */
export function isNostrSubscription(obj: unknown): obj is NostrSubscription {
  if (!obj || typeof obj !== 'object') return false;
  
  const sub = obj as NostrSubscription;
  return (
    'id' in sub &&
    'filters' in sub &&
    typeof sub.id === 'string' &&
    Array.isArray(sub.filters) &&
    sub.filters.every(isNostrFilter)
  );
}

/**
 * Type guard for NostrResponse
 */
export function isNostrResponse(obj: unknown): obj is NostrResponse {
  if (!obj || typeof obj !== 'object') return false;
  
  const response = obj as NostrResponse;
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
  
  const error = obj as NostrError;
  return (
    typeof error.code === 'number' &&
    typeof error.message === 'string'
  );
}
