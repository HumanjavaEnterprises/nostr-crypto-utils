import { 
  NostrEvent, 
  NostrFilter, 
  NostrEventKind, 
  SignedNostrEvent,
  NostrMessageType,
  NostrMessage,
  UnsignedEvent
} from '../types/base';

/**
 * Format event for relay transmission
 */
export function formatEventForRelay(event: SignedNostrEvent): [string, SignedNostrEvent] {
  return ['EVENT', event];
}

/**
 * Format subscription for relay transmission
 */
export function formatSubscriptionForRelay(subscription: { id: string; filters: NostrFilter[] }): [string, string, ...NostrFilter[]] {
  return ['REQ', subscription.id, ...subscription.filters];
}

/**
 * Format close message for relay transmission
 */
export function formatCloseForRelay(subscriptionId: string): [string, string] {
  return ['CLOSE', subscriptionId];
}

/**
 * Format auth message for relay transmission
 */
export function formatAuthForRelay(event: SignedNostrEvent): [string, SignedNostrEvent] {
  return ['AUTH', event];
}

/**
 * Parse a message from a relay
 */
export function parseNostrMessage(message: string | unknown[]): NostrMessage {
  try {
    let parsed: unknown[];
    
    if (Array.isArray(message)) {
      parsed = message;
    } else if (typeof message === 'string') {
      // Try parsing as JSON first
      try {
        parsed = JSON.parse(message);
      } catch {
        // If message is a single word, it's invalid
        if (!message.includes(',')) {
          throw new Error('Invalid relay message: not an array');
        }
        // If JSON parsing fails, try comma-separated format
        parsed = message.split(',');
      }
    } else {
      throw new Error('Invalid relay message: input must be string or array');
    }

    if (!Array.isArray(parsed)) {
      throw new Error('Invalid relay message: not an array');
    }

    const [type, ...payload] = parsed;
    if (typeof type !== 'string') {
      throw new Error('Invalid relay message: first element not a string');
    }

    if (!Object.values(NostrMessageType).includes(type as NostrMessageType)) {
      throw new Error(`Unknown message type: ${type}. Supported types are: ${Object.values(NostrMessageType).join(', ')}`);
    }

    const nostrMessage: NostrMessage = {
      type: type as NostrMessageType,
      payload: [] as string[]  // Initialize with empty array
    };

    switch (type) {
      case NostrMessageType.EVENT: {
        if (payload.length < 1) {
          throw new Error('EVENT message missing event data');
        }
        const eventData = typeof payload[0] === 'string' && payload[0].startsWith('{')
          ? JSON.parse(payload[0]) as SignedNostrEvent
          : payload[0] as SignedNostrEvent;
        nostrMessage.event = eventData;
        nostrMessage.payload = eventData as unknown as string;
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
            if (item === 'true') return true;
            if (item === 'false') return false;
            return item;
          }
          return String(item);
        }) as (string | boolean)[];
        break;

      case NostrMessageType.REQ: {
        if (payload.length < 2) {
          throw new Error('REQ message missing subscription ID or filters');
        }
        nostrMessage.subscriptionId = String(payload[0]);
        const filters = payload.slice(1).map(filter =>
          typeof filter === 'string' && filter.startsWith('{')
            ? JSON.parse(filter)
            : filter
        ) as NostrFilter[];
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
  } catch (error: unknown) {
    throw new Error(`Failed to parse Nostr message: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Create a metadata event
 */
export function createMetadataEvent(metadata: Record<string, string>): UnsignedEvent {
  return {
    kind: NostrEventKind.SET_METADATA,
    content: JSON.stringify(metadata),
    created_at: Math.floor(Date.now() / 1000),
    tags: [],
    pubkey: ''  // Required by UnsignedEvent interface
  };
}

/**
 * Create a text note event
 */
export function createTextNoteEvent(content: string, replyTo?: string, mentions?: string[]): UnsignedEvent {
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
    pubkey: ''  // Required by UnsignedEvent interface
  };
}

/**
 * Create a direct message event
 */
export function createDirectMessageEvent(recipientPubkey: string, content: string): UnsignedEvent {
  return {
    kind: NostrEventKind.ENCRYPTED_DIRECT_MESSAGE,
    content,
    created_at: Math.floor(Date.now() / 1000),
    tags: [['p', recipientPubkey]],
    pubkey: ''  // Required by UnsignedEvent interface
  };
}

/**
 * Create a channel message event
 */
export function createChannelMessageEvent(channelId: string, content: string, replyTo?: string): UnsignedEvent {
  const tags = [['e', channelId, '', 'root']];
  if (replyTo) {
    tags.push(['e', replyTo, '', 'reply']);
  }

  return {
    kind: NostrEventKind.CHANNEL_MESSAGE,
    content,
    created_at: Math.floor(Date.now() / 1000),
    tags,
    pubkey: ''  // Required by UnsignedEvent interface
  };
}

/**
 * Extract referenced events from tags
 */
export function extractReferencedEvents(event: NostrEvent): string[] {
  return event.tags
    .filter(tag => tag[0] === 'e')
    .map(tag => tag[1]);
}

/**
 * Extract mentioned pubkeys from an event
 */
export function extractMentionedPubkeys(event: NostrEvent): string[] {
  return event.tags
    .filter(tag => tag[0] === 'p')
    .map(tag => tag[1]);
}

/**
 * Create a filter for events of a specific kind
 */
export function createKindFilter(kind: NostrEventKind, limit?: number): NostrFilter {
  const filter: NostrFilter = { kinds: [kind] };
  if (limit) {
    filter.limit = limit;
  }
  return filter;
}

/**
 * Create a filter for events by a specific author
 */
export function createAuthorFilter(pubkey: string, kinds?: NostrEventKind[], limit?: number): NostrFilter {
  const filter: NostrFilter = { authors: [pubkey] };
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
export function createReplyFilter(eventId: string, limit?: number): NostrFilter {
  const filter: NostrFilter = {
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
export function createMockTextNote(content = 'Hello, Nostr!'): UnsignedEvent {
  return {
    kind: NostrEventKind.TEXT_NOTE,
    content,
    created_at: Math.floor(Date.now() / 1000),
    tags: [],
    pubkey: ''  // Required by UnsignedEvent interface
  };
}

/**
 * Creates a mock metadata event for testing
 */
export function createMockMetadataEvent(metadata: Record<string, string> = {}): UnsignedEvent {
  return {
    kind: NostrEventKind.SET_METADATA,
    content: JSON.stringify(metadata),
    created_at: Math.floor(Date.now() / 1000),
    tags: [],
    pubkey: ''  // Required by UnsignedEvent interface
  };
}

/**
 * Creates a mock direct message event for testing
 */
export function createMockDirectMessage(content = 'Hello!'): UnsignedEvent {
  return {
    kind: NostrEventKind.ENCRYPTED_DIRECT_MESSAGE,
    content,
    created_at: Math.floor(Date.now() / 1000),
    tags: [],
    pubkey: ''  // Required by UnsignedEvent interface
  };
}

/**
 * Creates a mock channel message event for testing
 */
export function createMockChannelMessage(content = 'Hello, channel!'): UnsignedEvent {
  return {
    kind: NostrEventKind.CHANNEL_MESSAGE,
    content,
    created_at: Math.floor(Date.now() / 1000),
    tags: [],
    pubkey: ''  // Required by UnsignedEvent interface
  };
}
