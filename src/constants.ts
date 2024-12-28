/**
 * Constants used throughout the library
 */

export const NOSTR_MESSAGE_TYPE = {
    EVENT: 'EVENT',
    REQ: 'REQ',
    CLOSE: 'CLOSE',
    NOTICE: 'NOTICE',
    EOSE: 'EOSE',
    OK: 'OK',
    AUTH: 'AUTH',
    ERROR: 'ERROR'
} as const;

export const NOSTR_EVENT_KIND = {
    SET_METADATA: 0,
    TEXT_NOTE: 1,
    RECOMMEND_SERVER: 2,
    CONTACT_LIST: 3,
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
    CHANNEL_RESERVED_FIRST: 40,
    CHANNEL_RESERVED_LAST: 49,
    REPORTING: 1984,
    ZAP_REQUEST: 9734,
    ZAP: 9735,
    MUTE_LIST: 10000,
    PIN_LIST: 10001,
    RELAY_LIST_METADATA: 10002,
    CLIENT_AUTH: 22242,
    CLIENT_ERROR: 23,
    PARAMETERIZED_REPLACEABLE_FIRST: 30000,
    PARAMETERIZED_REPLACEABLE_LAST: 39999,
    REPLACEABLE_FIRST: 10000,
    REPLACEABLE_LAST: 19999,
    EPHEMERAL_FIRST: 20000,
    EPHEMERAL_LAST: 29999,
    REGULAR_FIRST: 1000,
    REGULAR_LAST: 9999,
    CUSTOM_FIRST: 40000,
    CUSTOM_LAST: 49999
} as const;
