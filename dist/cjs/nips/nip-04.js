"use strict";
/**
 * @module nips/nip-04
 * @description Implementation of NIP-04 (Encrypted Direct Messages)
 * @see https://github.com/nostr-protocol/nips/blob/master/04.md
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
exports.encryptMessage = encryptMessage;
exports.decryptMessage = decryptMessage;
exports.generateSharedSecret = generateSharedSecret;
const secp256k1 = __importStar(require("@noble/secp256k1"));
const node_crypto_1 = require("node:crypto");
const utils_1 = require("@noble/hashes/utils");
const logger_1 = require("../utils/logger");
let customCrypto;
if (typeof window !== 'undefined' && window.crypto) {
    customCrypto = window.crypto;
}
else {
    customCrypto = node_crypto_1.webcrypto;
}
/**
 * Encrypts a message using NIP-04 encryption
 * @param message - Message to encrypt
 * @param recipientPubKey - Recipient's public key
 * @param senderPrivKey - Sender's private key
 * @returns Encrypted message string
 */
async function encryptMessage(message, recipientPubKey, senderPrivKey) {
    try {
        const sharedSecret = secp256k1.getSharedSecret(senderPrivKey, '02' + recipientPubKey);
        const sharedKey = await customCrypto.subtle.importKey('raw', sharedSecret.slice(1), { name: 'AES-CBC', length: 256 }, true, ['encrypt']);
        const iv = customCrypto.getRandomValues(new Uint8Array(16));
        const encrypted = await customCrypto.subtle.encrypt({ name: 'AES-CBC', iv }, sharedKey, new TextEncoder().encode(message));
        const encryptedArray = new Uint8Array(encrypted);
        const combined = new Uint8Array(iv.length + encryptedArray.length);
        combined.set(iv);
        combined.set(encryptedArray, iv.length);
        return (0, utils_1.bytesToHex)(combined);
    }
    catch (error) {
        logger_1.logger.error({ error }, 'Failed to encrypt message');
        throw error;
    }
}
/**
 * Decrypts a message using NIP-04 decryption
 * @param encryptedMessage - Encrypted message string
 * @param senderPubKey - Sender's public key
 * @param recipientPrivKey - Recipient's private key
 * @returns Decrypted message string
 */
async function decryptMessage(encryptedMessage, senderPubKey, recipientPrivKey) {
    try {
        const combined = (0, utils_1.hexToBytes)(encryptedMessage);
        const iv = combined.slice(0, 16);
        const ciphertext = combined.slice(16);
        const sharedSecret = secp256k1.getSharedSecret(recipientPrivKey, '02' + senderPubKey);
        const sharedKey = await customCrypto.subtle.importKey('raw', sharedSecret.slice(1), { name: 'AES-CBC', length: 256 }, true, ['decrypt']);
        const decrypted = await customCrypto.subtle.decrypt({ name: 'AES-CBC', iv }, sharedKey, ciphertext);
        return new TextDecoder().decode(decrypted);
    }
    catch (error) {
        logger_1.logger.error({ error }, 'Failed to decrypt message');
        throw error;
    }
}
/**
 * Generates a shared secret for NIP-04 encryption
 * @param privateKey - Private key
 * @param publicKey - Public key
 * @returns Shared secret
 */
function generateSharedSecret(privateKey, publicKey) {
    const sharedPoint = secp256k1.getSharedSecret(privateKey, '02' + publicKey);
    return { sharedSecret: sharedPoint.slice(1) };
}
//# sourceMappingURL=nip-04.js.map