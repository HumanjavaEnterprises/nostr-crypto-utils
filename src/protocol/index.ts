/**
 * @module protocol
 * @description Core Nostr protocol implementation
 */

import { 
  NostrEvent, 
  NostrFilter, 
  NostrEventKind, 
  SignedNostrEvent,
  NostrMessageType,
  UnsignedEvent,
  PublicKey,
  NostrResponse,
  NostrSubscription
} from '../types/base';

/**
 * Formats an event for relay transmission according to NIP-01
 * @category Message Handling
 * @param {SignedNostrEvent} event - The signed Nostr event to format
 * @returns {[string, SignedNostrEvent]} A tuple of ['EVENT', event] ready for relay transmission
 */
export function formatEventForRelay(event: SignedNostrEvent): [string, SignedNostrEvent] {
  return ['EVENT', event];
}

/**
 * Formats a subscription request for relay transmission according to NIP-01
 * @category Message Handling
 * @param {NostrSubscription} subscription - The subscription request containing filters
 * @returns {[string, string, ...NostrFilter[]]} A tuple of ['REQ', subscriptionId, ...filters] ready for relay transmission
 */
export function formatSubscriptionForRelay(subscription: NostrSubscription): [string, string, ...NostrFilter[]] {
  return ['REQ', subscription.id, ...subscription.filters];
}

/**
 * Formats a close request for relay transmission according to NIP-01
 * @category Message Handling
 * @param {string} subscriptionId - The ID of the subscription to close
 * @returns {[string, string]} A tuple of ['CLOSE', subscriptionId] ready for relay transmission
 */
export function formatCloseForRelay(subscriptionId: string): [string, string] {
  return ['CLOSE', subscriptionId];
}

/**
 * Formats an auth request for relay transmission according to NIP-42
 * @category Message Handling
 * @param {SignedNostrEvent} event - The signed authentication event
 * @returns {[string, SignedNostrEvent]} A tuple of ['AUTH', event] ready for relay transmission
 */
export function formatAuthForRelay(event: SignedNostrEvent): [string, SignedNostrEvent] {
  return ['AUTH', event];
}

/**
 * Parses a Nostr message from a relay
 * @category Message Handling
 * @param {string} message - The message to parse
 * @returns {NostrResponse} Parsed message
 */
