import { NostrEvent, SignedNostrEvent } from './types/base';
import { NostrFilter, NostrSubscription, NostrResponse, NostrError, NostrMessageType } from './types/protocol';
import { validateEvent, validateSignedEvent, validateFilter } from './validation';
import { NOSTR_KIND, NOSTR_TAG } from './constants';

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
export function formatEventForRelay(event: SignedNostrEvent): [string, SignedNostrEvent] {
  return ['EVENT', event];
}

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
export function formatSubscriptionForRelay(subscription: NostrSubscription): [string, string, ...NostrFilter[]] {
  return ['REQ', subscription.id, ...subscription.filters];
}

/**
 * Formats a close request for relay transmission
 */
export function formatCloseForRelay(subscriptionId: string): [string, string] {
  return ['CLOSE', subscriptionId];
}

/**
 * Formats an auth request for relay transmission
 */
export function formatAuthForRelay(event: SignedNostrEvent): [string, SignedNostrEvent] {
  return ['AUTH', event];
}

/**
 * Parses a Nostr protocol message according to NIP-01
 * @param message - The message to parse, expected to be a JSON array
 * @returns NostrResponse containing the parsed message type and payload
 * @throws {Error} If the message format is invalid
 */
export function parseNostrMessage(message: unknown): NostrResponse {
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
 * Creates a metadata event
 */
export function createMetadataEvent(metadata: Record<string, string>): NostrEvent {
  return {
    kind: NOSTR_KIND.METADATA,
    content: JSON.stringify(metadata),
    created_at: Math.floor(Date.now() / 1000),
    tags: []
  };
}

/**
 * Creates a text note event
 */
export function createTextNoteEvent(content: string, replyTo?: string, mentions?: string[]): NostrEvent {
  const tags: string[][] = [];
  
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
 * Creates a direct message event (NIP-04)
 */
export function createDirectMessageEvent(recipientPubkey: string, content: string): NostrEvent {
  return {
    kind: NOSTR_KIND.ENCRYPTED_DIRECT_MESSAGE,
    content,
    created_at: Math.floor(Date.now() / 1000),
    tags: [[NOSTR_TAG.PUBKEY, recipientPubkey]]
  };
}

/**
 * Creates a channel message event
 */
export function createChannelMessageEvent(channelId: string, content: string, replyTo?: string): NostrEvent {
  const tags: string[][] = [
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
 * Extracts referenced event IDs from tags
 */
export function extractReferencedEvents(event: NostrEvent): string[] {
  return event.tags
    .filter(tag => tag[0] === NOSTR_TAG.EVENT)
    .map(tag => tag[1]);
}

/**
 * Extracts mentioned pubkeys from tags
 */
export function extractMentionedPubkeys(event: NostrEvent): string[] {
  return event.tags
    .filter(tag => tag[0] === NOSTR_TAG.PUBKEY)
    .map(tag => tag[1]);
}

/**
 * Creates a subscription filter for a specific event kind
 */
export function createKindFilter(kind: number, limit?: number): NostrFilter {
  return {
    kinds: [kind],
    limit
  };
}

/**
 * Creates a subscription filter for events by a specific author
 */
export function createAuthorFilter(pubkey: string, kinds?: number[], limit?: number): NostrFilter {
  return {
    authors: [pubkey],
    kinds,
    limit
  };
}

/**
 * Creates a subscription filter for replies to a specific event
 */
export function createReplyFilter(eventId: string, limit?: number): NostrFilter {
  return {
    '#e': [eventId],
    kinds: [NOSTR_KIND.TEXT_NOTE, NOSTR_KIND.CHANNEL_MESSAGE],
    limit
  };
}
