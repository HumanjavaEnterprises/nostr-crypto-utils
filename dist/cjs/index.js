"use strict";
/**
 * @module nostr-crypto-utils
 * @description Main entry point for the nostr-crypto-utils package
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
exports.decode = exports.nrelayEncode = exports.naddrEncode = exports.neventEncode = exports.nprofileEncode = exports.noteEncode = exports.nsecEncode = exports.npubEncode = exports.validateRelayResponse = exports.validateRelayMessage = exports.validateEvent = exports.createReplyFilter = exports.createAuthorFilter = exports.createKindFilter = exports.extractMentionedPubkeys = exports.extractReferencedEvents = exports.createChannelMessageEvent = exports.createDirectMessageEvent = exports.createTextNoteEvent = exports.createMetadataEvent = exports.parseEventFromRelay = exports.formatAuthForRelay = exports.formatCloseForRelay = exports.formatSubscriptionForRelay = exports.formatEventForRelay = exports.decryptMessage = exports.encryptMessage = exports.verifySignature = exports.signEvent = exports.createEvent = exports.getSchnorrPublicKey = exports.getCompressedPublicKey = exports.validateKeyPair = exports.getPublicKey = exports.generateKeyPair = exports.verifySchnorrSignature = exports.signSchnorr = exports.customCrypto = void 0;
// Re-export all types
__exportStar(require("./types/index"), exports);
// Re-export crypto utilities
var crypto_utils_1 = require("./crypto-utils");
Object.defineProperty(exports, "customCrypto", { enumerable: true, get: function () { return crypto_utils_1.customCrypto; } });
Object.defineProperty(exports, "signSchnorr", { enumerable: true, get: function () { return crypto_utils_1.signSchnorr; } });
Object.defineProperty(exports, "verifySchnorrSignature", { enumerable: true, get: function () { return crypto_utils_1.verifySchnorrSignature; } });
Object.defineProperty(exports, "generateKeyPair", { enumerable: true, get: function () { return crypto_utils_1.generateKeyPair; } });
Object.defineProperty(exports, "getPublicKey", { enumerable: true, get: function () { return crypto_utils_1.getPublicKey; } });
Object.defineProperty(exports, "validateKeyPair", { enumerable: true, get: function () { return crypto_utils_1.validateKeyPair; } });
Object.defineProperty(exports, "getCompressedPublicKey", { enumerable: true, get: function () { return crypto_utils_1.getCompressedPublicKey; } });
Object.defineProperty(exports, "getSchnorrPublicKey", { enumerable: true, get: function () { return crypto_utils_1.getSchnorrPublicKey; } });
Object.defineProperty(exports, "createEvent", { enumerable: true, get: function () { return crypto_utils_1.createEvent; } });
Object.defineProperty(exports, "signEvent", { enumerable: true, get: function () { return crypto_utils_1.signEvent; } });
Object.defineProperty(exports, "verifySignature", { enumerable: true, get: function () { return crypto_utils_1.verifySignature; } });
Object.defineProperty(exports, "encryptMessage", { enumerable: true, get: function () { return crypto_utils_1.encryptMessage; } });
Object.defineProperty(exports, "decryptMessage", { enumerable: true, get: function () { return crypto_utils_1.decryptMessage; } });
// Re-export protocol utilities
var index_1 = require("./protocol/index");
Object.defineProperty(exports, "formatEventForRelay", { enumerable: true, get: function () { return index_1.formatEventForRelay; } });
Object.defineProperty(exports, "formatSubscriptionForRelay", { enumerable: true, get: function () { return index_1.formatSubscriptionForRelay; } });
Object.defineProperty(exports, "formatCloseForRelay", { enumerable: true, get: function () { return index_1.formatCloseForRelay; } });
Object.defineProperty(exports, "formatAuthForRelay", { enumerable: true, get: function () { return index_1.formatAuthForRelay; } });
Object.defineProperty(exports, "parseEventFromRelay", { enumerable: true, get: function () { return index_1.parseMessage; } });
Object.defineProperty(exports, "createMetadataEvent", { enumerable: true, get: function () { return index_1.createMetadataEvent; } });
Object.defineProperty(exports, "createTextNoteEvent", { enumerable: true, get: function () { return index_1.createTextNoteEvent; } });
Object.defineProperty(exports, "createDirectMessageEvent", { enumerable: true, get: function () { return index_1.createDirectMessageEvent; } });
Object.defineProperty(exports, "createChannelMessageEvent", { enumerable: true, get: function () { return index_1.createChannelMessageEvent; } });
Object.defineProperty(exports, "extractReferencedEvents", { enumerable: true, get: function () { return index_1.extractReferencedEvents; } });
Object.defineProperty(exports, "extractMentionedPubkeys", { enumerable: true, get: function () { return index_1.extractMentionedPubkeys; } });
Object.defineProperty(exports, "createKindFilter", { enumerable: true, get: function () { return index_1.createKindFilter; } });
Object.defineProperty(exports, "createAuthorFilter", { enumerable: true, get: function () { return index_1.createAuthorFilter; } });
Object.defineProperty(exports, "createReplyFilter", { enumerable: true, get: function () { return index_1.createReplyFilter; } });
Object.defineProperty(exports, "validateEvent", { enumerable: true, get: function () { return index_1.createFilter; } });
// Re-export validation utilities
var index_2 = require("./validation/index");
Object.defineProperty(exports, "validateRelayMessage", { enumerable: true, get: function () { return index_2.validateEvent; } });
Object.defineProperty(exports, "validateRelayResponse", { enumerable: true, get: function () { return index_2.validateResponse; } });
// Re-export encoding utilities
__exportStar(require("./encoding/index"), exports);
// Re-export NIP implementations
var nip_19_1 = require("./nips/nip-19");
Object.defineProperty(exports, "npubEncode", { enumerable: true, get: function () { return nip_19_1.npubEncode; } });
Object.defineProperty(exports, "nsecEncode", { enumerable: true, get: function () { return nip_19_1.nsecEncode; } });
Object.defineProperty(exports, "noteEncode", { enumerable: true, get: function () { return nip_19_1.noteEncode; } });
Object.defineProperty(exports, "nprofileEncode", { enumerable: true, get: function () { return nip_19_1.nprofileEncode; } });
Object.defineProperty(exports, "neventEncode", { enumerable: true, get: function () { return nip_19_1.neventEncode; } });
Object.defineProperty(exports, "naddrEncode", { enumerable: true, get: function () { return nip_19_1.naddrEncode; } });
Object.defineProperty(exports, "nrelayEncode", { enumerable: true, get: function () { return nip_19_1.nrelayEncode; } });
Object.defineProperty(exports, "decode", { enumerable: true, get: function () { return nip_19_1.decode; } });
__exportStar(require("./nips/index"), exports);
//# sourceMappingURL=index.js.map