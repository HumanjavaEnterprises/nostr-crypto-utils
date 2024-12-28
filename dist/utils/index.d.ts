/**
 * @module utils
 * @description Shared utilities and helper functions
 */
export * from './functions';
export * from './validation';
export { formatEventForRelay, formatSubscriptionForRelay, formatCloseForRelay, formatAuthForRelay, parseNostrMessage, extractReferencedEvents, extractMentionedPubkeys, createKindFilter, createAuthorFilter, createReplyFilter, createMetadataEvent, createTextNoteEvent, createDirectMessageEvent, createChannelMessageEvent } from './integration';
export declare const logger: import("pino").Logger<never>;
