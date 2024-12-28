/**
 * @module nostr-crypto-utils
 * @description A comprehensive TypeScript library providing cryptographic utilities and protocol-compliant message handling for Nostr applications
 * @packageDocumentation
 */
export { NostrEventKind, NostrMessageType } from './types/base';
export type { NostrEvent, SignedNostrEvent, NostrFilter, NostrSubscription, NostrResponse, NostrError, PublicKey, KeyPair, ValidationResult } from './types/base';
export { generateKeyPair, getPublicKey, validateKeyPair } from './crypto/keys';
export { createEvent, signEvent, verifySignature } from './crypto/events';
export { encrypt, decrypt } from './crypto/encryption';
export { parseNostrMessage, formatEventForRelay, formatSubscriptionForRelay, formatCloseForRelay } from './transport';
export { formatAuthForRelay, parseMessage, createFilter, createKindFilter, createAuthorFilter, createReplyFilter, createMetadataEvent, createTextNoteEvent, createDirectMessageEvent, createChannelMessageEvent, extractReferencedEvents, extractMentionedPubkeys } from './protocol';
export { NOSTR_KIND, NOSTR_TAG, NOSTR_MESSAGE_TYPE } from './protocol/constants';
export { validateEvent, validateSignedEvent, validateFilter, validateSubscription, validateEventId, validateEventSignature } from './validation';
export declare const logger: import("pino").Logger<never>;
