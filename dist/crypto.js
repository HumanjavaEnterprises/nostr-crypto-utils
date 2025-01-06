/**
 * @module crypto
 * @description Cryptographic utilities for Nostr
 */
import { webcrypto } from 'node:crypto';
import { schnorr, secp256k1 } from '@noble/curves/secp256k1';
import { bytesToHex, hexToBytes } from '@noble/curves/abstract/utils';
import { sha256 } from '@noble/hashes/sha256';
import { randomBytes } from '@noble/hashes/utils';
import { logger } from './utils/logger.js';
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
            this.subtle = webcrypto.subtle;
            this.getRandomValues = webcrypto.getRandomValues.bind(webcrypto);
        }
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
 * Gets the public key from a private key
 */
export async function getPublicKey(privateKey) {
    try {
        const publicKeyBytes = secp256k1.getPublicKey(hexToBytes(privateKey));
        const publicKeyHex = bytesToHex(publicKeyBytes);
        return {
            hex: publicKeyHex
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
export async function validateKeyPair(publicKey, privateKey) {
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
        // Serialize event for signing
        const serialized = JSON.stringify([
            0,
            event.pubkey,
            event.created_at,
            event.kind,
            event.tags,
            event.content
        ]);
        const hash = sha256(new TextEncoder().encode(serialized));
        const sig = secp256k1.sign(hash, hexToBytes(privateKey));
        const sigBytes = new Uint8Array(sig.toCompactRawBytes());
        return {
            ...event,
            sig: bytesToHex(sigBytes),
            id: bytesToHex(hash)
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
        // Serialize event for verification
        const serialized = JSON.stringify([
            0,
            event.pubkey,
            event.created_at,
            event.kind,
            event.tags,
            event.content
        ]);
        const hash = sha256(new TextEncoder().encode(serialized));
        const pubkeyHex = typeof event.pubkey === 'string' ? event.pubkey : event.pubkey;
        // Verify signature
        const isValid = secp256k1.verify(hexToBytes(event.sig), hash, hexToBytes(pubkeyHex));
        return isValid;
    }
    catch (error) {
        logger.error({ error }, 'Verification error');
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
        const sharedX = sharedPoint.subarray(1, 33);
        // Generate random IV
        const iv = randomBytes(16);
        const key = await customCrypto.subtle.importKey('raw', sharedX, { name: 'AES-CBC', length: 256 }, false, ['encrypt']);
        // Encrypt the message
        const data = new TextEncoder().encode(message);
        const encrypted = await customCrypto.subtle.encrypt({ name: 'AES-CBC', iv }, key, data);
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
        const sharedX = sharedPoint.subarray(1, 33);
        const encrypted = hexToBytes(encryptedMessage);
        const iv = encrypted.slice(0, 16);
        const ciphertext = encrypted.slice(16);
        const key = await customCrypto.subtle.importKey('raw', sharedX, { name: 'AES-CBC', length: 256 }, false, ['decrypt']);
        const decrypted = await customCrypto.subtle.decrypt({ name: 'AES-CBC', iv }, key, ciphertext);
        return new TextDecoder().decode(decrypted);
    }
    catch (error) {
        logger.error({ error }, 'Failed to decrypt message');
        throw error;
    }
}
//# sourceMappingURL=crypto.js.map