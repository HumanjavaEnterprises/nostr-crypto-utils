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
import { schnorr, secp256k1 } from '@noble/curves/secp256k1';
import { bytesToHex, hexToBytes } from '@noble/curves/abstract/utils';
import { sha256 } from '@noble/hashes/sha256';
import { randomBytes } from '@noble/hashes/utils';
import { logger } from './utils/logger';
// Get the appropriate crypto implementation
const getCrypto = async () => {
    if (typeof window !== 'undefined' && window.crypto) {
        return window.crypto;
    }
    if (typeof global !== 'undefined' && global.crypto) {
        return global.crypto;
    }
    try {
        const cryptoModule = await import('crypto');
        if (cryptoModule.webcrypto) {
            return cryptoModule.webcrypto;
        }
    }
    catch {
        logger.debug('Node crypto not available');
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
export const customCrypto = new CustomCrypto();
// Export schnorr functions
export const signSchnorr = schnorr.sign;
export const verifySchnorrSignature = schnorr.verify;
/**
 * Gets the compressed public key (33 bytes with prefix)
 */
export function getCompressedPublicKey(privateKeyBytes) {
    return secp256k1.getPublicKey(privateKeyBytes, true);
}
/**
 * Gets the schnorr public key (32 bytes x-coordinate) as per BIP340
 */
export function getSchnorrPublicKey(privateKeyBytes) {
    return schnorr.getPublicKey(privateKeyBytes);
}
/**
 * Generates a new key pair
 */
export async function generateKeyPair() {
    const privateKeyBytes = randomBytes(32);
    const privateKey = bytesToHex(privateKeyBytes);
    const publicKey = await getPublicKey(privateKey);
    return {
        privateKey,
        publicKey
    };
}
/**
 * Gets a public key from a private key
 */
export async function getPublicKey(privateKey) {
    try {
        const privateKeyBytes = hexToBytes(privateKey);
        const publicKeyBytes = schnorr.getPublicKey(privateKeyBytes);
        return {
            hex: bytesToHex(publicKeyBytes),
            bytes: publicKeyBytes
        };
    }
    catch (error) {
        logger.error({ error }, 'Failed to get public key');
        throw error;
    }
}
/**
 * Validates a key pair
 */
export async function validateKeyPair(keyPair) {
    try {
        const derivedPubKey = await getPublicKey(keyPair.privateKey);
        return derivedPubKey.hex === keyPair.publicKey.hex;
    }
    catch (error) {
        logger.error({ error }, 'Failed to validate key pair');
        return false;
    }
}
/**
 * Creates a new event
 */
export function createEvent(event) {
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
export async function signEvent(event, privateKey) {
    try {
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
        const eventHash = sha256(new TextEncoder().encode(serialized));
        // Convert private key to bytes and sign
        const privateKeyBytes = hexToBytes(privateKey);
        const signatureBytes = schnorr.sign(eventHash, privateKeyBytes);
        // Create signed event
        return {
            ...event,
            id: bytesToHex(eventHash),
            sig: bytesToHex(signatureBytes)
        };
    }
    catch (error) {
        logger.error({ error }, 'Failed to sign event');
        throw error;
    }
}
/**
 * Verifies an event signature
 */
export async function verifySignature(event) {
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
        const eventHash = sha256(new TextEncoder().encode(serialized));
        // Verify event ID
        const calculatedId = bytesToHex(eventHash);
        if (calculatedId !== event.id) {
            logger.error('Event ID mismatch');
            return false;
        }
        // Convert hex strings to bytes
        const signatureBytes = hexToBytes(event.sig);
        const pubkeyBytes = hexToBytes(event.pubkey);
        // Verify signature
        return schnorr.verify(signatureBytes, eventHash, pubkeyBytes);
    }
    catch (error) {
        logger.error({ error }, 'Failed to verify signature');
        return false;
    }
}
/**
 * Encrypts a message using NIP-04
 */
export async function encrypt(message, recipientPubKey, senderPrivKey) {
    try {
        const recipientPubKeyHex = typeof recipientPubKey === 'string' ? recipientPubKey : recipientPubKey.hex;
        const sharedPoint = secp256k1.getSharedSecret(hexToBytes(senderPrivKey), hexToBytes(recipientPubKeyHex));
        const sharedX = sharedPoint.slice(1, 33);
        // Generate random IV
        const iv = randomBytes(16);
        const key = await customCrypto.getSubtle().then((subtle) => subtle.importKey('raw', sharedX.buffer, { name: 'AES-CBC', length: 256 }, false, ['encrypt']));
        // Encrypt the message
        const data = new TextEncoder().encode(message);
        const encrypted = await customCrypto.getSubtle().then((subtle) => subtle.encrypt({ name: 'AES-CBC', iv }, key, data.buffer));
        // Combine IV and ciphertext
        const combined = new Uint8Array(iv.length + encrypted.byteLength);
        combined.set(iv);
        combined.set(new Uint8Array(encrypted), iv.length);
        return bytesToHex(combined);
    }
    catch (error) {
        logger.error({ error }, 'Failed to encrypt message');
        throw error;
    }
}
/**
 * Decrypts a message using NIP-04
 */
export async function decrypt(encryptedMessage, senderPubKey, recipientPrivKey) {
    try {
        const senderPubKeyHex = typeof senderPubKey === 'string' ? senderPubKey : senderPubKey.hex;
        const sharedPoint = secp256k1.getSharedSecret(hexToBytes(recipientPrivKey), hexToBytes(senderPubKeyHex));
        const sharedX = sharedPoint.slice(1, 33);
        const encrypted = hexToBytes(encryptedMessage);
        const iv = encrypted.slice(0, 16);
        const ciphertext = encrypted.slice(16);
        const key = await customCrypto.getSubtle().then((subtle) => subtle.importKey('raw', sharedX.buffer, { name: 'AES-CBC', length: 256 }, false, ['decrypt']));
        const decrypted = await customCrypto.getSubtle().then((subtle) => subtle.decrypt({ name: 'AES-CBC', iv }, key, ciphertext.buffer));
        return new TextDecoder().decode(decrypted);
    }
    catch (error) {
        logger.error({ error }, 'Failed to decrypt message');
        throw error;
    }
}
//# sourceMappingURL=crypto.js.map