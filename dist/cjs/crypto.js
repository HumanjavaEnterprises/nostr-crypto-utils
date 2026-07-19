"use strict";
/**
 * @module crypto
 * @description Cryptographic utilities for Nostr
 *
 * IMPORTANT: Nostr Protocol Cryptographic Requirements
 * While secp256k1 is the underlying elliptic curve used by Nostr, the protocol specifically
 * requires schnorr signatures as defined in NIP-01. This means:
 *
 * 1. Always use schnorr-specific functions:
 *    - schnorr.getPublicKey() for public key generation
 *    - schnorr.sign() for signing
 *    - schnorr.verify() for verification
 *
 * 2. Avoid using secp256k1 functions directly:
 *    - DON'T use secp256k1.getPublicKey()
 *    - DON'T use secp256k1.sign()
 *    - DON'T use secp256k1.verify()
 *
 * While both might work in some cases (as they use the same curve), the schnorr signature
 * scheme has specific requirements for key and signature formats that aren't guaranteed
 * when using the lower-level secp256k1 functions directly.
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
exports.verifySchnorrSignature = exports.signSchnorr = exports.customCrypto = void 0;
exports.getCompressedPublicKey = getCompressedPublicKey;
exports.getSchnorrPublicKey = getSchnorrPublicKey;
exports.generateKeyPair = generateKeyPair;
exports.getPublicKey = getPublicKey;
exports.validateKeyPair = validateKeyPair;
exports.createEvent = createEvent;
exports.signEvent = signEvent;
exports.getPublicKeySync = getPublicKeySync;
exports.finalizeEvent = finalizeEvent;
exports.verifySignature = verifySignature;
const secp256k1_js_1 = require("@noble/curves/secp256k1.js");
const utils_js_1 = require("@noble/hashes/utils.js");
const sha2_js_1 = require("@noble/hashes/sha2.js");
const logger_js_1 = require("./utils/logger.js");
// Get the appropriate crypto implementation
const getCrypto = async () => {
    if (typeof window !== 'undefined' && window.crypto) {
        return window.crypto;
    }
    if (typeof global !== 'undefined' && global.crypto) {
        return global.crypto;
    }
    try {
        const cryptoModule = await Promise.resolve().then(() => __importStar(require('crypto')));
        if (cryptoModule.webcrypto) {
            return cryptoModule.webcrypto;
        }
    }
    catch {
        logger_js_1.logger.debug('Node crypto not available');
    }
    throw new Error('No WebCrypto implementation available');
};
/**
 * Crypto implementation that works in both Node.js and browser environments
 */
class CustomCrypto {
    cryptoInstance = null;
    initPromise;
    constructor() {
        this.initPromise = this.initialize();
    }
    async initialize() {
        this.cryptoInstance = await getCrypto();
    }
    async ensureInitialized() {
        await this.initPromise;
        if (!this.cryptoInstance) {
            throw new Error('Crypto implementation not initialized');
        }
        return this.cryptoInstance;
    }
    async getSubtle() {
        const crypto = await this.ensureInitialized();
        return crypto.subtle;
    }
    async getRandomValues(array) {
        const crypto = await this.ensureInitialized();
        return crypto.getRandomValues(array);
    }
}
// Create and export default instance
exports.customCrypto = new CustomCrypto();
// Export schnorr functions
exports.signSchnorr = secp256k1_js_1.schnorr.sign;
exports.verifySchnorrSignature = secp256k1_js_1.schnorr.verify;
/**
 * Gets the compressed public key (33 bytes with prefix)
 */
function getCompressedPublicKey(privateKeyBytes) {
    return secp256k1_js_1.secp256k1.getPublicKey(privateKeyBytes, true);
}
/**
 * Gets the schnorr public key (32 bytes x-coordinate) as per BIP340
 */
function getSchnorrPublicKey(privateKeyBytes) {
    return secp256k1_js_1.schnorr.getPublicKey(privateKeyBytes);
}
/**
 * Generates a new key pair
 */
async function generateKeyPair() {
    const privateKeyBytes = (0, utils_js_1.randomBytes)(32);
    const privateKey = (0, utils_js_1.bytesToHex)(privateKeyBytes);
    privateKeyBytes.fill(0); // zero source material
    const publicKey = await getPublicKey(privateKey);
    return {
        privateKey,
        publicKey
    };
}
/**
 * Gets a public key from a private key
 */
