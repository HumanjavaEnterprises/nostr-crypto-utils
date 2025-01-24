/**
 * @module protocol
 * @description Core Nostr protocol implementation
 */
import { NostrEvent, NostrFilter, SignedNostrEvent, UnsignedEvent, PublicKey, NostrResponse, NostrSubscription } from '../types/base';
/**
 * Formats an event for relay transmission according to NIP-01
 * @category Message Handling
 * @param {SignedNostrEvent} event - The signed Nostr event to format
 * @returns {[string, SignedNostrEvent]} A tuple of ['EVENT', event] ready for relay transmission
 */
export declare function formatEventForRelay(event: SignedNostrEvent): [string, SignedNostrEvent];
/**
 * Formats a subscription request for relay transmission according to NIP-01
 * @category Message Handling
 * @param {NostrSubscription} subscription - The subscription request containing filters
 * @returns {[string, string, ...NostrFilter[]]} A tuple of ['REQ', subscriptionId, ...filters] ready for relay transmission
 */
export declare function formatSubscriptionForRelay(subscription: NostrSubscription): [string, string, ...NostrFilter[]];
/**
 * Formats a close request for relay transmission according to NIP-01
 * @category Message Handling
 * @param {string} subscriptionId - The ID of the subscription to close
 * @returns {[string, string]} A tuple of ['CLOSE', subscriptionId] ready for relay transmission
 */
export declare function formatCloseForRelay(subscriptionId: string): [string, string];
/**
 * Formats an auth request for relay transmission according to NIP-42
 * @category Message Handling
 * @param {SignedNostrEvent} event - The signed authentication event
 * @returns {[string, SignedNostrEvent]} A tuple of ['AUTH', event] ready for relay transmission
 */
export declare function formatAuthForRelay(event: SignedNostrEvent): [string, SignedNostrEvent];
/**
 * Parses a Nostr message from a relay
 * @category Message Handling
 * @param {string} message - The message to parse
 * @returns {NostrResponse} Parsed message
 */
export declare function parseMessage(message: string): NostrResponse;
/**
 * Creates a metadata event according to NIP-01
 * @category Event Creation
 * @param {Record<string, string>} metadata - User metadata (name, about, picture, etc.)
 * @param {string | PublicKey} pubkey - Public key of the user
 * @returns {UnsignedEvent} Created metadata event
 */
export declare function createMetadataEvent(metadata: Record<string, string>, pubkey: string | PublicKey): UnsignedEvent;
/**
 * Creates a text note event according to NIP-01
 * @category Event Creation
 * @param {string} content - The text content of the note
 * @param {string | PublicKey} pubkey - Public key of the author
 * @param {string} [replyTo] - Optional ID of event being replied to
 * @param {string[]} [mentions] - Optional array of pubkeys to mention
 * @returns {UnsignedEvent} Created text note event
 */
export declare function createTextNoteEvent(content: string, pubkey: string | PublicKey, replyTo?: string, mentions?: string[]): UnsignedEvent;
/**
 * Creates a direct message event according to NIP-04
 * @category Event Creation
 * @param {string | PublicKey} recipientPubkey - Public key of message recipient
 * @param {string} content - Message content (will be encrypted)
 * @param {string | PublicKey} senderPubkey - Public key of the sender
 * @returns {UnsignedEvent} Created direct message event
 */
export declare function createDirectMessageEvent(recipientPubkey: string | PublicKey, content: string, senderPubkey: string | PublicKey): UnsignedEvent;
/**
 * Creates a channel message event according to NIP-28
 * @category Event Creation
 * @param {string} channelId - ID of the channel
 * @param {string} content - Message content
 * @param {string | PublicKey} authorPubkey - Public key of the message author
 * @param {string} [replyTo] - Optional ID of message being replied to
 * @returns {UnsignedEvent} Created channel message event
 */
export declare function createChannelMessageEvent(channelId: string, content: string, authorPubkey: string | PublicKey, replyTo?: string): UnsignedEvent;
/**
 * Extracts referenced event IDs from an event's tags
 * @category Event Operations
 * @param {NostrEvent} event - Event to extract references from
 * @returns {string[]} Array of referenced event IDs
 */
export declare function extractReferencedEvents(event: NostrEvent): string[];
/**
 * Extracts mentioned pubkeys from an event's tags
 * @category Event Operations
 * @param {NostrEvent} event - Event to extract mentions from
 * @returns {string[]} Array of mentioned pubkeys
 */
export declare function extractMentionedPubkeys(event: NostrEvent): string[];
/**
 * Creates a subscription filter for a specific event kind
 * @category Filter Creation
 * @param {number} kind - Event kind to filter for
 * @param {number} [limit] - Optional maximum number of events to receive
 * @returns {NostrFilter} Created filter
 */
export declare function createKindFilter(kind: number, limit?: number): NostrFilter;
/**
 * Creates a subscription filter for events by a specific author
 * @category Filter Creation
 * @param {string} pubkey - Author's public key
 * @param {number[]} [kinds] - Optional array of event kinds to filter
 * @param {number} [limit] - Optional maximum number of events to receive
 * @returns {NostrFilter} Created filter
 */
export declare function createAuthorFilter(pubkey: string, kinds?: number[], limit?: number): NostrFilter;
/**
 * Creates a subscription filter for replies to a specific event
 * @category Filter Creation
 * @param {string} eventId - ID of the event to find replies to
 * @param {number} [limit] - Optional maximum number of replies to receive
 * @returns {NostrFilter} Created filter
 */
export declare function createReplyFilter(eventId: string, limit?: number): NostrFilter;
/**
 * Creates a subscription filter for a specific author
 * @category Filter Creation
 * @param {string} pubkey - Author's public key
 * @returns {NostrFilter} Created filter
 */
export declare function createFilter(pubkey: string): NostrFilter;
//# sourceMappingURL=index.d.ts.map