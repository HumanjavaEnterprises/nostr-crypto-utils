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
} from './types/index.js';

// Event kinds, message types, and NIP-46 types
export { NostrEventKind, NostrMessageType, Nip46Method } from './types/index.js';
export type {
  Nip46Request,
  Nip46Response,
  Nip46Session,
  Nip46SessionInfo,
  BunkerURI,
  BunkerValidationResult,
  Nip46SignerHandlers,
  Nip46HandleOptions,
  Nip46HandleResult,
  Nip46UnwrapResult,
} from './types/index.js';

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
} from './crypto.js';

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
} from './validation/index.js';

// Event functions
export {
  calculateEventId,
} from './event/index.js';

// NIP-04 encryption
export {
  computeSharedSecret,
  encryptMessage,
  decryptMessage,
} from './nips/nip-04.js';

// Re-export NIPs
export * as nip01 from './nips/nip-01.js';
export * as nip04 from './nips/nip-04.js';
export * as nip19 from './nips/nip-19.js';
export * as nip26 from './nips/nip-26.js';
export * as nip44 from './nips/nip-44.js';
export * as nip46 from './nips/nip-46.js';
export * as nip49 from './nips/nip-49.js';

// Utils
export {
  hexToBytes,
  bytesToHex,
  utf8ToBytes,
  bytesToUtf8,
} from './utils/encoding.js';
