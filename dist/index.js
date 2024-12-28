/**
 * @module nostr-crypto-utils
 * @description A comprehensive TypeScript library providing cryptographic utilities and protocol-compliant message handling for Nostr applications
 * @packageDocumentation
 */
import { webcrypto } from 'node:crypto';
const customCrypto = typeof window !== 'undefined' && window.crypto
    ? window.crypto
    : webcrypto;
// Export enums
export { NostrEventKind, NostrMessageType } from './types/base';
// Export crypto functions
export { generateKeyPair, getPublicKey, validateKeyPair } from './crypto/keys';
export { createEvent, signEvent, verifySignature } from './crypto/events';
export { encrypt, decrypt } from './crypto/encryption';
// Export transport functions
export { parseNostrMessage, formatEventForRelay, formatSubscriptionForRelay, formatCloseForRelay } from './transport';
// Export protocol functions
export { formatAuthForRelay, parseMessage, createFilter, createKindFilter, createAuthorFilter, createReplyFilter, createMetadataEvent, createTextNoteEvent, createDirectMessageEvent, createChannelMessageEvent, extractReferencedEvents, extractMentionedPubkeys } from './protocol';
// Export protocol constants
export { NOSTR_KIND, NOSTR_TAG, NOSTR_MESSAGE_TYPE } from './protocol/constants';
// Export validation functions
export { validateEvent, validateSignedEvent, validateFilter, validateSubscription, validateEventId, validateEventSignature } from './validation';
// Export utilities
import { createLogger } from './utils/logger';
export const logger = createLogger();
