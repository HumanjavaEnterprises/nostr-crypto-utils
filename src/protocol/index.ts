/**
 * @module protocol
 * @description Core Nostr protocol implementation
 */

import { NostrEvent, SignedNostrEvent, NostrEventKind, NostrFilter, NostrSubscription, NostrResponse, NostrMessageType, PublicKey } from '../types/base';
import { NOSTR_TAG } from './constants';

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
 * @param message - Raw message from relay
 * @returns Parsed response
 */
export function parseMessage(message: string): NostrResponse {
  try {
    const [type, ...payload] = JSON.parse(message);
    
    switch (type) {
      case 'EVENT':
        return { success: true, messageType: NostrMessageType.EVENT, payload: payload[0] };
      case 'NOTICE':
        return { success: true, messageType: NostrMessageType.NOTICE, payload: payload[0] };
      case 'OK':
        return { success: true, messageType: NostrMessageType.OK, payload };
      case 'EOSE':
        return { success: true, messageType: NostrMessageType.EOSE, payload: payload[0] };
      case 'AUTH':
        return { success: true, messageType: NostrMessageType.AUTH, payload: payload[0] };
      default:
        return { success: false, messageType: NostrMessageType.ERROR, message: 'Unknown message type' };
    }
  } catch (error) {
    return { 
      success: false, 
      messageType: NostrMessageType.ERROR,
      message: 'Failed to parse message: ' + (error instanceof Error ? error.message : String(error))
    };
  }
}

/**
 * Creates a metadata event according to NIP-01
 * @category Event Creation
 * @param {Record<string, string>} metadata - User metadata (name, about, picture, etc.)
 * @param {string | PublicKey} pubkey - Public key of the user
 * @returns {NostrEvent} Created metadata event
 */
export function createMetadataEvent(metadata: Record<string, string>, pubkey: string | PublicKey): NostrEvent {
  return {
    kind: NostrEventKind.SET_METADATA,
    content: JSON.stringify(metadata),
    created_at: Math.floor(Date.now() / 1000),
    tags: [],
    pubkey: typeof pubkey === 'string' ? { hex: pubkey, bytes: new Uint8Array(0) } : pubkey
  };
}

/**
 * Creates a text note event according to NIP-01
 * @category Event Creation
 * @param {string} content - The text content of the note
 * @param {string | PublicKey} pubkey - Public key of the author
 * @param {string} [replyTo] - Optional ID of event being replied to
 * @param {string[]} [mentions] - Optional array of pubkeys to mention
 * @returns {NostrEvent} Created text note event
 */
export function createTextNoteEvent(
  content: string,
  pubkey: string | PublicKey,
  replyTo?: string,
  mentions?: string[]
): NostrEvent {
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
    kind: NostrEventKind.TEXT_NOTE,
    content,
    created_at: Math.floor(Date.now() / 1000),
    tags,
    pubkey: typeof pubkey === 'string' ? { hex: pubkey, bytes: new Uint8Array(0) } : pubkey
  };
}

/**
 * Creates a direct message event according to NIP-04
 * @category Event Creation
 * @param {string | PublicKey} recipientPubkey - Public key of message recipient
 * @param {string} content - Message content (will be encrypted)
 * @param {string | PublicKey} senderPubkey - Public key of the sender
 * @returns {NostrEvent} Created direct message event
 */
export function createDirectMessageEvent(
  recipientPubkey: string | PublicKey,
  content: string,
  senderPubkey: string | PublicKey
): NostrEvent {
  return {
    kind: NostrEventKind.ENCRYPTED_DIRECT_MESSAGE,
    content,
    created_at: Math.floor(Date.now() / 1000),
    tags: [['p', typeof recipientPubkey === 'string' ? recipientPubkey : recipientPubkey.hex]],
    pubkey: typeof senderPubkey === 'string' ? { hex: senderPubkey, bytes: new Uint8Array(0) } : senderPubkey
  };
}

/**
 * Creates a channel message event according to NIP-28
 * @category Event Creation
 * @param {string} channelId - ID of the channel
 * @param {string} content - Message content
 * @param {string | PublicKey} authorPubkey - Public key of the message author
 * @param {string} [replyTo] - Optional ID of message being replied to
 * @returns {NostrEvent} Created channel message event
 */
export function createChannelMessageEvent(
  channelId: string,
  content: string,
  authorPubkey: string | PublicKey,
  replyTo?: string
): NostrEvent {
  const tags = [['e', channelId, '', 'root']];
  if (replyTo) {
    tags.push(['e', replyTo, '', 'reply']);
  }
  return {
    kind: NostrEventKind.CHANNEL_MESSAGE,
    content,
    created_at: Math.floor(Date.now() / 1000),
    tags,
    pubkey: typeof authorPubkey === 'string' ? { hex: authorPubkey, bytes: new Uint8Array(0) } : authorPubkey
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
    .filter((tag: string[]) => tag[0] === NOSTR_TAG.EVENT)
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
    .filter((tag: string[]) => tag[0] === NOSTR_TAG.PUBKEY)
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
