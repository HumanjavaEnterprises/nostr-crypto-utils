"use strict";
/**
 * @module crypto/encryption
 * @description Functions for encrypting and decrypting messages using NIP-04
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
exports.encrypt = encrypt;
exports.decrypt = decrypt;
const utils_1 = require("@noble/curves/abstract/utils");
const utils_2 = require("@noble/hashes/utils");
const sha256_1 = require("@noble/hashes/sha256");
const secp256k1 = __importStar(require("@noble/secp256k1"));
/**
 * Encrypts a message using NIP-04
 */
async function encrypt(message, recipientPubKey, senderPrivKey) {
    try {
        const recipientPubKeyHex = typeof recipientPubKey === 'string'
            ? recipientPubKey
            : recipientPubKey.hex;
        // Convert hex strings to Uint8Array
        const senderPrivKeyBytes = (0, utils_1.hexToBytes)(senderPrivKey);
        const recipientPubKeyBytes = (0, utils_1.hexToBytes)(recipientPubKeyHex);
        // Generate shared secret using secp256k1
        const sharedPoint = secp256k1.getSharedSecret(senderPrivKeyBytes, recipientPubKeyBytes);
        const sharedSecret = (0, sha256_1.sha256)(sharedPoint.slice(1)); // Remove the prefix byte
        // Generate initialization vector
        const iv = (0, utils_2.randomBytes)(16);
        // Encrypt the message
        const encoder = new TextEncoder();
        const messageBytes = encoder.encode(message);
        const key = await crypto.subtle.importKey('raw', sharedSecret, { name: 'AES-CBC' }, false, ['encrypt']);
        const encryptedBytes = await crypto.subtle.encrypt({ name: 'AES-CBC', iv }, key, messageBytes);
        // Combine IV and ciphertext and encode as base64
        const combined = new Uint8Array(iv.length + encryptedBytes.byteLength);
        combined.set(iv);
        combined.set(new Uint8Array(encryptedBytes), iv.length);
        return (0, utils_1.bytesToHex)(combined);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error('Encryption failed: ' + errorMessage);
    }
}
/**
 * Decrypts a message using NIP-04
 */
async function decrypt(encryptedMessage, senderPubKey, recipientPrivKey) {
    try {
        const senderPubKeyHex = typeof senderPubKey === 'string'
            ? senderPubKey
            : senderPubKey.hex;
        // Convert hex strings to Uint8Array
        const recipientPrivKeyBytes = (0, utils_1.hexToBytes)(recipientPrivKey);
        const senderPubKeyBytes = (0, utils_1.hexToBytes)(senderPubKeyHex);
        const encryptedBytes = (0, utils_1.hexToBytes)(encryptedMessage);
        // Generate shared secret using secp256k1
        const sharedPoint = secp256k1.getSharedSecret(recipientPrivKeyBytes, senderPubKeyBytes);
        const sharedSecret = (0, sha256_1.sha256)(sharedPoint.slice(1)); // Remove the prefix byte
        // Extract IV and ciphertext
        const iv = encryptedBytes.slice(0, 16);
        const ciphertext = encryptedBytes.slice(16);
        // Import key for decryption
        const key = await crypto.subtle.importKey('raw', sharedSecret, { name: 'AES-CBC' }, false, ['decrypt']);
        // Decrypt the message
        const decryptedBytes = await crypto.subtle.decrypt({ name: 'AES-CBC', iv }, key, ciphertext);
        // Convert back to string
        const decoder = new TextDecoder();
        return decoder.decode(decryptedBytes);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error('Decryption failed: ' + errorMessage);
    }
}
//# sourceMappingURL=encryption.js.map