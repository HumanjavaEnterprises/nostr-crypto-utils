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
exports.validateRelayResponse = exports.validateRelayMessage = exports.validateEvent = exports.createReplyFilter = exports.createAuthorFilter = exports.createKindFilter = exports.extractMentionedPubkeys = exports.extractReferencedEvents = exports.createChannelMessageEvent = exports.createDirectMessageEvent = exports.createTextNoteEvent = exports.createMetadataEvent = exports.parseEventFromRelay = exports.formatAuthForRelay = exports.formatCloseForRelay = exports.formatSubscriptionForRelay = exports.formatEventForRelay = exports.decryptMessage = exports.encryptMessage = exports.verifySignature = exports.signEvent = exports.createEvent = exports.getSchnorrPublicKey = exports.getCompressedPublicKey = exports.validateKeyPair = exports.getPublicKey = exports.generateKeyPair = exports.verifySchnorrSignature = exports.signSchnorr = exports.customCrypto = void 0;
// Re-export all types
__exportStar(require("./types/index.js"), exports);
// Re-export crypto utilities
var crypto_utils_js_1 = require("./crypto-utils.js");
Object.defineProperty(exports, "customCrypto", { enumerable: true, get: function () { return crypto_utils_js_1.customCrypto; } });
Object.defineProperty(exports, "signSchnorr", { enumerable: true, get: function () { return crypto_utils_js_1.signSchnorr; } });
Object.defineProperty(exports, "verifySchnorrSignature", { enumerable: true, get: function () { return crypto_utils_js_1.verifySchnorrSignature; } });
Object.defineProperty(exports, "generateKeyPair", { enumerable: true, get: function () { return crypto_utils_js_1.generateKeyPair; } });
Object.defineProperty(exports, "getPublicKey", { enumerable: true, get: function () { return crypto_utils_js_1.getPublicKey; } });
Object.defineProperty(exports, "validateKeyPair", { enumerable: true, get: function () { return crypto_utils_js_1.validateKeyPair; } });
Object.defineProperty(exports, "getCompressedPublicKey", { enumerable: true, get: function () { return crypto_utils_js_1.getCompressedPublicKey; } });
Object.defineProperty(exports, "getSchnorrPublicKey", { enumerable: true, get: function () { return crypto_utils_js_1.getSchnorrPublicKey; } });
Object.defineProperty(exports, "createEvent", { enumerable: true, get: function () { return crypto_utils_js_1.createEvent; } });
Object.defineProperty(exports, "signEvent", { enumerable: true, get: function () { return crypto_utils_js_1.signEvent; } });
Object.defineProperty(exports, "verifySignature", { enumerable: true, get: function () { return crypto_utils_js_1.verifySignature; } });
Object.defineProperty(exports, "encryptMessage", { enumerable: true, get: function () { return crypto_utils_js_1.encryptMessage; } });
Object.defineProperty(exports, "decryptMessage", { enumerable: true, get: function () { return crypto_utils_js_1.decryptMessage; } });
// Re-export protocol utilities
var index_js_1 = require("./protocol/index.js");
Object.defineProperty(exports, "formatEventForRelay", { enumerable: true, get: function () { return index_js_1.formatEventForRelay; } });
Object.defineProperty(exports, "formatSubscriptionForRelay", { enumerable: true, get: function () { return index_js_1.formatSubscriptionForRelay; } });
Object.defineProperty(exports, "formatCloseForRelay", { enumerable: true, get: function () { return index_js_1.formatCloseForRelay; } });
Object.defineProperty(exports, "formatAuthForRelay", { enumerable: true, get: function () { return index_js_1.formatAuthForRelay; } });
Object.defineProperty(exports, "parseEventFromRelay", { enumerable: true, get: function () { return index_js_1.parseMessage; } });
Object.defineProperty(exports, "createMetadataEvent", { enumerable: true, get: function () { return index_js_1.createMetadataEvent; } });
Object.defineProperty(exports, "createTextNoteEvent", { enumerable: true, get: function () { return index_js_1.createTextNoteEvent; } });
Object.defineProperty(exports, "createDirectMessageEvent", { enumerable: true, get: function () { return index_js_1.createDirectMessageEvent; } });
Object.defineProperty(exports, "createChannelMessageEvent", { enumerable: true, get: function () { return index_js_1.createChannelMessageEvent; } });
Object.defineProperty(exports, "extractReferencedEvents", { enumerable: true, get: function () { return index_js_1.extractReferencedEvents; } });
Object.defineProperty(exports, "extractMentionedPubkeys", { enumerable: true, get: function () { return index_js_1.extractMentionedPubkeys; } });
Object.defineProperty(exports, "createKindFilter", { enumerable: true, get: function () { return index_js_1.createKindFilter; } });
Object.defineProperty(exports, "createAuthorFilter", { enumerable: true, get: function () { return index_js_1.createAuthorFilter; } });
Object.defineProperty(exports, "createReplyFilter", { enumerable: true, get: function () { return index_js_1.createReplyFilter; } });
Object.defineProperty(exports, "validateEvent", { enumerable: true, get: function () { return index_js_1.createFilter; } });
// Re-export validation utilities
var index_js_2 = require("./validation/index.js");
Object.defineProperty(exports, "validateRelayMessage", { enumerable: true, get: function () { return index_js_2.validateEvent; } });
Object.defineProperty(exports, "validateRelayResponse", { enumerable: true, get: function () { return index_js_2.validateResponse; } });
// Re-export encoding utilities
__exportStar(require("./encoding/index.js"), exports);
// Re-export NIP implementations
__exportStar(require("./nips/index.js"), exports);
//# sourceMappingURL=index.js.map