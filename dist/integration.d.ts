import { NostrEvent, SignedNostrEvent } from './types/base';
import { NostrFilter, NostrSubscription, NostrResponse } from './types/protocol';
/**
 * Formats an event for relay transmission
 * @param event - The signed Nostr event to format
 * @returns A tuple of ['EVENT', event] ready for relay transmission
 * @example
 * ```typescript
 * const event = await signEvent(myEvent, privateKey);
 * const formatted = formatEventForRelay(event);
 * // formatted = ['EVENT', event]
 * ```
 */
export declare function formatEventForRelay(event: SignedNostrEvent): [string, SignedNostrEvent];
/**
 * Formats a subscription request for relay transmission
 * @param subscription - The subscription request containing filters
 * @returns A tuple of ['REQ', subscriptionId, ...filters] ready for relay transmission
 * @example
 * ```typescript
 * const sub = { id: 'sub1', filters: [{ kinds: [1], limit: 10 }] };
 * const formatted = formatSubscriptionForRelay(sub);
 * // formatted = ['REQ', 'sub1', { kinds: [1], limit: 10 }]
 * ```
 */
export declare function formatSubscriptionForRelay(subscription: NostrSubscription): [string, string, ...NostrFilter[]];
/**
 * Formats a close request for relay transmission
 */
export declare function formatCloseForRelay(subscriptionId: string): [string, string];
/**
 * Formats an auth request for relay transmission
 */
export declare function formatAuthForRelay(event: SignedNostrEvent): [string, SignedNostrEvent];
/**
 * Parses a Nostr protocol message according to NIP-01
 * @param message - The message to parse, expected to be a JSON array
 * @returns NostrResponse containing the parsed message type and payload
 * @throws {Error} If the message format is invalid
 */
export declare function parseNostrMessage(message: unknown): NostrResponse;
/**
 * Creates a metadata event
 */
export declare function createMetadataEvent(metadata: Record<string, string>): NostrEvent;
/**
 * Creates a text note event
 */
export declare function createTextNoteEvent(content: string, replyTo?: string, mentions?: string[]): NostrEvent;
/**
 * Creates a direct message event (NIP-04)
 */
export declare function createDirectMessageEvent(recipientPubkey: string, content: string): NostrEvent;
/**
 * Creates a channel message event
 */
export declare function createChannelMessageEvent(channelId: string, content: string, replyTo?: string): NostrEvent;
/**
 * Extracts referenced event IDs from tags
 */
export declare function extractReferencedEvents(event: NostrEvent): string[];
/**
 * Extracts mentioned pubkeys from tags
 */
export declare function extractMentionedPubkeys(event: NostrEvent): string[];
/**
 * Creates a subscription filter for a specific event kind
 */
export declare function createKindFilter(kind: number, limit?: number): NostrFilter;
/**
 * Creates a subscription filter for events by a specific author
 */
export declare function createAuthorFilter(pubkey: string, kinds?: number[], limit?: number): NostrFilter;
/**
 * Creates a subscription filter for replies to a specific event
 */
export declare function createReplyFilter(eventId: string, limit?: number): NostrFilter;
