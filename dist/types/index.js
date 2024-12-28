/**
 * @module types
 * @description Type definitions for Nostr
 */
export * from './base';
export * from './guards';
export var NostrMessageType;
(function (NostrMessageType) {
    NostrMessageType["EVENT"] = "EVENT";
    NostrMessageType["REQ"] = "REQ";
    NostrMessageType["CLOSE"] = "CLOSE";
    NostrMessageType["NOTICE"] = "NOTICE";
    NostrMessageType["EOSE"] = "EOSE";
    NostrMessageType["OK"] = "OK";
    NostrMessageType["AUTH"] = "AUTH";
})(NostrMessageType || (NostrMessageType = {}));
