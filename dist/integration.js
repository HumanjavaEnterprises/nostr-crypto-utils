import { NostrMessageType } from './types/protocol';
import { NOSTR_KIND, NOSTR_TAG } from './constants';
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
export function formatEventForRelay(event) {
    return ['EVENT', event];
}
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
export function formatSubscriptionForRelay(subscription) {
    return ['REQ', subscription.id, ...subscription.filters];
}
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
export function formatCloseForRelay(subscriptionId) {
    return ['CLOSE', subscriptionId];
}
/**
 * Formats an auth request for relay transmission according to NIP-42
 * @category Message Handling
 * @param {SignedNostrEvent} event - The signed authentication event
 * @returns {[string, SignedNostrEvent]} A tuple of ['AUTH', event] ready for relay transmission
 * @see {@link https://github.com/nostr-protocol/nips/blob/master/42.md}
 */
export function formatAuthForRelay(event) {
    return ['AUTH', event];
}
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
export function parseNostrMessage(message) {
    if (!Array.isArray(message)) {
        throw new Error('Invalid relay message: not an array');
    }
    const [type, ...payload] = message;
    if (typeof type !== 'string') {
        throw new Error('Invalid relay message: type must be a string');
    }
    switch (type) {
        case 'EVENT':
            if (payload.length !== 1 || typeof payload[0] !== 'object') {
                throw new Error('Invalid EVENT message format');
            }
            return { type: NostrMessageType.EVENT, payload: payload[0] };
        case 'NOTICE':
            if (payload.length !== 1 || typeof payload[0] !== 'string') {
                throw new Error('Invalid NOTICE message format');
            }
            return { type: NostrMessageType.NOTICE, payload: payload[0] };
        case 'OK':
            if (payload.length !== 3 ||
                typeof payload[0] !== 'string' ||
                typeof payload[1] !== 'boolean') {
                throw new Error('Invalid OK message format');
            }
            return { type: NostrMessageType.OK, payload };
        case 'EOSE':
            if (payload.length !== 1 || typeof payload[0] !== 'string') {
                throw new Error('Invalid EOSE message format');
            }
            return { type: NostrMessageType.EOSE, payload: payload[0] };
        case 'AUTH':
            if (payload.length !== 1 || typeof payload[0] !== 'string') {
                throw new Error('Invalid AUTH message format');
            }
            return { type: NostrMessageType.AUTH, payload: payload[0] };
        default:
            throw new Error(`Unknown message type: ${type}`);
    }
}
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
export function createMetadataEvent(metadata) {
    return {
        kind: NOSTR_KIND.METADATA,
        content: JSON.stringify(metadata),
        created_at: Math.floor(Date.now() / 1000),
        tags: []
    };
}
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
export function createTextNoteEvent(content, replyTo, mentions) {
    const tags = [];
    if (replyTo) {
        tags.push([NOSTR_TAG.EVENT, replyTo]);
    }
    if (mentions) {
        mentions.forEach(pubkey => {
            tags.push([NOSTR_TAG.PUBKEY, pubkey]);
        });
    }
    return {
        kind: NOSTR_KIND.TEXT_NOTE,
        content,
        created_at: Math.floor(Date.now() / 1000),
        tags
    };
}
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
export function createDirectMessageEvent(recipientPubkey, content) {
    return {
        kind: NOSTR_KIND.ENCRYPTED_DIRECT_MESSAGE,
        content,
        created_at: Math.floor(Date.now() / 1000),
        tags: [[NOSTR_TAG.PUBKEY, recipientPubkey]]
    };
}
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
export function createChannelMessageEvent(channelId, content, replyTo) {
    const tags = [
        [NOSTR_TAG.EVENT, channelId, '', 'root']
    ];
    if (replyTo) {
        tags.push([NOSTR_TAG.EVENT, replyTo, '', 'reply']);
    }
    return {
        kind: NOSTR_KIND.CHANNEL_MESSAGE,
        content,
        created_at: Math.floor(Date.now() / 1000),
        tags
    };
}
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
export function extractReferencedEvents(event) {
    return event.tags
        .filter(tag => tag[0] === NOSTR_TAG.EVENT)
        .map(tag => tag[1]);
}
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
export function extractMentionedPubkeys(event) {
    return event.tags
        .filter(tag => tag[0] === NOSTR_TAG.PUBKEY)
        .map(tag => tag[1]);
}
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
export function createKindFilter(kind, limit) {
    return {
        kinds: [kind],
        limit
    };
}
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
export function createAuthorFilter(pubkey, kinds, limit) {
    return {
        authors: [pubkey],
        kinds,
        limit
    };
}
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
export function createReplyFilter(eventId, limit) {
    return {
        '#e': [eventId],
        kinds: [NOSTR_KIND.TEXT_NOTE, NOSTR_KIND.CHANNEL_MESSAGE],
        limit
    };
}
