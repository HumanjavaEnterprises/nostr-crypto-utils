/**
 * @module nostr-crypto-utils
 * @description A comprehensive TypeScript library providing cryptographic utilities and protocol-compliant message handling for Nostr applications
 * @packageDocumentation
 */

import { schnorr } from '@noble/curves/secp256k1';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { sha256 } from '@noble/hashes/sha256';
import * as secp256k1 from '@noble/secp256k1';
import { generatePrivateKey as generateNostrPrivateKey } from 'nostr-tools';
import { webcrypto } from 'node:crypto';

// Configure crypto for Node.js and test environments
interface CryptoSubtle {
  generateKey(
    algorithm: string | Algorithm,
    extractable: boolean,
    keyUsages: KeyUsage[]
  ): Promise<CryptoKey | CryptoKeyPair>;
  digest(algorithm: AlgorithmIdentifier, data: ArrayBuffer): Promise<ArrayBuffer>;
  importKey(
    format: 'raw' | 'pkcs8' | 'spki' | 'jwk',
    keyData: ArrayBuffer | JsonWebKey,
    algorithm: AlgorithmIdentifier | Algorithm,
    extractable: boolean,
    keyUsages: KeyUsage[]
  ): Promise<CryptoKey>;
}

interface CustomCrypto {
  subtle: CryptoSubtle;
}

const customCrypto: CustomCrypto = typeof window !== 'undefined' && window.crypto 
  ? window.crypto as unknown as CustomCrypto
  : webcrypto as unknown as CustomCrypto;

// Export enums
export { NostrEventKind, NostrMessageType } from './types/base';

// Export types
export type {
  NostrEvent,
  SignedNostrEvent,
  NostrFilter,
  NostrSubscription,
  NostrResponse,
  NostrError,
  PublicKey,
  KeyPair,
  ValidationResult
} from './types/base';

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

// Export transport functions
export {
  parseNostrMessage,
  formatEventForRelay,
  formatSubscriptionForRelay,
  formatCloseForRelay
} from './transport';

// Export protocol functions
export {
  formatAuthForRelay,
  parseMessage,
  createFilter,
  createKindFilter,
  createAuthorFilter,
  createReplyFilter,
  createMetadataEvent,
  createTextNoteEvent,
  createDirectMessageEvent,
  createChannelMessageEvent,
  extractReferencedEvents,
  extractMentionedPubkeys
} from './protocol';

// Export protocol constants
export { NOSTR_KIND, NOSTR_TAG, NOSTR_MESSAGE_TYPE } from './protocol/constants';

// Export validation functions
export {
  validateEvent, 
  validateSignedEvent, 
  validateFilter, 
  validateSubscription, 
  validateEventId, 
  validateEventSignature
} from './validation';

// Export utilities
import { createLogger } from './utils/logger';
export const logger = createLogger();
