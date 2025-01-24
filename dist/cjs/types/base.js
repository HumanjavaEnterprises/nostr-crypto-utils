"use strict";
/**
 * @module types/base
 * @description Core type definitions for Nostr protocol
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NostrMessageType = exports.NostrEventKind = void 0;
// Event Types
var NostrEventKind;
(function (NostrEventKind) {
    // NIP-01: Core Protocol
    NostrEventKind[NostrEventKind["SET_METADATA"] = 0] = "SET_METADATA";
    NostrEventKind[NostrEventKind["TEXT_NOTE"] = 1] = "TEXT_NOTE";
    NostrEventKind[NostrEventKind["RECOMMEND_SERVER"] = 2] = "RECOMMEND_SERVER";
    NostrEventKind[NostrEventKind["CONTACTS"] = 3] = "CONTACTS";
    NostrEventKind[NostrEventKind["ENCRYPTED_DIRECT_MESSAGE"] = 4] = "ENCRYPTED_DIRECT_MESSAGE";
    NostrEventKind[NostrEventKind["EVENT_DELETION"] = 5] = "EVENT_DELETION";
    NostrEventKind[NostrEventKind["REPOST"] = 6] = "REPOST";
    NostrEventKind[NostrEventKind["REACTION"] = 7] = "REACTION";
    // NIP-28: Public Chat
    NostrEventKind[NostrEventKind["CHANNEL_CREATION"] = 40] = "CHANNEL_CREATION";
    NostrEventKind[NostrEventKind["CHANNEL_METADATA"] = 41] = "CHANNEL_METADATA";
    NostrEventKind[NostrEventKind["CHANNEL_MESSAGE"] = 42] = "CHANNEL_MESSAGE";
    NostrEventKind[NostrEventKind["CHANNEL_HIDE_MESSAGE"] = 43] = "CHANNEL_HIDE_MESSAGE";
    NostrEventKind[NostrEventKind["CHANNEL_MUTE_USER"] = 44] = "CHANNEL_MUTE_USER";
    // NIP-42: Authentication
    NostrEventKind[NostrEventKind["AUTH"] = 22242] = "AUTH";
    NostrEventKind[NostrEventKind["AUTH_RESPONSE"] = 22243] = "AUTH_RESPONSE";
})(NostrEventKind || (exports.NostrEventKind = NostrEventKind = {}));
// Message Types
var NostrMessageType;
(function (NostrMessageType) {
    NostrMessageType["EVENT"] = "EVENT";
    NostrMessageType["NOTICE"] = "NOTICE";
    NostrMessageType["OK"] = "OK";
    NostrMessageType["EOSE"] = "EOSE";
    NostrMessageType["REQ"] = "REQ";
    NostrMessageType["CLOSE"] = "CLOSE";
    NostrMessageType["AUTH"] = "AUTH";
})(NostrMessageType || (exports.NostrMessageType = NostrMessageType = {}));
//# sourceMappingURL=base.js.map