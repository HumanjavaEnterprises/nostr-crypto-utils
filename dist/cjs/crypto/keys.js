"use strict";
/**
 * @module crypto/keys
 * @description Key pair generation and validation for Nostr
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPublicKey = createPublicKey;
exports.generateKeyPair = generateKeyPair;
exports.getPublicKey = getPublicKey;
exports.validateKeyPair = validateKeyPair;
exports.validatePublicKey = validatePublicKey;
exports.getCompressedPublicKey = getCompressedPublicKey;
exports.getSchnorrPublicKey = getSchnorrPublicKey;
const secp256k1_1 = require("@noble/curves/secp256k1");
const utils_1 = require("@noble/hashes/utils");
const sha256_1 = require("@noble/hashes/sha256");
const logger_1 = require("../utils/logger");
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
 * Creates a PublicKeyDetails object from a hex string
 */
function createPublicKey(hex) {
    const bytes = (0, utils_1.hexToBytes)(hex);
    // For schnorr, we need to remove the first byte (compression prefix)
    const schnorrBytes = bytes.length === 33 ? bytes.slice(1) : bytes;
    return {
        hex,
        bytes,
        schnorrHex: (0, utils_1.bytesToHex)(schnorrBytes),
        schnorrBytes
    };
}
/**
 * Generates a new key pair for use in Nostr
 */
async function generateKeyPair(seedPhrase) {
    try {
        let privateKeyBytes;
        if (seedPhrase) {
            // Generate deterministic private key from seed
            privateKeyBytes = (0, sha256_1.sha256)(new TextEncoder().encode(seedPhrase));
            // Ensure it's a valid private key
            if (!secp256k1_1.secp256k1.utils.isValidPrivateKey(privateKeyBytes)) {
                // If not valid, hash it again
                privateKeyBytes = (0, sha256_1.sha256)(privateKeyBytes);
            }
        }
        else {
            // Generate random private key
            privateKeyBytes = secp256k1_1.secp256k1.utils.randomPrivateKey();
        }
        // Convert private key to hex
        const privateKey = (0, utils_1.bytesToHex)(privateKeyBytes);
        // Get compressed public key for hex (33 bytes)
        const compressedPubKey = getCompressedPublicKey(privateKeyBytes);
        // Get schnorr public key (32 bytes)
        const schnorrPubKey = getSchnorrPublicKey(privateKeyBytes);
        return {
            privateKey,
            publicKey: {
                hex: (0, utils_1.bytesToHex)(compressedPubKey),
                bytes: compressedPubKey,
                schnorrHex: (0, utils_1.bytesToHex)(schnorrPubKey),
                schnorrBytes: schnorrPubKey
            }
        };
    }
    catch (error) {
        logger_1.logger.error({ error }, 'Failed to generate key pair');
        throw error;
    }
}
/**
 * Gets the public key from a private key
 */
function getPublicKey(privateKey) {
    try {
        const privateKeyBytes = (0, utils_1.hexToBytes)(privateKey);
        // Get compressed public key (33 bytes)
        const compressedPubKey = getCompressedPublicKey(privateKeyBytes);
        // Get schnorr public key (32 bytes)
        const schnorrPubKey = getSchnorrPublicKey(privateKeyBytes);
        return {
            hex: (0, utils_1.bytesToHex)(compressedPubKey),
            bytes: compressedPubKey,
            schnorrHex: (0, utils_1.bytesToHex)(schnorrPubKey),
            schnorrBytes: schnorrPubKey
        };
    }
    catch (error) {
        logger_1.logger.error({ error }, 'Failed to derive public key');
        throw error;
    }
}
/**
 * Validates a key pair
 */
async function validateKeyPair(publicKey, privateKey) {
    try {
        // Convert private key to bytes
        const privateKeyBytes = (0, utils_1.hexToBytes)(privateKey);
        // Check if private key is valid
        if (!secp256k1_1.secp256k1.utils.isValidPrivateKey(privateKeyBytes)) {
            return {
                isValid: false,
                error: 'Invalid private key'
            };
        }
        // Derive public key from private key
        const derivedPublicKey = getPublicKey(privateKey);
        // Get hex string from PublicKey if it's a string
        const pubkeyHex = typeof publicKey === 'string' ? publicKey : publicKey.hex;
        // Compare derived public key with provided public key
        const publicKeysMatch = derivedPublicKey.hex === pubkeyHex;
        if (!publicKeysMatch) {
            return {
                isValid: false,
                error: 'Public key does not match private key'
            };
        }
        return {
            isValid: true
        };
    }
    catch (error) {
        logger_1.logger.error({ error }, 'Failed to validate key pair');
        return {
            isValid: false,
            error: 'Failed to validate key pair: ' + (error instanceof Error ? error.message : String(error))
        };
    }
}
/**
 * Validates a Nostr public key
 */
function validatePublicKey(publicKey) {
    try {
        const bytes = (0, utils_1.hexToBytes)(publicKey);
        if (bytes.length !== 32)
            return false;
        secp256k1_1.secp256k1.ProjectivePoint.fromHex(publicKey); // Just check if valid
        return true;
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=keys.js.map