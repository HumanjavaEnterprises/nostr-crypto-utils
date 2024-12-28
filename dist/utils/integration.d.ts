import { NostrEvent, SignedNostrEvent, NostrFilter, NostrEventKind } from '../types/base';
import { NostrMessage, NostrMessageType } from '../types/messages';
/**
 * Format event for relay transmission
 */
export declare function formatEventForRelay(event: SignedNostrEvent): NostrMessage;
/**
 * Format subscription for relay transmission
 */
export declare function formatSubscriptionForRelay(subscription: {
    id: string;
    filters: NostrFilter[];
}): NostrMessage;
/**
 * Format close message for relay transmission
 */
export declare function formatCloseForRelay(subscriptionId: string): NostrMessage;
/**
 * Format auth message for relay transmission
 */
export declare function formatAuthForRelay(event: SignedNostrEvent): NostrMessage;
/**
 * Parse a message from a relay
 */
export declare function parseNostrMessage(message: any): {
    type: NostrMessageType;
    payload: any;
} | null;
/**
 * Create a metadata event
 */
export declare function createMetadataEvent(metadata: Record<string, string>): NostrEvent;
/**
 * Create a text note event
 */
export declare function createTextNoteEvent(content: string, replyTo?: string, mentions?: string[]): NostrEvent;
/**
 * Create a direct message event
 */
export declare function createDirectMessageEvent(recipientPubkey: string, content: string): NostrEvent;
/**
 * Create a channel message event
 */
export declare function createChannelMessageEvent(channelId: string, content: string, replyTo?: string): NostrEvent;
/**
 * Extract referenced event IDs from an event
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
export declare function createMockTextNote(content?: string): NostrEvent;
/**
 * Creates a mock metadata event for testing
 */
export declare function createMockMetadataEvent(metadata?: Record<string, string>): NostrEvent;
/**
 * Creates a mock direct message event for testing
 */
export declare function createMockDirectMessage(content?: string): NostrEvent;
/**
 * Creates a mock channel message event for testing
 */
export declare function createMockChannelMessage(content?: string): NostrEvent;
