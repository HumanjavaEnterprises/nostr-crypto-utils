import { NostrEventKind } from '../types/base.js';
import { logger } from './logger.js';
/**
 * Format event for relay transmission
 */
export function formatEventForRelay(event) {
    return ['EVENT', event];
}
/**
 * Format subscription for relay transmission
 */
export function formatSubscriptionForRelay(subscription) {
    return ['REQ', subscription.id, ...subscription.filters];
}
/**
 * Format close message for relay transmission
 */
export function formatCloseForRelay(subscriptionId) {
    return ['CLOSE', subscriptionId];
}
/**
 * Format auth message for relay transmission
 */
export function formatAuthForRelay(event) {
    return ['AUTH', event];
}
/**
 * Parse a message from a relay
 */
export function parseNostrMessage(message) {
    try {
        // Handle array input
        if (Array.isArray(message)) {
            if (!message.length || typeof message[0] !== 'string') {
                throw new Error('Invalid relay message: first element not a string');
            }
            const [type, ...payload] = message;
            if (!['EVENT', 'NOTICE', 'OK', 'EOSE', 'REQ', 'CLOSE', 'AUTH'].includes(type)) {
                throw new Error(`Unknown message type: ${type}`);
            }
            return {
                type: type,
                payload: payload.length === 1 ? payload[0] : payload
            };
        }
        // Handle string input
        if (typeof message === 'string') {
            // Try parsing as JSON first
            try {
                const parsed = JSON.parse(message);
                if (!Array.isArray(parsed) || !parsed.length || typeof parsed[0] !== 'string') {
                    throw new Error('Invalid relay message: first element not a string');
                }
                const [type, ...payload] = parsed;
                if (!['EVENT', 'NOTICE', 'OK', 'EOSE', 'REQ', 'CLOSE', 'AUTH'].includes(type)) {
                    throw new Error(`Unknown message type: ${type}`);
                }
                return {
                    type: type,
                    payload: payload.length === 1 ? payload[0] : payload
                };
            }
            catch (jsonError) {
                // If JSON parsing fails, try comma-separated format
                if (message.includes(',')) {
                    const [type, ...payload] = message.split(',');
                    if (!type) {
                        throw new Error('Invalid relay message: empty command');
                    }
                    if (!['EVENT', 'NOTICE', 'OK', 'EOSE', 'REQ', 'CLOSE', 'AUTH'].includes(type)) {
                        throw new Error(`Unknown message type: ${type}`);
                    }
                    return {
                        type: type,
                        payload: payload.length === 1 ? payload[0] : payload
                    };
                }
                throw new Error('Invalid relay message: not an array');
            }
        }
        throw new Error('Invalid relay message: not a string or array');
    }
    catch (error) {
        logger.error('Failed to parse message:', error);
        throw error;
    }
}
/**
 * Create a metadata event
 */
export function createMetadataEvent(metadata) {
    return {
        kind: NostrEventKind.SET_METADATA,
        content: JSON.stringify(metadata),
        tags: [],
        created_at: Math.floor(Date.now() / 1000),
        pubkey: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef' // Placeholder hex pubkey
    };
}
/**
 * Create a text note event
 */
export function createTextNoteEvent(content, replyTo, mentions) {
    const tags = [];
    // Add reply tag if specified
    if (replyTo) {
        tags.push(['e', replyTo]);
    }
    // Add mention tags if specified
    if (mentions) {
        mentions.forEach(pubkey => {
            tags.push(['p', pubkey]);
        });
    }
    return {
        kind: NostrEventKind.TEXT_NOTE,
        content,
        tags,
        created_at: Math.floor(Date.now() / 1000),
        pubkey: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef' // Placeholder hex pubkey
    };
}
/**
 * Create a direct message event
 */
export function createDirectMessageEvent(recipientPubkey, content) {
    return {
        kind: NostrEventKind.ENCRYPTED_DIRECT_MESSAGE,
        content,
        tags: [['p', recipientPubkey]],
        created_at: Math.floor(Date.now() / 1000),
        pubkey: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef' // Placeholder hex pubkey
    };
}
/**
 * Create a channel message event
 */
export function createChannelMessageEvent(channelId, content, replyTo) {
    const tags = [['e', channelId, '', 'root']];
    if (replyTo) {
        tags.push(['e', replyTo, '', 'reply']);
    }
    return {
        kind: NostrEventKind.CHANNEL_MESSAGE,
        content,
        tags,
        created_at: Math.floor(Date.now() / 1000),
        pubkey: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef' // Placeholder hex pubkey
    };
}
/**
 * Extract referenced events from tags
 */
export function extractReferencedEvents(event) {
    if (typeof event !== 'object' || event === null || !Array.isArray(event.tags)) {
        return [];
    }
    const validEvent = event;
    const tags = validEvent.tags;
    return tags
        .filter(tag => Array.isArray(tag) && tag[0] === 'e' && typeof tag[1] === 'string')
        .map(tag => tag[1]);
}
/**
 * Extract mentioned pubkeys from an event
 */
export function extractMentionedPubkeys(event) {
    return event.tags
        .filter(tag => tag[0] === 'p')
        .map(tag => tag[1]);
}
/**
 * Create a filter for events of a specific kind
 */
export function createKindFilter(kind, limit) {
    return {
        kinds: [kind],
        limit: limit || 10
    };
}
/**
 * Create a filter for events by a specific author
 */
export function createAuthorFilter(pubkey, kinds, limit) {
    return {
        authors: [pubkey],
        kinds: kinds || [NostrEventKind.TEXT_NOTE],
        limit: limit || 10
    };
}
/**
 * Create a filter for replies to a specific event
 */
export function createReplyFilter(eventId, limit) {
    return {
        '#e': [eventId],
        kinds: [NostrEventKind.TEXT_NOTE, NostrEventKind.CHANNEL_MESSAGE],
        limit: limit || 10
    };
}
/**
 * Creates a mock text note event for testing
 */
export function createMockTextNote(content) {
    return {
        kind: NostrEventKind.TEXT_NOTE,
        content: content || 'Mock text note',
        tags: [],
        created_at: Math.floor(Date.now() / 1000),
        pubkey: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
    };
}
/**
 * Creates a mock metadata event for testing
 */
export function createMockMetadataEvent(metadata) {
    return {
        kind: NostrEventKind.SET_METADATA,
        content: JSON.stringify(metadata || { name: 'Mock User' }),
        tags: [],
        created_at: Math.floor(Date.now() / 1000),
        pubkey: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
    };
}
/**
 * Creates a mock direct message event for testing
 */
export function createMockDirectMessage(content) {
    return {
        kind: NostrEventKind.ENCRYPTED_DIRECT_MESSAGE,
        content: content || 'Mock DM',
        tags: [['p', '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef']],
        created_at: Math.floor(Date.now() / 1000),
        pubkey: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
    };
}
/**
 * Creates a mock channel message event for testing
 */
export function createMockChannelMessage(content) {
    return {
        kind: NostrEventKind.CHANNEL_MESSAGE,
        content: content || 'Mock channel message',
        tags: [['e', '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', '', 'root']],
        created_at: Math.floor(Date.now() / 1000),
        pubkey: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
    };
}
//# sourceMappingURL=integration.js.map