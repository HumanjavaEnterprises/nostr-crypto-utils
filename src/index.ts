/**
 * @module nostr-crypto-utils
 * @description A comprehensive TypeScript library providing cryptographic utilities and protocol-compliant message handling for Nostr applications
 * @packageDocumentation
 */

// Export all types
export * from './types';

// Export crypto functions
export {
  generateKeyPair,
  getPublicKey,
  validateKeyPair
} from './crypto/keys';

export {
  createEvent,
  signEvent,
  verifySignature
} from './crypto/events';

export {
  encrypt,
  decrypt
} from './crypto/encryption';

// Export validation functions
export {
  validateEvent,
  validateSignedEvent,
  validateFilter,
  validateSubscription,
  validateEventId,
  validateEventSignature
} from './validation';

// Export protocol functions
export {
  createEventMessage,
  parseNostrMessage
} from './protocol/transport';

// Export utility functions
export {
  formatEventForRelay,
  formatSubscriptionForRelay,
  formatCloseForRelay,
  formatAuthForRelay,
  extractReferencedEvents,
  extractMentionedPubkeys,
  createKindFilter,
  createAuthorFilter,
  createReplyFilter
} from './utils';

// Export encoding functions
export {
  bytesToHex,
  hexToBytes
} from './utils/encoding';
