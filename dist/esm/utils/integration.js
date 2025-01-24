import { NostrEventKind, NostrMessageType } from '../types/base';
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
        let parsed;
        if (Array.isArray(message)) {
            parsed = message;
        }
        else if (typeof message === 'string') {
            // Try parsing as JSON first
            try {
                parsed = JSON.parse(message);
            }
            catch {
                // If message is a single word, it's invalid
                if (!message.includes(',')) {
                    throw new Error('Invalid relay message: not an array');
                }
                // If JSON parsing fails, try comma-separated format
                parsed = message.split(',');
            }
        }
        else {
            throw new Error('Invalid relay message: input must be string or array');
        }
        if (!Array.isArray(parsed)) {
            throw new Error('Invalid relay message: not an array');
        }
        const [type, ...payload] = parsed;
        if (typeof type !== 'string') {
            throw new Error('Invalid relay message: first element not a string');
        }
        if (!Object.values(NostrMessageType).includes(type)) {
            throw new Error(`Unknown message type: ${type}. Supported types are: ${Object.values(NostrMessageType).join(', ')}`);
        }
        const nostrMessage = {
            type: type,
            payload: [] // Initialize with empty array
        };
        switch (type) {
            case NostrMessageType.EVENT: {
                if (payload.length < 1) {
                    throw new Error('EVENT message missing event data');
                }
                const eventData = typeof payload[0] === 'string' && payload[0].startsWith('{')
                    ? JSON.parse(payload[0])
                    : payload[0];
                nostrMessage.event = eventData;
                nostrMessage.payload = eventData;
                break;
            }
            case NostrMessageType.NOTICE:
                if (payload.length < 1) {
                    throw new Error('NOTICE message missing message text');
                }
                nostrMessage.payload = String(payload[0]);
                break;
            case NostrMessageType.OK:
                if (payload.length < 1) {
                    throw new Error('OK message missing event ID');
                }
                // Convert "true" and "false" strings to actual booleans
                nostrMessage.payload = payload.map(item => {
                    if (typeof item === 'string') {
                        if (item === 'true')
                            return true;
                        if (item === 'false')
                            return false;
                        return item;
                    }
                    return String(item);
                });
                break;
            case NostrMessageType.REQ: {
                if (payload.length < 2) {
                    throw new Error('REQ message missing subscription ID or filters');
                }
                nostrMessage.subscriptionId = String(payload[0]);
                const filters = payload.slice(1).map(filter => typeof filter === 'string' && filter.startsWith('{')
                    ? JSON.parse(filter)
                    : filter);
                nostrMessage.filters = filters;
                nostrMessage.payload = [String(payload[0]), ...filters.map(f => JSON.stringify(f))];
                break;
            }
            case NostrMessageType.CLOSE:
                if (payload.length < 1) {
                    throw new Error('CLOSE message missing subscription ID');
                }
                nostrMessage.subscriptionId = String(payload[0]);
                nostrMessage.payload = String(payload[0]);
                break;
            case NostrMessageType.AUTH:
                if (payload.length < 1) {
                    throw new Error('AUTH message missing challenge');
                }
                nostrMessage.message = String(payload[0]);
                nostrMessage.payload = String(payload[0]);
                break;
            default:
                throw new Error(`Unknown message type: ${type}`);
        }
        return nostrMessage;
    }
    catch (error) {
        throw new Error(`Failed to parse Nostr message: ${error instanceof Error ? error.message : String(error)}`);
    }
}
/**
 * Create a metadata event
 */
export function createMetadataEvent(metadata) {
    return {
        kind: NostrEventKind.SET_METADATA,
        content: JSON.stringify(metadata),
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        pubkey: '' // Required by UnsignedEvent interface
    };
}
/**
 * Create a text note event
 */
export function createTextNoteEvent(content, replyTo, mentions) {
    const tags = [];
    if (replyTo) {
        tags.push(['e', replyTo]);
    }
    if (mentions?.length) {
        mentions.forEach(pubkey => {
            tags.push(['p', pubkey]);
        });
    }
    return {
        kind: NostrEventKind.TEXT_NOTE,
        content,
        created_at: Math.floor(Date.now() / 1000),
        tags,
        pubkey: '' // Required by UnsignedEvent interface
    };
}
/**
 * Create a direct message event
 */
export function createDirectMessageEvent(recipientPubkey, content) {
    return {
        kind: NostrEventKind.ENCRYPTED_DIRECT_MESSAGE,
        content,
        created_at: Math.floor(Date.now() / 1000),
        tags: [['p', recipientPubkey]],
        pubkey: '' // Required by UnsignedEvent interface
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
        created_at: Math.floor(Date.now() / 1000),
        tags,
        pubkey: '' // Required by UnsignedEvent interface
    };
}
/**
 * Extract referenced events from tags
 */
export function extractReferencedEvents(event) {
    return event.tags
        .filter(tag => tag[0] === 'e')
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
    const filter = { kinds: [kind] };
    if (limit) {
        filter.limit = limit;
    }
    return filter;
}
/**
 * Create a filter for events by a specific author
 */
export function createAuthorFilter(pubkey, kinds, limit) {
    const filter = { authors: [pubkey] };
    if (kinds?.length) {
        filter.kinds = kinds;
    }
    if (limit) {
        filter.limit = limit;
    }
    return filter;
}
/**
 * Create a filter for replies to a specific event
 */
export function createReplyFilter(eventId, limit) {
    const filter = {
        kinds: [NostrEventKind.TEXT_NOTE, NostrEventKind.CHANNEL_MESSAGE],
        '#e': [eventId]
    };
    if (limit) {
        filter.limit = limit;
    }
    return filter;
}
/**
 * Creates a mock text note event for testing
 */
export function createMockTextNote(content = 'Hello, Nostr!') {
    return {
        kind: NostrEventKind.TEXT_NOTE,
        content,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        pubkey: '' // Required by UnsignedEvent interface
    };
}
/**
 * Creates a mock metadata event for testing
 */
export function createMockMetadataEvent(metadata = {}) {
    return {
        kind: NostrEventKind.SET_METADATA,
        content: JSON.stringify(metadata),
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        pubkey: '' // Required by UnsignedEvent interface
    };
}
/**
 * Creates a mock direct message event for testing
 */
export function createMockDirectMessage(content = 'Hello!') {
    return {
        kind: NostrEventKind.ENCRYPTED_DIRECT_MESSAGE,
        content,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        pubkey: '' // Required by UnsignedEvent interface
    };
}
/**
 * Creates a mock channel message event for testing
 */
export function createMockChannelMessage(content = 'Hello, channel!') {
    return {
        kind: NostrEventKind.CHANNEL_MESSAGE,
        content,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        pubkey: '' // Required by UnsignedEvent interface
    };
}
//# sourceMappingURL=integration.js.map