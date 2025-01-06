"use strict";
/**
 * @module crypto
 * @description Cryptographic utilities for Nostr
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySchnorrSignature = exports.signSchnorr = exports.customCrypto = exports.CustomCrypto = void 0;
exports.getPublicKey = getPublicKey;
exports.validateKeyPair = validateKeyPair;
exports.createEvent = createEvent;
exports.signEvent = signEvent;
exports.verifySignature = verifySignature;
exports.encryptMessage = encryptMessage;
exports.decryptMessage = decryptMessage;
const node_crypto_1 = require("node:crypto");
/**
 * Crypto implementation that works in both Node.js and browser environments
 */
class CustomCrypto {
    constructor() {
        if (typeof window !== 'undefined' && window.crypto) {
            this.subtle = window.crypto.subtle;
            this.getRandomValues = (array) => {
                return window.crypto.getRandomValues(array);
            };
        }
        else {
            this.subtle = node_crypto_1.webcrypto.subtle;
            this.getRandomValues = (array) => {
                return node_crypto_1.webcrypto.getRandomValues(array);
            };
        }
    }
}
exports.CustomCrypto = CustomCrypto;
// Create and export default instance
exports.customCrypto = new CustomCrypto();
const sha256_1 = require("@noble/hashes/sha256");
const utils_1 = require("@noble/hashes/utils");
const secp256k1_1 = require("@noble/curves/secp256k1");
const logger_1 = require("../utils/logger");
// Re-export schnorr functions for backward compatibility
exports.signSchnorr = secp256k1_1.schnorr.sign;
exports.verifySchnorrSignature = secp256k1_1.schnorr.verify;
/**
 * Gets the public key from a private key
 * @param privateKey - Private key in hex format
 * @returns Public key details
 */
async function getPublicKey(privateKey) {
    try {
        const publicKeyBytes = secp256k1_1.secp256k1.getPublicKey((0, utils_1.hexToBytes)(privateKey));
        const publicKeyHex = (0, utils_1.bytesToHex)(publicKeyBytes);
        return {
            hex: publicKeyHex,
            bytes: publicKeyBytes,
            schnorrHex: publicKeyHex,
            schnorrBytes: publicKeyBytes
        };
    }
    catch (error) {
        logger_1.logger.error({ error }, 'Failed to get public key');
        throw error;
    }
}
/**
 * Validates a key pair
 * @param keyPair - Key pair to validate
 * @returns True if valid
 */
async function validateKeyPair(keyPair) {
    try {
        const derivedPubKey = await getPublicKey(keyPair.privateKey);
        return derivedPubKey.hex === keyPair.publicKey.hex;
    }
    catch (error) {
        logger_1.logger.error({ error }, 'Failed to validate key pair');
        return false;
    }
}
/**
 * Creates a new event
 * @param event - Event data
 * @returns Created event
 */
function createEvent(event) {
    return {
        kind: event.kind || 1,
        created_at: event.created_at || Math.floor(Date.now() / 1000),
        tags: event.tags || [],
        content: event.content || '',
        pubkey: event.pubkey || ''
    };
}
/**
 * Signs an event
 * @param event - Event to sign
 * @param privateKey - Private key to sign with
 * @returns Signed event
 */
async function signEvent(event, privateKey) {
    try {
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
        logger_1.logger.error({ error }, 'Failed to sign event');
        throw error;
    }
}
/**
 * Gets the hex representation of a public key
 * @param pubkey - Public key in either hex or details format
 * @returns Hex representation of the public key
 */
function getPublicKeyHex(pubkey) {
    return typeof pubkey === 'string' ? pubkey : pubkey.hex;
}
/**
 * Verifies an event signature
 * @param event - Signed event to verify
 * @returns True if signature is valid
 */
async function verifySignature(event) {
    try {
        const pubkeyHex = getPublicKeyHex(event.pubkey);
        // Verify event ID matches content
        const serialized = JSON.stringify([
            0,
            pubkeyHex,
            event.created_at,
            event.kind,
            event.tags,
            event.content
        ]);
        const hash = (0, sha256_1.sha256)(new TextEncoder().encode(serialized));
        const expectedId = (0, utils_1.bytesToHex)(hash);
        if (event.id !== expectedId) {
            logger_1.logger.error({ calculated: expectedId, actual: event.id }, 'Event ID mismatch');
            return false;
        }
        // Verify signature
        const isValid = secp256k1_1.secp256k1.verify((0, utils_1.hexToBytes)(event.sig), hash, (0, utils_1.hexToBytes)(pubkeyHex));
        return isValid;
    }
    catch (error) {
        logger_1.logger.error({ error }, 'Verification error');
        return false;
    }
}
/**
 * Encrypts a message
 * @param message - Message to encrypt
 * @param privateKey - Sender's private key
 * @param recipientPubKey - Recipient's public key hex
 * @returns Encrypted message
 */
