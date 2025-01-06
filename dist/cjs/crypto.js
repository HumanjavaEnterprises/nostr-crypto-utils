"use strict";
/**
 * @module crypto
 * @description Cryptographic utilities for Nostr
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySchnorrSignature = exports.signSchnorr = exports.customCrypto = void 0;
exports.getCompressedPublicKey = getCompressedPublicKey;
exports.getSchnorrPublicKey = getSchnorrPublicKey;
exports.generateKeyPair = generateKeyPair;
exports.getPublicKey = getPublicKey;
exports.validateKeyPair = validateKeyPair;
exports.createEvent = createEvent;
exports.signEvent = signEvent;
exports.verifySignature = verifySignature;
exports.encrypt = encrypt;
exports.decrypt = decrypt;
const node_crypto_1 = require("node:crypto");
const secp256k1_1 = require("@noble/curves/secp256k1");
const utils_1 = require("@noble/curves/abstract/utils");
const sha256_1 = require("@noble/hashes/sha256");
const utils_2 = require("@noble/hashes/utils");
const logger_js_1 = require("./utils/logger.js");
/**
 * Crypto implementation that works in both Node.js and browser environments
 */
class CustomCrypto {
    constructor() {
        if (typeof window !== 'undefined' && window.crypto) {
            this.subtle = window.crypto.subtle;
            this.getRandomValues = window.crypto.getRandomValues.bind(window.crypto);
        }
        else {
            this.subtle = node_crypto_1.webcrypto.subtle;
            this.getRandomValues = node_crypto_1.webcrypto.getRandomValues.bind(node_crypto_1.webcrypto);
        }
    }
}
// Create and export default instance
exports.customCrypto = new CustomCrypto();
// Export schnorr functions
exports.signSchnorr = secp256k1_1.schnorr.sign;
exports.verifySchnorrSignature = secp256k1_1.schnorr.verify;
/**
 * Gets the compressed public key (33 bytes with prefix)
 */
function getCompressedPublicKey(privateKeyBytes) {
    return secp256k1_1.secp256k1.getPublicKey(privateKeyBytes, true);
}
/**
 * Gets the schnorr public key (32 bytes x-coordinate) as per BIP340
 */
function getSchnorrPublicKey(privateKeyBytes) {
    return secp256k1_1.schnorr.getPublicKey(privateKeyBytes);
}
/**
 * Generates a new key pair
 */
async function generateKeyPair() {
    const privateKeyBytes = (0, utils_2.randomBytes)(32);
    const privateKey = (0, utils_1.bytesToHex)(privateKeyBytes);
    const publicKey = await getPublicKey(privateKey);
    return {
        privateKey,
        publicKey
    };
}
/**
 * Gets the public key from a private key
 */
async function getPublicKey(privateKey) {
    try {
        const publicKeyBytes = secp256k1_1.secp256k1.getPublicKey((0, utils_1.hexToBytes)(privateKey));
        const publicKeyHex = (0, utils_1.bytesToHex)(publicKeyBytes);
        return {
            hex: publicKeyHex
        };
    }
    catch (error) {
        logger_js_1.logger.error({ error }, 'Failed to get public key');
        throw error;
    }
}
/**
 * Validates a key pair
 */
