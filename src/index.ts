/**
 * @module nostr-crypto-utils
 * @description Core cryptographic utilities for Nostr protocol
 */

// Core types
export type {
  NostrEvent,
  UnsignedNostrEvent,
  SignedNostrEvent,
  NostrFilter,
  NostrSubscription,
  PublicKey,
  KeyPair,
  NostrMessageTuple,
} from './types';

// Event kinds, message types, and NIP-46 types
export { NostrEventKind, NostrMessageType, Nip46Method } from './types';
export type {
  Nip46Request,
  Nip46Response,
  Nip46Session,
  Nip46SessionInfo,
  BunkerURI,
  BunkerValidationResult,
} from './types';

// Core crypto functions
export {
  generateKeyPair,
  getPublicKey,
  getPublicKeySync,
  validateKeyPair,
  createEvent,
  signEvent,
  finalizeEvent,
  verifySignature,
  encrypt,
  decrypt,
} from './crypto';

// Validation functions
export {
  validateEvent,
  validateEventId,
  validateEventSignature,
  validateSignedEvent,
  validateEventBase,
  validateFilter,
  validateSubscription,
  validateResponse,
} from './validation';

// Event functions
export {
  calculateEventId,
} from './event';

// NIP-04 encryption
export {
  computeSharedSecret,
  encryptMessage,
  decryptMessage,
} from './nips/nip-04';

// Re-export NIPs
export * as nip01 from './nips/nip-01';
export * as nip04 from './nips/nip-04';
export * as nip19 from './nips/nip-19';
export * as nip26 from './nips/nip-26';
export * as nip44 from './nips/nip-44';
export * as nip46 from './nips/nip-46';
export * as nip49 from './nips/nip-49';

// Utils
export {
  hexToBytes,
  bytesToHex,
  utf8ToBytes,
  bytesToUtf8,
} from './utils/encoding';