async function encryptMessage(message, privateKey, recipientPubKey) {
    try {
        // Validate keys
        if (!privateKey || !recipientPubKey) {
            throw new Error('Invalid keys provided');
        }
        // Validate key formats
        if (!privateKey.match(/^[0-9a-f]{64}$/i)) {
            throw new Error('Invalid private key format');
        }
        if (!recipientPubKey.match(/^[0-9a-f]{64}$/i)) {
            throw new Error('Invalid public key format');
        }
        // Generate shared secret using ECDH
        const sharedPoint = secp256k1_1.secp256k1.getSharedSecret(privateKey, '02' + recipientPubKey);
        const sharedSecret = sharedPoint.slice(1, 33);
        // Generate random IV
        const iv = (0, utils_1.randomBytes)(16);
        // Create encryption key
        const key = await exports.customCrypto.subtle.importKey('raw', sharedSecret, { name: 'AES-CBC', length: 256 }, true, ['encrypt']);
        // Encrypt
        const data = new TextEncoder().encode(message);
        const encrypted = await exports.customCrypto.subtle.encrypt({ name: 'AES-CBC', iv }, key, data);
        // Combine IV and ciphertext
        const combined = new Uint8Array(iv.length + encrypted.byteLength);
        combined.set(iv);
        combined.set(new Uint8Array(encrypted), iv.length);
        return Buffer.from(combined).toString('base64');
    }
    catch (error) {
        logger_1.logger.error({ error }, 'Failed to encrypt message');
        throw new Error('Encryption failed');
    }
}
/**
 * Decrypts a message
 * @param encryptedMessage - Encrypted message
 * @param privateKey - Recipient's private key
 * @param senderPubKey - Sender's public key hex
 * @returns Decrypted message
 * @throws Error if decryption fails
 */
async function decryptMessage(encryptedMessage, privateKey, senderPubKey) {
    // Validate keys
    if (!privateKey || !senderPubKey) {
        throw new Error('Invalid keys provided');
    }
    // Validate key formats
    if (!privateKey.match(/^[0-9a-f]{64}$/i)) {
        throw new Error('Invalid private key format');
    }
    if (!senderPubKey.match(/^[0-9a-f]{64}$/i)) {
        throw new Error('Invalid public key format');
    }
    try {
        // Split IV and ciphertext first to validate format
        const encryptedData = Buffer.from(encryptedMessage, 'base64');
        if (encryptedData.length < 16) {
            throw new Error('Invalid encrypted message format');
        }
        const iv = encryptedData.slice(0, 16);
        const ciphertext = encryptedData.slice(16);
        // Generate shared secret using ECDH
        const sharedPoint = secp256k1_1.secp256k1.getSharedSecret(privateKey, '02' + senderPubKey);
        const sharedSecret = sharedPoint.slice(1, 33);
        // Create decryption key
        const key = await exports.customCrypto.subtle.importKey('raw', sharedSecret, { name: 'AES-CBC', length: 256 }, true, ['decrypt']);
        // Decrypt
        const decrypted = await exports.customCrypto.subtle.decrypt({ name: 'AES-CBC', iv }, key, ciphertext).catch(() => {
            throw new Error('Invalid key or corrupted message');
        });
        // Convert to text
        let text;
        try {
            text = new TextDecoder().decode(decrypted);
        }
        catch (error) {
            throw new Error('Invalid key or corrupted message');
        }
        // Validate decrypted text
        if (!text || text.length === 0 || !text.match(/^[\x20-\x7E\s]*$/)) { // Only allow printable ASCII and whitespace
            throw new Error('Invalid key or corrupted message');
        }
        // Additional validation: check for random bytes that might decode to valid ASCII
        const entropy = text.split('').reduce((acc, char) => {
            const code = char.charCodeAt(0);
            return acc + (code >= 32 && code <= 126 ? 0 : 1);
        }, 0);
        if (entropy > text.length * 0.1) { // If more than 10% of characters are non-standard
            throw new Error('Invalid key or corrupted message');
        }
        return text;
    }
    catch (error) {
        logger_1.logger.error({ error }, 'Failed to decrypt message');
        throw error;
    }
}
//# sourceMappingURL=index.js.map