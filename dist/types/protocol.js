/**
 * Nostr protocol specific types and enums
 * @module protocol
 */
/**
 * Standard Nostr message types as defined in NIP-01
 * @enum {string}
 * @see {@link https://github.com/nostr-protocol/nips/blob/master/01.md}
 */
export var NostrMessageType;
(function (NostrMessageType) {
    /** Client sending an event to a relay */
    NostrMessageType["EVENT"] = "EVENT";
    /** Client requesting events from a relay */
    NostrMessageType["REQ"] = "REQ";
    /** Client closing a subscription */
    NostrMessageType["CLOSE"] = "CLOSE";
    /** Relay sending a notice/message to a client */
    NostrMessageType["NOTICE"] = "NOTICE";
    /** Relay acknowledging an event */
    NostrMessageType["OK"] = "OK";
    /** Relay requesting client authentication */
    NostrMessageType["AUTH"] = "AUTH";
    /** Relay indicating end of stored events */
    NostrMessageType["EOSE"] = "EOSE";
})(NostrMessageType || (NostrMessageType = {}));
/**
 * Standard event kinds as defined in various NIPs
 * @enum {number}
 * @see {@link https://github.com/nostr-protocol/nips}
 */
export var NostrEventKind;
(function (NostrEventKind) {
    /** User metadata (NIP-01) - Contains user profile information in JSON format */
    NostrEventKind[NostrEventKind["METADATA"] = 0] = "METADATA";
    /** Text note (NIP-01) - Basic text message or post */
    NostrEventKind[NostrEventKind["TEXT_NOTE"] = 1] = "TEXT_NOTE";
    /** Relay recommendation (NIP-01) - Suggests a relay URL to other users */
    NostrEventKind[NostrEventKind["RECOMMEND_SERVER"] = 2] = "RECOMMEND_SERVER";
    /** Contact list (NIP-02) - List of followed pubkeys and relay URLs */
    NostrEventKind[NostrEventKind["CONTACTS"] = 3] = "CONTACTS";
    /** Encrypted direct message (NIP-04) - End-to-end encrypted private message */
    NostrEventKind[NostrEventKind["ENCRYPTED_DIRECT_MESSAGE"] = 4] = "ENCRYPTED_DIRECT_MESSAGE";
    /** Event deletion (NIP-09) - Request to delete previous events */
    NostrEventKind[NostrEventKind["DELETE"] = 5] = "DELETE";
    /** Event repost (NIP-18) - Share/repost another event */
    NostrEventKind[NostrEventKind["REPOST"] = 6] = "REPOST";
    /** Reaction (NIP-25) - Emoji reaction to another event */
    NostrEventKind[NostrEventKind["REACTION"] = 7] = "REACTION";
    /** Channel creation (NIP-28) - Creates a new chat channel */
    NostrEventKind[NostrEventKind["CHANNEL_CREATION"] = 40] = "CHANNEL_CREATION";
    /** Channel message (NIP-28) - Message in a chat channel */
    NostrEventKind[NostrEventKind["CHANNEL_MESSAGE"] = 42] = "CHANNEL_MESSAGE";
    /** Channel metadata (NIP-28) - Updates channel information */
    NostrEventKind[NostrEventKind["CHANNEL_METADATA"] = 41] = "CHANNEL_METADATA";
    /** Channel hide message (NIP-28) - Hides a message in a channel */
    NostrEventKind[NostrEventKind["CHANNEL_HIDE_MESSAGE"] = 43] = "CHANNEL_HIDE_MESSAGE";
    /** Channel mute user (NIP-28) - Mutes a user in a channel */
    NostrEventKind[NostrEventKind["CHANNEL_MUTE_USER"] = 44] = "CHANNEL_MUTE_USER";
})(NostrEventKind || (NostrEventKind = {}));
