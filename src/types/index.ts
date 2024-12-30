/**
 * @module types
 * @description Type definitions for Nostr protocol
 * @see https://github.com/nostr-protocol/nips
 */

/**
 * Re-export all types from base module
 * @packageDocumentation
 */
export * from './base';

/**
 * Re-export specific enums from base module
 * @packageDocumentation
 */
export { 
  /** Nostr event kind */
  NostrEventKind, 
  /** Nostr message type */
  NostrMessageType 
} from './base';

export * from './guards';

// Re-export NIP-19 types
export type {
  Nip19Data,
  Nip19DataType
} from '../nips/nip-19';
