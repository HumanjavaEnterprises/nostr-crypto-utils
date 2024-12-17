import { NostrEvent, SignedNostrEvent } from './types/base';
import type { NostrFilter, NostrSubscription, NostrResponse } from './types/protocol';
/**
 * Formats an event for relay transmission according to NIP-01
 * @category Message Handling
 * @param {SignedNostrEvent} event - The signed Nostr event to format
 * @returns {[string, SignedNostrEvent]} A tuple of ['EVENT', event] ready for relay transmission
 * @example
 * ```typescript
 * const event = await signEvent(myEvent, privateKey);
 * const formatted = formatEventForRelay(event);
 * // formatted = ['EVENT', event]
 * ```
 * @see {@link https://github.com/nostr-protocol/nips/blob/master/01.md#from-client-to-relay-sending-events-and-creating-subscriptions}
 */
export declare function formatEventForRelay(event: SignedNostrEvent): [string, SignedNostrEvent];
/**
 * Formats a subscription request for relay transmission according to NIP-01
 * @category Message Handling
 * @param {NostrSubscription} subscription - The subscription request containing filters
 * @returns {[string, string, ...NostrFilter[]]} A tuple of ['REQ', subscriptionId, ...filters] ready for relay transmission
 * @example
 * ```typescript
 * const sub = { id: 'sub1', filters: [{ kinds: [1], limit: 10 }] };
 * const formatted = formatSubscriptionForRelay(sub);
 * // formatted = ['REQ', 'sub1', { kinds: [1], limit: 10 }]
 * ```
 * @see {@link https://github.com/nostr-protocol/nips/blob/master/01.md#from-client-to-relay-creating-subscriptions}
 */
export declare function formatSubscriptionForRelay(subscription: NostrSubscription): [string, string, ...NostrFilter[]];
/**
 * Formats a close request for relay transmission according to NIP-01
 * @category Message Handling
 * @param {string} subscriptionId - The ID of the subscription to close
 * @returns {[string, string]} A tuple of ['CLOSE', subscriptionId] ready for relay transmission
 * @example
 * ```typescript
 * const formatted = formatCloseForRelay('sub1');
 * // formatted = ['CLOSE', 'sub1']
 * ```
 */
export declare function formatCloseForRelay(subscriptionId: string): [string, string];
/**
 * Formats an auth request for relay transmission according to NIP-42
 * @category Message Handling
 * @param {SignedNostrEvent} event - The signed authentication event
 * @returns {[string, SignedNostrEvent]} A tuple of ['AUTH', event] ready for relay transmission
 * @see {@link https://github.com/nostr-protocol/nips/blob/master/42.md}
 */
export declare function formatAuthForRelay(event: SignedNostrEvent): [string, SignedNostrEvent];
/**
 * Parses a Nostr protocol message according to NIP-01
 * @category Message Handling
 * @param {unknown} message - The message to parse
 * @returns {NostrResponse | null} Parsed message or null if invalid
 * @throws {Error} If message format is invalid
 * @example
 * ```typescript
 * const message = ['EVENT', signedEvent];
 * const parsed = parseNostrMessage(message);
 * if (parsed && parsed.type === NostrMessageType.EVENT) {
 *   console.log('Received event:', parsed.payload);
 * }
 * ```
 */
export declare function parseNostrMessage(message: unknown): NostrResponse | null;
/**
 * Creates a metadata event according to NIP-01
 * @category Event Creation
 * @param {Record<string, string>} metadata - User metadata (name, about, picture, etc.)
 * @returns {NostrEvent} Created metadata event
 * @example
 * ```typescript
 * const event = createMetadataEvent({
 *   name: 'Alice',
 *   about: 'Nostr enthusiast',
 *   picture: 'https://example.com/avatar.jpg'
 * });
 * ```
 * @see {@link https://github.com/nostr-protocol/nips/blob/master/01.md#basic-event-kinds}
 */
