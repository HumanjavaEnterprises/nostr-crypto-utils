/**
 * @module nostr-crypto-utils
 * A comprehensive TypeScript library providing cryptographic utilities and protocol-compliant message handling for Nostr applications
 * @packageDocumentation
 */

// Export core crypto functions
export {
  generateKeyPair,
  getPublicKey,
  validateKeyPair,
  signEvent,
  verifySignature,
  createEvent,
  encryptMessage,
  decryptMessage
} from './crypto';

// Export types
export type {
  NostrEvent,
  SignedNostrEvent,
  NostrFilter,
  NostrSubscription,
  KeyPair,
  PublicKeyDetails,
  NostrEventKind,
  ValidationResult,
  Nip19Data,
  Nip19DataType
} from './types';

// Export protocol functions
export {
  formatEventForRelay,
  formatSubscriptionForRelay,
  formatCloseForRelay,
  parseMessage
} from './protocol';

// Export validation functions
export {
  validateEvent,
  validateFilter,
  validateSubscription,
  validateSignedEvent
} from './utils/validation';

// Export event creation utilities
export {
  createTextNoteEvent,
  createMetadataEvent,
  createChannelMessageEvent,
  createDirectMessageEvent
} from './utils/events';

// Export NIP-19 functions
export {
  npubEncode,
  nsecEncode,
  noteEncode,
  nprofileEncode,
  neventEncode,
  naddrEncode,
  nrelayEncode,
  decode
} from './nips/nip-19';