export function parseMessage(message: string): NostrResponse {
  try {
    const parsed = JSON.parse(message);
    if (!Array.isArray(parsed) || parsed.length < 2) {
      throw new Error('Invalid message format');
    }

    const [type, ...payload] = parsed;

    switch (type) {
      case 'EVENT':
        return {
          type: NostrMessageType.EVENT,
          event: payload[0]
        };

      case 'REQ':
        return {
          type: NostrMessageType.REQ,
          subscriptionId: payload[0],
          filters: payload.slice(1)
        };

      case 'CLOSE':
        return {
          type: NostrMessageType.CLOSE,
          subscriptionId: payload[0]
        };

      case 'OK':
        return {
          type: NostrMessageType.OK,
          eventId: payload[0],
          accepted: payload[1],
          message: payload[2]
        };

      case 'EOSE':
        return {
          type: NostrMessageType.EOSE,
          subscriptionId: payload[0]
        };

      default:
        throw new Error(`Unknown message type: ${type}`);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to parse message: ${errorMessage}`);
  }
}

/**
 * Creates a metadata event according to NIP-01
 * @category Event Creation
 * @param {Record<string, string>} metadata - User metadata (name, about, picture, etc.)
 * @param {string | PublicKey} pubkey - Public key of the user
 * @returns {UnsignedEvent} Created metadata event
 */
export function createMetadataEvent(metadata: Record<string, string>, pubkey: string | PublicKey): UnsignedEvent {
  const pubkeyValue = typeof pubkey === 'string' ? pubkey : pubkey.hex;
  return {
    kind: NostrEventKind.SET_METADATA,
    content: JSON.stringify(metadata),
    created_at: Math.floor(Date.now() / 1000),
    tags: [],
    pubkey: pubkeyValue
  };
}

/**
 * Creates a text note event according to NIP-01
 * @category Event Creation
 * @param {string} content - The text content of the note
 * @param {string | PublicKey} pubkey - Public key of the author
 * @param {string} [replyTo] - Optional ID of event being replied to
 * @param {string[]} [mentions] - Optional array of pubkeys to mention
 * @returns {UnsignedEvent} Created text note event
 */
export function createTextNoteEvent(
  content: string,
  pubkey: string | PublicKey,
  replyTo?: string,
  mentions?: string[]
): UnsignedEvent {
  const pubkeyValue = typeof pubkey === 'string' ? pubkey : pubkey.hex;
  const tags: string[][] = [];
  
  if (replyTo) {
    tags.push(['e', replyTo]);
  }
  
  if (mentions) {
    mentions.forEach(pubkey => {
      tags.push(['p', pubkey]);
    });
  }

  return {
    kind: NostrEventKind.TEXT_NOTE,
    content,
    created_at: Math.floor(Date.now() / 1000),
    tags,
    pubkey: pubkeyValue
  };
}

/**
 * Creates a direct message event according to NIP-04
 * @category Event Creation
 * @param {string | PublicKey} recipientPubkey - Public key of message recipient
 * @param {string} content - Message content (will be encrypted)
 * @param {string | PublicKey} senderPubkey - Public key of the sender
 * @returns {UnsignedEvent} Created direct message event
 */
export function createDirectMessageEvent(
  recipientPubkey: string | PublicKey,
  content: string,
  senderPubkey: string | PublicKey
): UnsignedEvent {
  const recipientKey = typeof recipientPubkey === 'string' ? recipientPubkey : recipientPubkey.hex;
  const senderKey = typeof senderPubkey === 'string' ? senderPubkey : senderPubkey.hex;
  
  return {
    kind: NostrEventKind.ENCRYPTED_DIRECT_MESSAGE,
    content,
    created_at: Math.floor(Date.now() / 1000),
    tags: [['p', recipientKey]],
    pubkey: senderKey
  };
}

/**
 * Creates a channel message event according to NIP-28
 * @category Event Creation
 * @param {string} channelId - ID of the channel
 * @param {string} content - Message content
 * @param {string | PublicKey} authorPubkey - Public key of the message author
 * @param {string} [replyTo] - Optional ID of message being replied to
 * @returns {UnsignedEvent} Created channel message event
 */
export function createChannelMessageEvent(
  channelId: string,
  content: string,
  authorPubkey: string | PublicKey,
  replyTo?: string
): UnsignedEvent {
  const pubkeyValue = typeof authorPubkey === 'string' ? authorPubkey : authorPubkey.hex;
  const tags = [['e', channelId, '', 'root']];
  if (replyTo) {
    tags.push(['e', replyTo, '', 'reply']);
  }
  return {
    kind: NostrEventKind.CHANNEL_MESSAGE,
    content,
    created_at: Math.floor(Date.now() / 1000),
    tags,
    pubkey: pubkeyValue
  };
}

/**
 * Extracts referenced event IDs from an event's tags
 * @category Event Operations
 * @param {NostrEvent} event - Event to extract references from
 * @returns {string[]} Array of referenced event IDs
 */
export function extractReferencedEvents(event: NostrEvent): string[] {
  return event.tags
    .filter((tag: string[]) => tag[0] === 'e')
    .map((tag: string[]) => tag[1]);
}

/**
 * Extracts mentioned pubkeys from an event's tags
 * @category Event Operations
 * @param {NostrEvent} event - Event to extract mentions from
 * @returns {string[]} Array of mentioned pubkeys
 */
export function extractMentionedPubkeys(event: NostrEvent): string[] {
  return event.tags
    .filter((tag: string[]) => tag[0] === 'p')
    .map((tag: string[]) => tag[1]);
}

/**
 * Creates a subscription filter for a specific event kind
 * @category Filter Creation
 * @param {number} kind - Event kind to filter for
 * @param {number} [limit] - Optional maximum number of events to receive
 * @returns {NostrFilter} Created filter
 */
export function createKindFilter(kind: number, limit?: number): NostrFilter {
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
 * @category Filter Creation
 * @param {string} eventId - ID of the event to find replies to
 * @param {number} [limit] - Optional maximum number of replies to receive
 * @returns {NostrFilter} Created filter
 */
export function createReplyFilter(eventId: string, limit?: number): NostrFilter {
  return {
    '#e': [eventId],
    kinds: [1, 42],
    limit
  };
}

/**
 * Creates a subscription filter for a specific author
 * @category Filter Creation
 * @param {string} pubkey - Author's public key
 * @returns {NostrFilter} Created filter
 */
export function createFilter(pubkey: string): NostrFilter {
  return {
    authors: [pubkey],
    kinds: [
      NostrEventKind.TEXT_NOTE,
      NostrEventKind.CHANNEL_MESSAGE
    ]
  };
}
