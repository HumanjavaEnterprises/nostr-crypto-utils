/**
 * @module nostr-crypto-utils/types
 * @description Type definitions for the nostr-crypto-utils library
 */
export var NostrEventKind;
(function (NostrEventKind) {
    NostrEventKind[NostrEventKind["SET_METADATA"] = 0] = "SET_METADATA";
    NostrEventKind[NostrEventKind["TEXT_NOTE"] = 1] = "TEXT_NOTE";
    NostrEventKind[NostrEventKind["RECOMMEND_SERVER"] = 2] = "RECOMMEND_SERVER";
    NostrEventKind[NostrEventKind["CONTACT_LIST"] = 3] = "CONTACT_LIST";
    NostrEventKind[NostrEventKind["ENCRYPTED_DIRECT_MESSAGE"] = 4] = "ENCRYPTED_DIRECT_MESSAGE";
    NostrEventKind[NostrEventKind["DELETE"] = 5] = "DELETE";
    NostrEventKind[NostrEventKind["REPOST"] = 6] = "REPOST";
    NostrEventKind[NostrEventKind["REACTION"] = 7] = "REACTION";
    NostrEventKind[NostrEventKind["CHANNEL_CREATE"] = 40] = "CHANNEL_CREATE";
    NostrEventKind[NostrEventKind["CHANNEL_METADATA"] = 41] = "CHANNEL_METADATA";
    NostrEventKind[NostrEventKind["CHANNEL_MESSAGE"] = 42] = "CHANNEL_MESSAGE";
    NostrEventKind[NostrEventKind["CHANNEL_HIDE_MESSAGE"] = 43] = "CHANNEL_HIDE_MESSAGE";
    NostrEventKind[NostrEventKind["CHANNEL_MUTE_USER"] = 44] = "CHANNEL_MUTE_USER";
    NostrEventKind[NostrEventKind["REPORT"] = 1984] = "REPORT";
    NostrEventKind[NostrEventKind["ZAP_REQUEST"] = 9734] = "ZAP_REQUEST";
    NostrEventKind[NostrEventKind["ZAP"] = 9735] = "ZAP";
})(NostrEventKind || (NostrEventKind = {}));
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
