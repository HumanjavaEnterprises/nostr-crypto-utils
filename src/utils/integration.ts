import { NostrEvent, SignedNostrEvent, NostrFilter, NostrEventKind } from '../types/base';
import { NostrMessage, NostrMessageType } from '../types/messages';
import { createPublicKey } from '../crypto/keys';

/**
 * Format event for relay transmission
 */
export function formatEventForRelay(event: SignedNostrEvent): NostrMessage {
  return ['EVENT', event];
}

/**
 * Format subscription for relay transmission
 */
export function formatSubscriptionForRelay(subscription: { id: string; filters: NostrFilter[] }): NostrMessage {
  return ['REQ', subscription.id, ...subscription.filters];
}

/**
 * Format close message for relay transmission
 */
export function formatCloseForRelay(subscriptionId: string): NostrMessage {
  return ['CLOSE', subscriptionId];
}

/**
 * Format auth message for relay transmission
 */
export function formatAuthForRelay(event: SignedNostrEvent): NostrMessage {
  return ['AUTH', event];
}

/**
 * Parse a message from a relay
 */
export function parseNostrMessage(message: any): { type: NostrMessageType; payload: any } | null {
  // Validate message format
  if (!Array.isArray(message)) {
    throw new Error('Invalid relay message: not an array');
  }
  if (message.length === 0) {
    throw new Error('Invalid relay message: empty array');
  }
  if (typeof message[0] !== 'string') {
    throw new Error('Invalid relay message: first element not a string');
  }

  const messageType = message[0] as NostrMessageType;
  switch (messageType) {
    case 'EVENT':
      return { type: 'EVENT', payload: message[1] };
    case 'NOTICE':
      return { type: 'NOTICE', payload: message[1] };
    case 'OK':
      return { type: 'OK', payload: message.slice(1) };
    case 'EOSE':
      return { type: 'EOSE', payload: message[1] };
    case 'REQ':
      return { type: 'REQ', payload: { id: message[1], filters: message.slice(2) } };
    case 'CLOSE':
      return { type: 'CLOSE', payload: message[1] };
    case 'AUTH':
      return { type: 'AUTH', payload: message[1] };
    default:
      throw new Error('Unknown message type: ' + messageType);
  }
}

/**
 * Create a metadata event
 */
export function createMetadataEvent(metadata: Record<string, string>): NostrEvent {
  return {
    kind: NostrEventKind.SET_METADATA,
    content: JSON.stringify(metadata),
    tags: [],
    created_at: Math.floor(Date.now() / 1000),
    pubkey: createPublicKey('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef') // Placeholder, to be set by caller
  };
}

/**
 * Create a text note event
 */
export function createTextNoteEvent(content: string, replyTo?: string, mentions?: string[]): NostrEvent {
  const tags: string[][] = [];
  
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
    pubkey: createPublicKey('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef') // Placeholder, to be set by caller
  };
}

/**
 * Create a direct message event
 */
export function createDirectMessageEvent(recipientPubkey: string, content: string): NostrEvent {
  return {
    kind: NostrEventKind.ENCRYPTED_DIRECT_MESSAGE,
    content,
    tags: [['p', recipientPubkey]],
    created_at: Math.floor(Date.now() / 1000),
    pubkey: createPublicKey('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef') // Placeholder, to be set by caller
  };
}

/**
 * Create a channel message event
 */
export function createChannelMessageEvent(channelId: string, content: string, replyTo?: string): NostrEvent {
  const tags: string[][] = [
    ['e', channelId, '', 'root']
  ];

  if (replyTo) {
    tags.push(['e', replyTo, '', 'reply']);
  }

  return {
    kind: NostrEventKind.CHANNEL_MESSAGE,
    content,
    tags,
    created_at: Math.floor(Date.now() / 1000),
    pubkey: createPublicKey('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef') // Placeholder, to be set by caller
  };
}

/**
 * Extract referenced event IDs from an event
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
  return {
    kinds: [kind],
    limit: limit || 10
  };
}

/**
 * Create a filter for events by a specific author
 */
export function createAuthorFilter(pubkey: string, kinds?: NostrEventKind[], limit?: number): NostrFilter {
  return {
    authors: [pubkey],
    kinds: kinds || [NostrEventKind.TEXT_NOTE],
    limit: limit || 10
  };
}

/**
 * Create a filter for replies to a specific event
 */
export function createReplyFilter(eventId: string, limit?: number): NostrFilter {
  return {
    '#e': [eventId],
    kinds: [NostrEventKind.TEXT_NOTE, NostrEventKind.CHANNEL_MESSAGE],
    limit: limit || 10
  };
}

/**
 * Creates a mock text note event for testing
 */
export function createMockTextNote(content?: string): NostrEvent {
  return {
    kind: NostrEventKind.TEXT_NOTE,
    created_at: Math.floor(Date.now() / 1000),
    content: content || 'Test note',
    pubkey: createPublicKey('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'),
    tags: []
  };
}

/**
 * Creates a mock metadata event for testing
 */
export function createMockMetadataEvent(metadata?: Record<string, string>): NostrEvent {
  return {
    kind: NostrEventKind.SET_METADATA,
    created_at: Math.floor(Date.now() / 1000),
    content: JSON.stringify(metadata || { name: 'Test User' }),
    pubkey: createPublicKey('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'),
    tags: []
  };
}

/**
 * Creates a mock direct message event for testing
 */
export function createMockDirectMessage(content?: string): NostrEvent {
  return {
    kind: NostrEventKind.ENCRYPTED_DIRECT_MESSAGE,
    created_at: Math.floor(Date.now() / 1000),
    content: content || 'Test message',
    pubkey: createPublicKey('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'),
    tags: [['p', 'fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210']]
  };
}

/**
 * Creates a mock channel message event for testing
 */
export function createMockChannelMessage(content?: string): NostrEvent {
  return {
    kind: NostrEventKind.CHANNEL_MESSAGE,
    created_at: Math.floor(Date.now() / 1000),
    content: content || 'Test channel message',
    pubkey: createPublicKey('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'),
    tags: [['e', 'fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210']]
  };
}
