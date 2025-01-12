"use strict";
/**
 * @module types
 * @description Type definitions for Nostr
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NostrEventKind = void 0;
var NostrEventKind;
(function (NostrEventKind) {
    NostrEventKind[NostrEventKind["SET_METADATA"] = 0] = "SET_METADATA";
    NostrEventKind[NostrEventKind["TEXT_NOTE"] = 1] = "TEXT_NOTE";
    NostrEventKind[NostrEventKind["RECOMMEND_SERVER"] = 2] = "RECOMMEND_SERVER";
    NostrEventKind[NostrEventKind["CONTACT_LIST"] = 3] = "CONTACT_LIST";
    NostrEventKind[NostrEventKind["ENCRYPTED_DIRECT_MESSAGE"] = 4] = "ENCRYPTED_DIRECT_MESSAGE";
    NostrEventKind[NostrEventKind["DELETE"] = 5] = "DELETE";
    NostrEventKind[NostrEventKind["REPOST"] = 6] = "REPOST";
    NostrEventKind[NostrEventKind["REACTION"] = 7] = "REACTION";
    NostrEventKind[NostrEventKind["BADGE_AWARD"] = 8] = "BADGE_AWARD";
    NostrEventKind[NostrEventKind["CHANNEL_CREATE"] = 40] = "CHANNEL_CREATE";
    NostrEventKind[NostrEventKind["CHANNEL_METADATA"] = 41] = "CHANNEL_METADATA";
    NostrEventKind[NostrEventKind["CHANNEL_MESSAGE"] = 42] = "CHANNEL_MESSAGE";
    NostrEventKind[NostrEventKind["CHANNEL_HIDE_MESSAGE"] = 43] = "CHANNEL_HIDE_MESSAGE";
    NostrEventKind[NostrEventKind["CHANNEL_MUTE_USER"] = 44] = "CHANNEL_MUTE_USER";
    NostrEventKind[NostrEventKind["CHANNEL_RESERVE"] = 45] = "CHANNEL_RESERVE";
    NostrEventKind[NostrEventKind["REPORTING"] = 1984] = "REPORTING";
    NostrEventKind[NostrEventKind["ZAP_REQUEST"] = 9734] = "ZAP_REQUEST";
    NostrEventKind[NostrEventKind["ZAP"] = 9735] = "ZAP";
    NostrEventKind[NostrEventKind["MUTE_LIST"] = 10000] = "MUTE_LIST";
    NostrEventKind[NostrEventKind["PIN_LIST"] = 10001] = "PIN_LIST";
    NostrEventKind[NostrEventKind["RELAY_LIST_METADATA"] = 10002] = "RELAY_LIST_METADATA";
    NostrEventKind[NostrEventKind["CLIENT_AUTH"] = 22242] = "CLIENT_AUTH";
    NostrEventKind[NostrEventKind["NOSTR_CONNECT"] = 24133] = "NOSTR_CONNECT";
    NostrEventKind[NostrEventKind["CATEGORIZED_PEOPLE"] = 30000] = "CATEGORIZED_PEOPLE";
    NostrEventKind[NostrEventKind["CATEGORIZED_BOOKMARKS"] = 30001] = "CATEGORIZED_BOOKMARKS";
    NostrEventKind[NostrEventKind["PROFILE_BADGES"] = 30008] = "PROFILE_BADGES";
    NostrEventKind[NostrEventKind["BADGE_DEFINITION"] = 30009] = "BADGE_DEFINITION";
    NostrEventKind[NostrEventKind["LONG_FORM"] = 30023] = "LONG_FORM";
    NostrEventKind[NostrEventKind["APPLICATION_SPECIFIC"] = 30078] = "APPLICATION_SPECIFIC";
})(NostrEventKind || (exports.NostrEventKind = NostrEventKind = {}));
/**
 * Re-export all types from base module
 * @packageDocumentation
 */
__exportStar(require("./base"), exports);
/** Re-export protocol types */
__exportStar(require("./protocol"), exports);
/** Re-export message types */
__exportStar(require("./messages"), exports);
/** Re-export type guards */
__exportStar(require("./guards"), exports);
//# sourceMappingURL=index.js.map