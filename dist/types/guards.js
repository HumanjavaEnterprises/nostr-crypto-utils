/**
 * @module types/guards
 * @description Type guard functions for Nostr types
 */
import { NostrMessageType } from './protocol';
/**
 * Type guard for NostrEvent
 */
export function isNostrEvent(event) {
    if (typeof event !== 'object' || event === null) {
        return false;
    }
    // Required fields
    if (typeof event.kind !== 'number')
        return false;
    if (!Array.isArray(event.tags))
        return false;
    if (typeof event.content !== 'string')
        return false;
    // Optional fields
    if (event.pubkey !== undefined && typeof event.pubkey !== 'string')
        return false;
    if (event.created_at !== undefined && typeof event.created_at !== 'number')
        return false;
    // Check tag array elements
    if (!event.tags.every((tag) => Array.isArray(tag) && tag.every((item) => typeof item === 'string'))) {
        return false;
    }
    return true;
}
/**
 * Type guard for SignedNostrEvent
 */
export function isSignedNostrEvent(event) {
    // Check basic object validity
    if (typeof event !== 'object' || event === null) {
        return false;
    }
    // Check required fields for signed events first
    if (typeof event.id !== 'string' || event.id.length === 0)
        return false;
    if (typeof event.sig !== 'string' || event.sig.length === 0)
        return false;
    // Check pubkey - can be either string or PublicKey object
    if (typeof event.pubkey === 'string') {
        if (event.pubkey.length === 0)
            return false;
    }
    else if (typeof event.pubkey === 'object' && event.pubkey !== null) {
        if (typeof event.pubkey.hex !== 'string' || event.pubkey.hex.length === 0)
            return false;
        if (!(event.pubkey.bytes instanceof Uint8Array))
            return false;
    }
    else {
        return false;
    }
    if (typeof event.created_at !== 'number')
        return false;
    // Then check NostrEvent fields
    if (typeof event.kind !== 'number')
        return false;
    if (!Array.isArray(event.tags))
        return false;
    if (typeof event.content !== 'string')
        return false;
    // Check tag array elements
    if (!event.tags.every((tag) => Array.isArray(tag) && tag.every((item) => typeof item === 'string'))) {
        return false;
    }
    return true;
}
/**
 * Type guard for NostrFilter
 */
export function isNostrFilter(filter) {
    if (typeof filter !== 'object' || filter === null) {
        return false;
    }
    const validKeys = ['ids', 'authors', 'kinds', 'since', 'until', 'limit', '#e', '#p', '#t'];
    const filterKeys = Object.keys(filter);
    // Check if all keys in the filter are valid
    if (!filterKeys.every(key => validKeys.includes(key))) {
        return false;
    }
    // Validate array fields
    if (filter.ids !== undefined && (!Array.isArray(filter.ids) || !filter.ids.every((id) => typeof id === 'string'))) {
        return false;
    }
    if (filter.authors !== undefined && (!Array.isArray(filter.authors) || !filter.authors.every((author) => typeof author === 'string'))) {
        return false;
    }
    if (filter.kinds !== undefined && (!Array.isArray(filter.kinds) || !filter.kinds.every((kind) => typeof kind === 'number'))) {
        return false;
    }
    if (filter['#e'] !== undefined && (!Array.isArray(filter['#e']) || !filter['#e'].every((e) => typeof e === 'string'))) {
        return false;
    }
    if (filter['#p'] !== undefined && (!Array.isArray(filter['#p']) || !filter['#p'].every((p) => typeof p === 'string'))) {
        return false;
    }
    if (filter['#t'] !== undefined && (!Array.isArray(filter['#t']) || !filter['#t'].every((t) => typeof t === 'string'))) {
        return false;
    }
    // Validate number fields
    if (filter.since !== undefined && typeof filter.since !== 'number')
        return false;
    if (filter.until !== undefined && typeof filter.until !== 'number')
        return false;
    if (filter.limit !== undefined && typeof filter.limit !== 'number')
        return false;
    return true;
}
/**
 * Type guard for NostrSubscription
 */
export function isNostrSubscription(sub) {
    return (typeof sub === 'object' &&
        sub !== null &&
        typeof sub.id === 'string' &&
        Array.isArray(sub.filters) &&
        sub.filters.every((filter) => isNostrFilter(filter)));
}
/**
 * Type guard for NostrResponse
 */
export function isNostrResponse(response) {
    return (typeof response === 'object' &&
        response !== null &&
        typeof response.type === 'string' &&
        Object.values(NostrMessageType).includes(response.type) &&
        (response.subscriptionId === undefined || typeof response.subscriptionId === 'string') &&
        (response.event === undefined || isSignedNostrEvent(response.event)) &&
        (response.message === undefined || typeof response.message === 'string'));
}
/**
 * Type guard for NostrError
 */
export function isNostrError(error) {
    return (typeof error === 'object' &&
        error !== null &&
        error.type === NostrMessageType.NOTICE &&
        typeof error.message === 'string');
}
