/**
 * @module types/guards
 * @description Type guard functions for Nostr types
 */
import type { NostrEvent } from './base';
import type { SignedNostrEvent } from './base';
import { NostrFilter, NostrSubscription, NostrResponse, NostrError } from './protocol';
/**
 * Type guard for NostrEvent
 */
export declare function isNostrEvent(event: any): event is NostrEvent;
/**
 * Type guard for SignedNostrEvent
 */
export declare function isSignedNostrEvent(event: any): event is SignedNostrEvent;
/**
 * Type guard for NostrFilter
 */
export declare function isNostrFilter(filter: any): filter is NostrFilter;
/**
 * Type guard for NostrSubscription
 */
export declare function isNostrSubscription(sub: any): sub is NostrSubscription;
/**
 * Type guard for NostrResponse
 */
export declare function isNostrResponse(response: any): response is NostrResponse;
/**
 * Type guard for NostrError
 */
export declare function isNostrError(error: any): error is NostrError;
