"use strict";
/**
 * @module crypto-utils
 * @description Cryptographic utilities for Nostr
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptMessage = exports.encryptMessage = exports.verifySignature = exports.signEvent = exports.createEvent = exports.getSchnorrPublicKey = exports.getCompressedPublicKey = exports.validateKeyPair = exports.getPublicKey = exports.generateKeyPair = exports.verifySchnorrSignature = exports.signSchnorr = exports.customCrypto = void 0;
const nip_04_js_1 = require("./nips/nip-04.js");
Object.defineProperty(exports, "encryptMessage", { enumerable: true, get: function () { return nip_04_js_1.encryptMessage; } });
Object.defineProperty(exports, "decryptMessage", { enumerable: true, get: function () { return nip_04_js_1.decryptMessage; } });
const crypto_js_1 = require("./crypto.js");
Object.defineProperty(exports, "customCrypto", { enumerable: true, get: function () { return crypto_js_1.customCrypto; } });
Object.defineProperty(exports, "signSchnorr", { enumerable: true, get: function () { return crypto_js_1.signSchnorr; } });
Object.defineProperty(exports, "verifySchnorrSignature", { enumerable: true, get: function () { return crypto_js_1.verifySchnorrSignature; } });
Object.defineProperty(exports, "generateKeyPair", { enumerable: true, get: function () { return crypto_js_1.generateKeyPair; } });
Object.defineProperty(exports, "getPublicKey", { enumerable: true, get: function () { return crypto_js_1.getPublicKey; } });
Object.defineProperty(exports, "validateKeyPair", { enumerable: true, get: function () { return crypto_js_1.validateKeyPair; } });
Object.defineProperty(exports, "getCompressedPublicKey", { enumerable: true, get: function () { return crypto_js_1.getCompressedPublicKey; } });
Object.defineProperty(exports, "getSchnorrPublicKey", { enumerable: true, get: function () { return crypto_js_1.getSchnorrPublicKey; } });
Object.defineProperty(exports, "createEvent", { enumerable: true, get: function () { return crypto_js_1.createEvent; } });
Object.defineProperty(exports, "signEvent", { enumerable: true, get: function () { return crypto_js_1.signEvent; } });
Object.defineProperty(exports, "verifySignature", { enumerable: true, get: function () { return crypto_js_1.verifySignature; } });
//# sourceMappingURL=crypto-utils.js.map