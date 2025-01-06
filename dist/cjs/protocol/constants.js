"use strict";
/**
 * Constants used in the Nostr protocol
 * @module constants
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOSTR_TAG = exports.NOSTR_KIND = exports.NOSTR_MESSAGE_TYPE = void 0;
/**
 * Nostr protocol message types as defined in NIP-01
 * @constant
 * @type {const}
 */
exports.NOSTR_MESSAGE_TYPE = {
    /** Client sending an event to a relay */
    EVENT: 'EVENT',
    /** Client requesting events from a relay */
    REQ: 'REQ',
    /** Client closing a subscription */
    CLOSE: 'CLOSE',
    /** Relay sending a notice/message to a client */
    NOTICE: 'NOTICE',
    /** Relay acknowledging an event */
    OK: 'OK',
    /** Relay requesting client authentication */
    AUTH: 'AUTH',
    /** Relay indicating end of stored events */
    EOSE: 'EOSE'
};
/**
 * Standard Nostr event kinds as defined in various NIPs
 * @constant
 * @type {const}
 */
exports.NOSTR_KIND = {
    /** User metadata (NIP-01) */
    METADATA: 0,
    /** Text note (NIP-01) */
    TEXT_NOTE: 1,
    /** Relay recommendation (NIP-01) */
    RECOMMEND_SERVER: 2,
    /** Contact list (NIP-02) */
    CONTACTS: 3,
    /** Encrypted direct message (NIP-04) */
    ENCRYPTED_DIRECT_MESSAGE: 4,
    /** Event deletion (NIP-09) */
    DELETE: 5,
    /** Event repost (NIP-18) */
    REPOST: 6,
    /** Reaction (NIP-25) */
    REACTION: 7,
    /** Badge award (NIP-58) */
    BADGE_AWARD: 8,
    /** Channel creation (NIP-28) */
    CHANNEL_CREATE: 40,
    /** Channel metadata (NIP-28) */
    CHANNEL_METADATA: 41,
    /** Channel message (NIP-28) */
    CHANNEL_MESSAGE: 42,
    /** Channel hide message (NIP-28) */
    CHANNEL_HIDE_MESSAGE: 43,
    /** Channel mute user (NIP-28) */
    CHANNEL_MUTE_USER: 44,
    /** File header (NIP-94) */
    FILE_HEADER: 1063,
    /** File chunk (NIP-94) */
    FILE_CHUNK: 1064
};
/**
 * Common Nostr tags as defined in various NIPs
 * @constant
 * @type {const}
 */
exports.NOSTR_TAG = {
    /** Reference to another event */
    EVENT: 'e',
    /** Reference to a pubkey */
    PUBKEY: 'p',
    /** Reference to a replaceable event */
    REFERENCE: 'a',
    /** NIP-26 delegation tag */
    DELEGATION: 'delegation',
    /** Identifier for replaceable events */
    DEDUPLICATION: 'd',
    /** Event expiration timestamp */
    EXPIRATION: 'expiration',
    /** Event kind being referenced */
    KIND: 'k',
    /** Relay URL */
    RELAY: 'r',
    /** Subject or title */
    SUBJECT: 'subject',
    /** Content warning */
    CONTENT_WARNING: 'content-warning',
    /** Proof of work nonce */
    NONCE: 'nonce'
};
//# sourceMappingURL=constants.js.map