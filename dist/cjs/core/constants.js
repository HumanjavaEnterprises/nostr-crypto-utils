"use strict";
/**
 * Core constants used throughout the library
 * @module core/constants
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Regex = exports.Defaults = exports.Protocol = exports.Encoding = exports.Crypto = exports.Validation = exports.NostrMessageType = exports.NostrEventKind = void 0;
/**
 * Nostr event kinds as defined in NIPs
 */
exports.NostrEventKind = {
    SET_METADATA: 0,
    TEXT_NOTE: 1,
    RECOMMEND_RELAY: 2,
    CONTACTS: 3,
    ENCRYPTED_DIRECT_MESSAGE: 4,
    DELETE: 5,
    REPOST: 6,
    REACTION: 7,
    BADGE_AWARD: 8,
    CHANNEL_CREATE: 40,
    CHANNEL_METADATA: 41,
    CHANNEL_MESSAGE: 42,
    CHANNEL_HIDE_MESSAGE: 43,
    CHANNEL_MUTE_USER: 44,
    LONG_FORM_CONTENT: 30023,
};
/**
 * Nostr relay message types
 */
exports.NostrMessageType = {
    EVENT: 'EVENT',
    REQ: 'REQ',
    CLOSE: 'CLOSE',
    NOTICE: 'NOTICE',
    EOSE: 'EOSE',
    OK: 'OK',
    AUTH: 'AUTH'
};
/**
 * Validation constants
 */
exports.Validation = {
    MAX_EVENT_TAGS: 2000,
    MAX_CONTENT_LENGTH: 64000,
    MIN_POW_DIFFICULTY: 0,
    MAX_TIMESTAMP_DRIFT: 60 * 60, // 1 hour
    MAX_EXPONENTIAL_BACKOFF: 60 * 60 * 1000, // 1 hour in ms
    DEFAULT_TIMEOUT: 5000, // 5 seconds
};
/**
 * Core cryptographic constants
 */
exports.Crypto = {
    PRIVATE_KEY_LENGTH: 32,
    PUBLIC_KEY_LENGTH: 32,
    SIGNATURE_LENGTH: 64,
    HASH_LENGTH: 32,
    SHARED_SECRET_LENGTH: 32,
    IV_LENGTH: 16,
};
/**
 * Core encoding constants
 */
exports.Encoding = {
    HEX_PREFIX: '0x',
};
/**
 * Protocol constants
 */
exports.Protocol = {
    DEFAULT_RELAY_URL: 'wss://relay.nostr.info',
    RECONNECT_DELAY: 1000,
    MAX_RECONNECT_DELAY: 30000,
    PING_INTERVAL: 30000,
    SUBSCRIPTION_TIMEOUT: 10000,
};
/**
 * Default values
 */
exports.Defaults = {
    KIND: exports.NostrEventKind.TEXT_NOTE,
    CREATED_AT: () => Math.floor(Date.now() / 1000),
    TAGS: [],
    CONTENT: '',
};
/**
 * Regular expressions for validation
 */
exports.Regex = {
    HEX: /^[0-9a-fA-F]*$/,
};
//# sourceMappingURL=constants.js.map