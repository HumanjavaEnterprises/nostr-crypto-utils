/**
 * Constants used in the Nostr protocol
 * @module constants
 */
/**
 * Nostr protocol message types as defined in NIP-01
 * @constant
 * @type {const}
 */
export declare const NOSTR_MESSAGE_TYPE: {
    /** Client sending an event to a relay */
    readonly EVENT: "EVENT";
    /** Client requesting events from a relay */
    readonly REQ: "REQ";
    /** Client closing a subscription */
    readonly CLOSE: "CLOSE";
    /** Relay sending a notice/message to a client */
    readonly NOTICE: "NOTICE";
    /** Relay acknowledging an event */
    readonly OK: "OK";
    /** Relay requesting client authentication */
    readonly AUTH: "AUTH";
    /** Relay indicating end of stored events */
    readonly EOSE: "EOSE";
};
/**
 * Standard Nostr event kinds as defined in various NIPs
 * @constant
 * @type {const}
 */
export declare const NOSTR_KIND: {
    /** User metadata (NIP-01) */
    readonly METADATA: 0;
    /** Text note (NIP-01) */
    readonly TEXT_NOTE: 1;
    /** Relay recommendation (NIP-01) */
    readonly RECOMMEND_SERVER: 2;
    /** Contact list (NIP-02) */
    readonly CONTACTS: 3;
    /** Encrypted direct message (NIP-04) */
    readonly ENCRYPTED_DIRECT_MESSAGE: 4;
    /** Event deletion (NIP-09) */
    readonly DELETE: 5;
    /** Event repost (NIP-18) */
    readonly REPOST: 6;
    /** Reaction (NIP-25) */
    readonly REACTION: 7;
    /** Badge award (NIP-58) */
    readonly BADGE_AWARD: 8;
    /** Channel creation (NIP-28) */
    readonly CHANNEL_CREATE: 40;
    /** Channel metadata (NIP-28) */
    readonly CHANNEL_METADATA: 41;
    /** Channel message (NIP-28) */
    readonly CHANNEL_MESSAGE: 42;
    /** Channel hide message (NIP-28) */
    readonly CHANNEL_HIDE_MESSAGE: 43;
    /** Channel mute user (NIP-28) */
    readonly CHANNEL_MUTE_USER: 44;
    /** File header (NIP-94) */
    readonly FILE_HEADER: 1063;
    /** File chunk (NIP-94) */
    readonly FILE_CHUNK: 1064;
};
/**
 * Common Nostr tags as defined in various NIPs
 * @constant
 * @type {const}
 */
export declare const NOSTR_TAG: {
    /** Reference to another event */
    readonly EVENT: "e";
    /** Reference to a pubkey */
    readonly PUBKEY: "p";
    /** Reference to a replaceable event */
    readonly REFERENCE: "a";
    /** NIP-26 delegation tag */
    readonly DELEGATION: "delegation";
    /** Identifier for replaceable events */
    readonly DEDUPLICATION: "d";
    /** Event expiration timestamp */
    readonly EXPIRATION: "expiration";
    /** Event kind being referenced */
    readonly KIND: "k";
    /** Relay URL */
    readonly RELAY: "r";
    /** Subject or title */
    readonly SUBJECT: "subject";
    /** Content warning */
    readonly CONTENT_WARNING: "content-warning";
    /** Proof of work nonce */
    readonly NONCE: "nonce";
};
/** Type for message types extracted from NOSTR_MESSAGE_TYPE constant */
export type NostrMessageType = typeof NOSTR_MESSAGE_TYPE[keyof typeof NOSTR_MESSAGE_TYPE];
/** Type for event kinds extracted from NOSTR_KIND constant */
export type NostrKind = typeof NOSTR_KIND[keyof typeof NOSTR_KIND];
/** Type for tags extracted from NOSTR_TAG constant */
export type NostrTag = typeof NOSTR_TAG[keyof typeof NOSTR_TAG];
//# sourceMappingURL=constants.d.ts.map