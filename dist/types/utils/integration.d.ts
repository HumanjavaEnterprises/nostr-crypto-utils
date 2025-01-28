import { NostrEvent, NostrFilter, NostrEventKind, SignedNostrEvent, NostrMessage, UnsignedEvent } from '../types/base';
/**
 * Format event for relay transmission
 */
export declare function formatEventForRelay(event: SignedNostrEvent): [string, SignedNostrEvent];
/**
 * Format subscription for relay transmission
 */
export declare function formatSubscriptionForRelay(subscription: {
    id: string;
    filters: NostrFilter[];
}): [string, string, ...NostrFilter[]];
/**
 * Format close message for relay transmission
 */
export declare function formatCloseForRelay(subscriptionId: string): [string, string];
/**
 * Format auth message for relay transmission
 */
export declare function formatAuthForRelay(event: SignedNostrEvent): [string, SignedNostrEvent];
/**
 * Parse a message from a relay
 */
export declare function parseNostrMessage(message: string | unknown[]): NostrMessage;
/**
 * Create a metadata event
 */
export declare function createMetadataEvent(metadata: Record<string, string>): UnsignedEvent;
/**
 * Create a text note event
 */
export declare function createTextNoteEvent(content: string, replyTo?: string, mentions?: string[]): UnsignedEvent;
/**
 * Create a direct message event
 */
export declare function createDirectMessageEvent(recipientPubkey: string, content: string): UnsignedEvent;
/**
 * Create a channel message event
 */
export declare function createChannelMessageEvent(channelId: string, content: string, replyTo?: string): UnsignedEvent;
/**
 * Extract referenced events from tags
 */
export declare function extractReferencedEvents(event: NostrEvent): string[];
/**
 * Extract mentioned pubkeys from an event
 */
export declare function extractMentionedPubkeys(event: NostrEvent): string[];
/**
 * Create a filter for events of a specific kind
 */
export declare function createKindFilter(kind: NostrEventKind, limit?: number): NostrFilter;
/**
 * Create a filter for events by a specific author
 */
export declare function createAuthorFilter(pubkey: string, kinds?: NostrEventKind[], limit?: number): NostrFilter;
/**
 * Create a filter for replies to a specific event
 */
export declare function createReplyFilter(eventId: string, limit?: number): NostrFilter;
/**
 * Creates a mock text note event for testing
 */
export declare function createMockTextNote(content?: string): UnsignedEvent;
/**
 * Creates a mock metadata event for testing
 */
export declare function createMockMetadataEvent(metadata?: Record<string, string>): UnsignedEvent;
/**
 * Creates a mock direct message event for testing
 */
export declare function createMockDirectMessage(content?: string): UnsignedEvent;
/**
 * Creates a mock channel message event for testing
 */
export declare function createMockChannelMessage(content?: string): UnsignedEvent;
//# sourceMappingURL=integration.d.ts.map