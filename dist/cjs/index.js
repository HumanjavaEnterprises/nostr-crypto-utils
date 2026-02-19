"use strict";
/**
 * @module nostr-crypto-utils
 * @description Core cryptographic utilities for Nostr protocol
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.bytesToUtf8 = exports.utf8ToBytes = exports.bytesToHex = exports.hexToBytes = exports.nip26 = exports.nip19 = exports.nip04 = exports.nip01 = exports.decryptMessage = exports.encryptMessage = exports.computeSharedSecret = exports.calculateEventId = exports.validateResponse = exports.validateSubscription = exports.validateFilter = exports.validateEventBase = exports.validateSignedEvent = exports.validateEventSignature = exports.validateEventId = exports.validateEvent = exports.decrypt = exports.encrypt = exports.verifySignature = exports.signEvent = exports.createEvent = exports.validateKeyPair = exports.getPublicKey = exports.generateKeyPair = exports.NostrMessageType = exports.NostrEventKind = void 0;
// Event kinds and message types
var types_1 = require("./types");
Object.defineProperty(exports, "NostrEventKind", { enumerable: true, get: function () { return types_1.NostrEventKind; } });
Object.defineProperty(exports, "NostrMessageType", { enumerable: true, get: function () { return types_1.NostrMessageType; } });
// Core crypto functions
var crypto_1 = require("./crypto");
Object.defineProperty(exports, "generateKeyPair", { enumerable: true, get: function () { return crypto_1.generateKeyPair; } });
Object.defineProperty(exports, "getPublicKey", { enumerable: true, get: function () { return crypto_1.getPublicKey; } });
Object.defineProperty(exports, "validateKeyPair", { enumerable: true, get: function () { return crypto_1.validateKeyPair; } });
Object.defineProperty(exports, "createEvent", { enumerable: true, get: function () { return crypto_1.createEvent; } });
Object.defineProperty(exports, "signEvent", { enumerable: true, get: function () { return crypto_1.signEvent; } });
Object.defineProperty(exports, "verifySignature", { enumerable: true, get: function () { return crypto_1.verifySignature; } });
Object.defineProperty(exports, "encrypt", { enumerable: true, get: function () { return crypto_1.encrypt; } });
Object.defineProperty(exports, "decrypt", { enumerable: true, get: function () { return crypto_1.decrypt; } });
// Validation functions
var validation_1 = require("./validation");
Object.defineProperty(exports, "validateEvent", { enumerable: true, get: function () { return validation_1.validateEvent; } });
Object.defineProperty(exports, "validateEventId", { enumerable: true, get: function () { return validation_1.validateEventId; } });
Object.defineProperty(exports, "validateEventSignature", { enumerable: true, get: function () { return validation_1.validateEventSignature; } });
Object.defineProperty(exports, "validateSignedEvent", { enumerable: true, get: function () { return validation_1.validateSignedEvent; } });
Object.defineProperty(exports, "validateEventBase", { enumerable: true, get: function () { return validation_1.validateEventBase; } });
Object.defineProperty(exports, "validateFilter", { enumerable: true, get: function () { return validation_1.validateFilter; } });
Object.defineProperty(exports, "validateSubscription", { enumerable: true, get: function () { return validation_1.validateSubscription; } });
Object.defineProperty(exports, "validateResponse", { enumerable: true, get: function () { return validation_1.validateResponse; } });
// Event functions
var event_1 = require("./event");
Object.defineProperty(exports, "calculateEventId", { enumerable: true, get: function () { return event_1.calculateEventId; } });
// NIP-04 encryption
var nip_04_1 = require("./nips/nip-04");
Object.defineProperty(exports, "computeSharedSecret", { enumerable: true, get: function () { return nip_04_1.computeSharedSecret; } });
Object.defineProperty(exports, "encryptMessage", { enumerable: true, get: function () { return nip_04_1.encryptMessage; } });
Object.defineProperty(exports, "decryptMessage", { enumerable: true, get: function () { return nip_04_1.decryptMessage; } });
// Re-export NIPs
exports.nip01 = __importStar(require("./nips/nip-01"));
exports.nip04 = __importStar(require("./nips/nip-04"));
exports.nip19 = __importStar(require("./nips/nip-19"));
exports.nip26 = __importStar(require("./nips/nip-26"));
// Utils
var encoding_1 = require("./utils/encoding");
Object.defineProperty(exports, "hexToBytes", { enumerable: true, get: function () { return encoding_1.hexToBytes; } });
Object.defineProperty(exports, "bytesToHex", { enumerable: true, get: function () { return encoding_1.bytesToHex; } });
Object.defineProperty(exports, "utf8ToBytes", { enumerable: true, get: function () { return encoding_1.utf8ToBytes; } });
Object.defineProperty(exports, "bytesToUtf8", { enumerable: true, get: function () { return encoding_1.bytesToUtf8; } });
//# sourceMappingURL=index.js.map