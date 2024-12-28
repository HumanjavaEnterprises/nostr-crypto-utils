/**
 * @module types/protocol
 * @description Nostr protocol types
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
    /** Relay indicating end of stored events */
    NostrMessageType["EOSE"] = "EOSE";
    /** Authentication request/response */
    NostrMessageType["AUTH"] = "AUTH";
})(NostrMessageType || (NostrMessageType = {}));
