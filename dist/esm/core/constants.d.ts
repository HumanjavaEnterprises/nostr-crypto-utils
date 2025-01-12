/**
 * Core constants used throughout the library
 * @module core/constants
 */
/**
 * Nostr event kinds as defined in NIPs
 */
export declare const NostrEventKind: {
    readonly SET_METADATA: 0;
    readonly TEXT_NOTE: 1;
    readonly RECOMMEND_RELAY: 2;
    readonly CONTACTS: 3;
    readonly ENCRYPTED_DIRECT_MESSAGE: 4;
    readonly DELETE: 5;
    readonly REPOST: 6;
    readonly REACTION: 7;
    readonly BADGE_AWARD: 8;
    readonly CHANNEL_CREATE: 40;
    readonly CHANNEL_METADATA: 41;
    readonly CHANNEL_MESSAGE: 42;
    readonly CHANNEL_HIDE_MESSAGE: 43;
    readonly CHANNEL_MUTE_USER: 44;
    readonly LONG_FORM_CONTENT: 30023;
};
/**
 * Nostr relay message types
 */
export declare const NostrMessageType: {
    readonly EVENT: "EVENT";
    readonly REQ: "REQ";
    readonly CLOSE: "CLOSE";
    readonly NOTICE: "NOTICE";
    readonly EOSE: "EOSE";
    readonly OK: "OK";
    readonly AUTH: "AUTH";
};
/**
 * Validation constants
 */
export declare const Validation: {
    readonly MAX_EVENT_TAGS: 2000;
    readonly MAX_CONTENT_LENGTH: 64000;
    readonly MIN_POW_DIFFICULTY: 0;
    readonly MAX_TIMESTAMP_DRIFT: number;
    readonly MAX_EXPONENTIAL_BACKOFF: number;
    readonly DEFAULT_TIMEOUT: 5000;
};
/**
 * Core cryptographic constants
 */
export declare const Crypto: {
    readonly PRIVATE_KEY_LENGTH: 32;
    readonly PUBLIC_KEY_LENGTH: 32;
    readonly SIGNATURE_LENGTH: 64;
    readonly HASH_LENGTH: 32;
    readonly SHARED_SECRET_LENGTH: 32;
    readonly IV_LENGTH: 16;
};
/**
 * Core encoding constants
 */
export declare const Encoding: {
    readonly HEX_PREFIX: "0x";
};
/**
 * Protocol constants
 */
export declare const Protocol: {
    readonly DEFAULT_RELAY_URL: "wss://relay.nostr.info";
    readonly RECONNECT_DELAY: 1000;
    readonly MAX_RECONNECT_DELAY: 30000;
    readonly PING_INTERVAL: 30000;
    readonly SUBSCRIPTION_TIMEOUT: 10000;
};
/**
 * Default values
 */
export declare const Defaults: {
    readonly KIND: 1;
    readonly CREATED_AT: () => number;
    readonly TAGS: string[][];
    readonly CONTENT: "";
};
/**
 * Regular expressions for validation
 */
export declare const Regex: {
    readonly HEX: RegExp;
};
//# sourceMappingURL=constants.d.ts.map