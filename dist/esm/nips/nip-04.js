/**
 * @module nips/nip-04
 * @description Implementation of NIP-04 (Encrypted Direct Messages)
 * @see https://github.com/nostr-protocol/nips/blob/master/04.md
 */
import { secp256k1 } from '@noble/curves/secp256k1';
import { bytesToHex, hexToBytes } from '@noble/curves/abstract/utils';
import { logger } from '../utils/logger';
import cryptoBrowserify from 'crypto-browserify';
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
        logger.debug('Node crypto not available, falling back to crypto-browserify');
    }
    return cryptoBrowserify;
};
class CryptoImplementation {
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
const cryptoImpl = new CryptoImplementation();
/**
 * Encrypts a message using NIP-04 encryption
 * @param message - Message to encrypt
 * @param senderPrivKey - Sender's private key
 * @param recipientPubKey - Recipient's public key
 * @returns Encrypted message string
 */
export async function encryptMessage(message, senderPrivKey, recipientPubKey) {
    try {
        if (!message || !senderPrivKey || !recipientPubKey) {
            throw new Error('Invalid input parameters');
        }
        // Validate keys
        if (!/^[0-9a-f]{64}$/i.test(senderPrivKey)) {
            throw new Error('Invalid private key format');
        }
        // Ensure public key is in correct format
        const pubKeyHex = recipientPubKey.startsWith('02') || recipientPubKey.startsWith('03')
            ? recipientPubKey
            : '02' + recipientPubKey;
        // Generate shared secret
        const sharedPoint = secp256k1.getSharedSecret(senderPrivKey, pubKeyHex);
        const sharedX = sharedPoint.slice(1, 33); // Use only x-coordinate
        // Import key for AES
        const sharedKey = await (await cryptoImpl.getSubtle()).importKey('raw', sharedX, { name: 'AES-CBC', length: 256 }, false, ['encrypt']);
        // Generate IV and encrypt
        const iv = new Uint8Array(16);
        await cryptoImpl.getRandomValues(iv);
        const encrypted = await (await cryptoImpl.getSubtle()).encrypt({ name: 'AES-CBC', iv }, sharedKey, new TextEncoder().encode(message));
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
 * Decrypts a message using NIP-04 decryption
 * @param encryptedMessage - Encrypted message string
 * @param recipientPrivKey - Recipient's private key
 * @param senderPubKey - Sender's public key
 * @returns Decrypted message string
 */
export async function decryptMessage(encryptedMessage, recipientPrivKey, senderPubKey) {
    try {
        if (!encryptedMessage || !recipientPrivKey || !senderPubKey) {
            throw new Error('Invalid input parameters');
        }
        // Validate keys
        if (!/^[0-9a-f]{64}$/i.test(recipientPrivKey)) {
            throw new Error('Invalid private key format');
        }
        // Ensure public key is in correct format
        const pubKeyHex = senderPubKey.startsWith('02') || senderPubKey.startsWith('03')
            ? senderPubKey
            : '02' + senderPubKey;
        // Generate shared secret
        const sharedPoint = secp256k1.getSharedSecret(recipientPrivKey, pubKeyHex);
        const sharedX = sharedPoint.slice(1, 33); // Use only x-coordinate
        // Import key for AES
        const sharedKey = await (await cryptoImpl.getSubtle()).importKey('raw', sharedX, { name: 'AES-CBC', length: 256 }, false, ['decrypt']);
        // Split IV and ciphertext
        const encrypted = hexToBytes(encryptedMessage);
        const iv = encrypted.slice(0, 16);
        const ciphertext = encrypted.slice(16);
        // Decrypt
        const decrypted = await (await cryptoImpl.getSubtle()).decrypt({ name: 'AES-CBC', iv }, sharedKey, ciphertext);
        return new TextDecoder().decode(decrypted);
    }
    catch (error) {
        logger.error({ error }, 'Failed to decrypt message');
        throw error;
    }
}
/**
 * Generates a shared secret for NIP-04 encryption
 * @param privateKey - Private key
 * @param publicKey - Public key
 * @returns Shared secret
 */
export function generateSharedSecret(privateKey, publicKey) {
    try {
        if (!privateKey || !publicKey) {
            throw new Error('Invalid input parameters');
        }
        // Validate keys
        if (!/^[0-9a-f]{64}$/i.test(privateKey)) {
            throw new Error('Invalid private key format');
        }
        // Ensure public key is in correct format
        const pubKeyHex = publicKey.startsWith('02') || publicKey.startsWith('03')
            ? publicKey
            : '02' + publicKey;
        // Generate shared secret
        const sharedPoint = secp256k1.getSharedSecret(privateKey, pubKeyHex);
        return { sharedSecret: sharedPoint.slice(1, 33) }; // Return only x-coordinate
    }
    catch (error) {
        logger.error({ error }, 'Failed to generate shared secret');
        throw error;
    }
}
export { generateSharedSecret as computeSharedSecret };
//# sourceMappingURL=nip-04.js.map