/**
 * Constants used throughout the library
 */
export declare const NOSTR_MESSAGE_TYPE: {
    readonly EVENT: "EVENT";
    readonly REQ: "REQ";
    readonly CLOSE: "CLOSE";
    readonly NOTICE: "NOTICE";
    readonly EOSE: "EOSE";
    readonly OK: "OK";
    readonly AUTH: "AUTH";
    readonly ERROR: "ERROR";
};
export declare const NOSTR_EVENT_KIND: {
    readonly SET_METADATA: 0;
    readonly TEXT_NOTE: 1;
    readonly RECOMMEND_SERVER: 2;
    readonly CONTACT_LIST: 3;
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
    readonly CHANNEL_RESERVED_FIRST: 40;
    readonly CHANNEL_RESERVED_LAST: 49;
    readonly REPORTING: 1984;
    readonly ZAP_REQUEST: 9734;
    readonly ZAP: 9735;
    readonly MUTE_LIST: 10000;
    readonly PIN_LIST: 10001;
    readonly RELAY_LIST_METADATA: 10002;
    readonly CLIENT_AUTH: 22242;
    readonly CLIENT_ERROR: 23;
    readonly PARAMETERIZED_REPLACEABLE_FIRST: 30000;
    readonly PARAMETERIZED_REPLACEABLE_LAST: 39999;
    readonly REPLACEABLE_FIRST: 10000;
    readonly REPLACEABLE_LAST: 19999;
    readonly EPHEMERAL_FIRST: 20000;
    readonly EPHEMERAL_LAST: 29999;
    readonly REGULAR_FIRST: 1000;
    readonly REGULAR_LAST: 9999;
    readonly CUSTOM_FIRST: 40000;
    readonly CUSTOM_LAST: 49999;
};
//# sourceMappingURL=constants.d.ts.map