async function validateKeyPair(publicKey, privateKey) {
    try {
        const derivedPublicKey = await getPublicKey(privateKey);
        const pubkeyHex = typeof publicKey === 'string' ? publicKey : publicKey.hex;
        return {
            isValid: derivedPublicKey.hex === pubkeyHex,
            error: undefined
        };
    }
    catch (error) {
        return {
            isValid: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
/**
 * Creates a new event
 */
function createEvent(event) {
    const timestamp = Math.floor(Date.now() / 1000);
    return {
        ...event,
        created_at: event.created_at || timestamp,
        tags: event.tags || [],
        content: event.content || '',
        kind: event.kind || 1
    };
}
/**
 * Signs an event
 */
async function signEvent(event, privateKey) {
    try {
        // Serialize event for signing
        const serialized = JSON.stringify([
            0,
            event.pubkey,
            event.created_at,
            event.kind,
            event.tags,
            event.content
        ]);
        const hash = (0, sha256_1.sha256)(new TextEncoder().encode(serialized));
        const sig = secp256k1_1.secp256k1.sign(hash, (0, utils_1.hexToBytes)(privateKey));
        const sigBytes = new Uint8Array(sig.toCompactRawBytes());
        return {
            ...event,
            sig: (0, utils_1.bytesToHex)(sigBytes),
            id: (0, utils_1.bytesToHex)(hash)
        };
    }
    catch (error) {
        logger_js_1.logger.error({ error }, 'Failed to sign event');
        throw error;
    }
}
/**
 * Verifies an event signature
 */
async function verifySignature(event) {
    try {
        // Serialize event for verification
        const serialized = JSON.stringify([
            0,
            event.pubkey,
            event.created_at,
            event.kind,
            event.tags,
            event.content
        ]);
        const hash = (0, sha256_1.sha256)(new TextEncoder().encode(serialized));
        const pubkeyHex = typeof event.pubkey === 'string' ? event.pubkey : event.pubkey;
        // Verify signature
        const isValid = secp256k1_1.secp256k1.verify((0, utils_1.hexToBytes)(event.sig), hash, (0, utils_1.hexToBytes)(pubkeyHex));
        return isValid;
    }
    catch (error) {
        logger_js_1.logger.error({ error }, 'Verification error');
        return false;
    }
}
/**
 * Encrypts a message using NIP-04
 */
async function encrypt(message, recipientPubKey, senderPrivKey) {
    try {
        const recipientPubKeyHex = typeof recipientPubKey === 'string' ? recipientPubKey : recipientPubKey.hex;
        const sharedPoint = secp256k1_1.secp256k1.getSharedSecret((0, utils_1.hexToBytes)(senderPrivKey), (0, utils_1.hexToBytes)(recipientPubKeyHex));
        const sharedX = sharedPoint.subarray(1, 33);
        // Generate random IV
        const iv = (0, utils_2.randomBytes)(16);
        const key = await exports.customCrypto.subtle.importKey('raw', sharedX, { name: 'AES-CBC', length: 256 }, false, ['encrypt']);
        // Encrypt the message
        const data = new TextEncoder().encode(message);
        const encrypted = await exports.customCrypto.subtle.encrypt({ name: 'AES-CBC', iv }, key, data);
        // Combine IV and ciphertext
        const combined = new Uint8Array(iv.length + encrypted.byteLength);
        combined.set(iv);
        combined.set(new Uint8Array(encrypted), iv.length);
        return (0, utils_1.bytesToHex)(combined);
    }
    catch (error) {
        logger_js_1.logger.error({ error }, 'Failed to encrypt message');
        throw error;
    }
}
/**
 * Decrypts a message using NIP-04
 */
async function decrypt(encryptedMessage, senderPubKey, recipientPrivKey) {
    try {
        const senderPubKeyHex = typeof senderPubKey === 'string' ? senderPubKey : senderPubKey.hex;
        const sharedPoint = secp256k1_1.secp256k1.getSharedSecret((0, utils_1.hexToBytes)(recipientPrivKey), (0, utils_1.hexToBytes)(senderPubKeyHex));
        const sharedX = sharedPoint.subarray(1, 33);
        const encrypted = (0, utils_1.hexToBytes)(encryptedMessage);
        const iv = encrypted.slice(0, 16);
        const ciphertext = encrypted.slice(16);
        const key = await exports.customCrypto.subtle.importKey('raw', sharedX, { name: 'AES-CBC', length: 256 }, false, ['decrypt']);
        const decrypted = await exports.customCrypto.subtle.decrypt({ name: 'AES-CBC', iv }, key, ciphertext);
        return new TextDecoder().decode(decrypted);
    }
    catch (error) {
        logger_js_1.logger.error({ error }, 'Failed to decrypt message');
        throw error;
    }
}
//# sourceMappingURL=crypto.js.map