export declare function createMetadataEvent(metadata: Record<string, string>): NostrEvent;
/**
 * Creates a text note event according to NIP-01
 * @category Event Creation
 * @param {string} content - The text content of the note
 * @param {string} [replyTo] - Optional ID of event being replied to
 * @param {string[]} [mentions] - Optional array of pubkeys to mention
 * @returns {NostrEvent} Created text note event
 * @example
 * ```typescript
 * // Simple text note
 * const note = createTextNoteEvent('Hello Nostr!');
 *
 * // Reply with mentions
 * const reply = createTextNoteEvent(
 *   'Great post!',
 *   originalEventId,
 *   [authorPubkey]
 * );
 * ```
 */
export declare function createTextNoteEvent(content: string, replyTo?: string, mentions?: string[]): NostrEvent;
/**
 * Creates a direct message event according to NIP-04
 * @category Event Creation
 * @param {string} recipientPubkey - Public key of message recipient
 * @param {string} content - Message content (will be encrypted)
 * @returns {NostrEvent} Created direct message event
 * @example
 * ```typescript
 * const dmEvent = createDirectMessageEvent(
 *   recipientPubkey,
 *   'Secret message'
 * );
 * ```
 * @see {@link https://github.com/nostr-protocol/nips/blob/master/04.md}
 */
export declare function createDirectMessageEvent(recipientPubkey: string, content: string): NostrEvent;
/**
 * Creates a channel message event according to NIP-28
 * @category Event Creation
 * @param {string} channelId - ID of the channel
 * @param {string} content - Message content
 * @param {string} [replyTo] - Optional ID of message being replied to
 * @returns {NostrEvent} Created channel message event
 * @example
 * ```typescript
 * // New channel message
 * const msg = createChannelMessageEvent(
 *   channelId,
 *   'Hello channel!'
 * );
 *
 * // Reply to message
 * const reply = createChannelMessageEvent(
 *   channelId,
 *   'Good point!',
 *   originalMessageId
 * );
 * ```
 * @see {@link https://github.com/nostr-protocol/nips/blob/master/28.md}
 */
export declare function createChannelMessageEvent(channelId: string, content: string, replyTo?: string): NostrEvent;
/**
 * Extracts referenced event IDs from an event's tags
 * @category Event Operations
 * @param {NostrEvent} event - Event to extract references from
 * @returns {string[]} Array of referenced event IDs
 * @example
 * ```typescript
 * const refs = extractReferencedEvents(event);
 * console.log('Referenced events:', refs);
 * ```
 */
export declare function extractReferencedEvents(event: NostrEvent): string[];
/**
 * Extracts mentioned pubkeys from an event's tags
 * @category Event Operations
 * @param {NostrEvent} event - Event to extract mentions from
 * @returns {string[]} Array of mentioned pubkeys
 * @example
 * ```typescript
 * const mentions = extractMentionedPubkeys(event);
 * console.log('Mentioned users:', mentions);
 * ```
 */
export declare function extractMentionedPubkeys(event: NostrEvent): string[];
/**
 * Creates a subscription filter for a specific event kind
 * @category Filter Creation
 * @param {number} kind - Event kind to filter for
 * @param {number} [limit] - Optional maximum number of events to receive
 * @returns {NostrFilter} Created filter
 * @example
 * ```typescript
 * // Get last 10 text notes
 * const filter = createKindFilter(1, 10);
 * ```
 */
export declare function createKindFilter(kind: number, limit?: number): NostrFilter;
/**
 * Creates a subscription filter for events by a specific author
 * @category Filter Creation
 * @param {string} pubkey - Author's public key
 * @param {number[]} [kinds] - Optional array of event kinds to filter
 * @param {number} [limit] - Optional maximum number of events to receive
 * @returns {NostrFilter} Created filter
 * @example
 * ```typescript
 * // Get user's last 20 text notes
 * const filter = createAuthorFilter(pubkey, [1], 20);
 * ```
 */
export declare function createAuthorFilter(pubkey: string, kinds?: number[], limit?: number): NostrFilter;
/**
 * Creates a subscription filter for replies to a specific event
 * @category Filter Creation
 * @param {string} eventId - ID of the event to find replies to
 * @param {number} [limit] - Optional maximum number of replies to receive
 * @returns {NostrFilter} Created filter
 * @example
 * ```typescript
 * // Get last 50 replies to an event
 * const filter = createReplyFilter(eventId, 50);
 * ```
 */
export declare function createReplyFilter(eventId: string, limit?: number): NostrFilter;