async function getPublicKey(privateKey) {
    try {
        const privateKeyBytes = (0, utils_js_1.hexToBytes)(privateKey);
        const publicKeyBytes = secp256k1_js_1.schnorr.getPublicKey(privateKeyBytes);
        return {
            hex: (0, utils_js_1.bytesToHex)(publicKeyBytes),
            bytes: publicKeyBytes
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
async function validateKeyPair(keyPair) {
    try {
        const derivedPubKey = await getPublicKey(keyPair.privateKey);
        return derivedPubKey.hex === keyPair.publicKey.hex;
    }
    catch (error) {
        logger_js_1.logger.error({ error }, 'Failed to validate key pair');
        return false;
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
        kind: event.kind ?? 1
    };
}
/**
 * Normalize a private key to hex string (accepts both hex string and Uint8Array)
 */
function normalizePrivateKey(privateKey) {
    if (privateKey instanceof Uint8Array) {
        return (0, utils_js_1.bytesToHex)(privateKey);
    }
    return privateKey;
}
/**
 * Signs an event
 * @param event - Event to sign
 * @param privateKey - Private key as hex string or Uint8Array
 */
async function signEvent(event, privateKey) {
    try {
        const privateKeyHex = normalizePrivateKey(privateKey);
        // Serialize event for signing (NIP-01 format)
        const serialized = JSON.stringify([
            0,
            event.pubkey,
            event.created_at,
            event.kind,
            event.tags,
            event.content
        ]);
        // Calculate event hash
        const eventHash = (0, sha2_js_1.sha256)(new TextEncoder().encode(serialized));
        // Convert private key to bytes and sign
        const privateKeyBytes = (0, utils_js_1.hexToBytes)(privateKeyHex);
        const signatureBytes = secp256k1_js_1.schnorr.sign(eventHash, privateKeyBytes);
        // Create signed event
        return {
            ...event,
            id: (0, utils_js_1.bytesToHex)(eventHash),
            sig: (0, utils_js_1.bytesToHex)(signatureBytes)
        };
    }
    catch (error) {
        logger_js_1.logger.error({ error }, 'Failed to sign event');
        throw error;
    }
}
/**
 * Gets a public key hex string from a private key (synchronous)
 * @param privateKey - Private key as hex string or Uint8Array
 * @returns Hex-encoded public key (32-byte x-only schnorr key)
 */
function getPublicKeySync(privateKey) {
    const privateKeyBytes = privateKey instanceof Uint8Array
        ? privateKey
        : (0, utils_js_1.hexToBytes)(privateKey);
    const publicKeyBytes = secp256k1_js_1.schnorr.getPublicKey(privateKeyBytes);
    return (0, utils_js_1.bytesToHex)(publicKeyBytes);
}
/**
 * Creates, hashes, and signs a Nostr event in one step
 * @param event - Partial event (kind, content, tags required; pubkey derived if missing)
 * @param privateKey - Private key as hex string or Uint8Array
 * @returns Fully signed event with id, pubkey, and sig
 */
async function finalizeEvent(event, privateKey) {
    const pubkey = event.pubkey || getPublicKeySync(privateKey);
    const timestamp = event.created_at || Math.floor(Date.now() / 1000);
    const fullEvent = {
        kind: event.kind ?? 1,
        created_at: timestamp,
        tags: event.tags || [],
        content: event.content || '',
        pubkey,
    };
    return signEvent(fullEvent, privateKey);
}
/**
 * Verifies an event signature
 */
async function verifySignature(event) {
    try {
        // Serialize event for verification (NIP-01 format)
        const serialized = JSON.stringify([
            0,
            event.pubkey,
            event.created_at,
            event.kind,
            event.tags,
            event.content
        ]);
        // Calculate event hash
        const eventHash = (0, sha2_js_1.sha256)(new TextEncoder().encode(serialized));
        // Verify event ID
        const calculatedId = (0, utils_js_1.bytesToHex)(eventHash);
        if (calculatedId !== event.id) {
            logger_js_1.logger.error('Event ID mismatch');
            return false;
        }
        // Convert hex strings to bytes
        const signatureBytes = (0, utils_js_1.hexToBytes)(event.sig);
        const pubkeyBytes = (0, utils_js_1.hexToBytes)(event.pubkey);
        // Verify signature
        return secp256k1_js_1.schnorr.verify(signatureBytes, eventHash, pubkeyBytes);
    }
    catch (error) {
        logger_js_1.logger.error({ error }, 'Failed to verify signature');
        return false;
    }
}
//# sourceMappingURL=crypto.js.map