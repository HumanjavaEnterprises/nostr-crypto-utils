/**
 * @module types/base
 * @description Base types for Nostr
 */
/**
 * Enum defining all possible Nostr event kinds as specified in various NIPs
 */
export var NostrEventKind;
(function (NostrEventKind) {
    /** NIP-01: Set metadata about the user who created the event */
    NostrEventKind[NostrEventKind["SET_METADATA"] = 0] = "SET_METADATA";
    /** NIP-01: Plain text note */
    NostrEventKind[NostrEventKind["TEXT_NOTE"] = 1] = "TEXT_NOTE";
    /** NIP-01: Recommend relay to followers */
    NostrEventKind[NostrEventKind["RECOMMEND_SERVER"] = 2] = "RECOMMEND_SERVER";
    /** NIP-01: List of followed pubkeys and relays */
    NostrEventKind[NostrEventKind["CONTACTS"] = 3] = "CONTACTS";
    /** NIP-04: Encrypted direct message */
    NostrEventKind[NostrEventKind["ENCRYPTED_DIRECT_MESSAGE"] = 4] = "ENCRYPTED_DIRECT_MESSAGE";
    /** NIP-09: Event deletion */
    NostrEventKind[NostrEventKind["EVENT_DELETION"] = 5] = "EVENT_DELETION";
    /** NIP-25: Reactions */
    NostrEventKind[NostrEventKind["REACTION"] = 7] = "REACTION";
    /** NIP-28: Channel creation */
    NostrEventKind[NostrEventKind["CHANNEL_CREATE"] = 40] = "CHANNEL_CREATE";
    /** NIP-28: Channel metadata */
    NostrEventKind[NostrEventKind["CHANNEL_METADATA"] = 41] = "CHANNEL_METADATA";
    /** NIP-28: Channel message */
    NostrEventKind[NostrEventKind["CHANNEL_MESSAGE"] = 42] = "CHANNEL_MESSAGE";
    /** NIP-28: Hide message in channel */
    NostrEventKind[NostrEventKind["CHANNEL_HIDE"] = 43] = "CHANNEL_HIDE";
    /** NIP-28: Mute user in channel */
    NostrEventKind[NostrEventKind["CHANNEL_MUTE"] = 44] = "CHANNEL_MUTE";
})(NostrEventKind || (NostrEventKind = {}));
/**
 * Enum defining all possible Nostr message types
 */
export var NostrMessageType;
(function (NostrMessageType) {
    NostrMessageType["EVENT"] = "EVENT";
    NostrMessageType["REQ"] = "REQ";
    NostrMessageType["CLOSE"] = "CLOSE";
    NostrMessageType["NOTICE"] = "NOTICE";
    NostrMessageType["EOSE"] = "EOSE";
    NostrMessageType["OK"] = "OK";
    NostrMessageType["AUTH"] = "AUTH";
    NostrMessageType["ERROR"] = "ERROR";
})(NostrMessageType || (NostrMessageType = {}));
