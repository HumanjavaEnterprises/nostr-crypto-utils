/**
 * @module types/guards
 * @description Type guard functions for Nostr types
 */
import { NostrEvent, SignedNostrEvent, NostrFilter, NostrSubscription, NostrResponse, NostrError } from './base';
/**
 * Type guard for NostrEvent
 */
export declare function isNostrEvent(event: unknown): event is NostrEvent;
/**
 * Type guard for SignedNostrEvent
 */
export declare function isSignedNostrEvent(event: unknown): event is SignedNostrEvent;
/**
 * Type guard for NostrFilter
 */
export declare function isNostrFilter(filter: unknown): filter is NostrFilter;
/**
 * Type guard for NostrSubscription
 */
export declare function isNostrSubscription(sub: unknown): sub is NostrSubscription;
/**
 * Type guard for NostrResponse
 */
export declare function isNostrResponse(response: unknown): response is NostrResponse;
/**
 * Type guard for NostrError
 */
export declare function isNostrError(error: unknown): error is NostrError;
//# sourceMappingURL=guards.d.ts.map