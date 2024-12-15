import { NostrEvent, SignedNostrEvent } from './base';
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
export declare function isNostrFilter(obj: unknown): obj is NostrFilter;
/**
 * Type guard for NostrSubscription
 */
export declare function isNostrSubscription(obj: unknown): obj is NostrSubscription;
/**
 * Type guard for NostrResponse
 */
export declare function isNostrResponse(obj: unknown): obj is NostrResponse;
/**
 * Type guard for NostrError
 */
export declare function isNostrError(obj: unknown): obj is NostrError;
