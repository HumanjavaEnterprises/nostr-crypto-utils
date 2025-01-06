/**
 * @module nips/nip-04
 * @description Implementation of NIP-04 (Encrypted Direct Messages)
 * @see https://github.com/nostr-protocol/nips/blob/master/04.md
 */
import * as secp256k1 from '@noble/secp256k1';
import { webcrypto } from 'node:crypto';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { logger } from '../utils/logger';
let customCrypto;
if (typeof window !== 'undefined' && window.crypto) {
    customCrypto = window.crypto;
}
else {
    customCrypto = webcrypto;
}
/**
 * Encrypts a message using NIP-04 encryption
 * @param message - Message to encrypt
 * @param recipientPubKey - Recipient's public key
 * @param senderPrivKey - Sender's private key
 * @returns Encrypted message string
 */
export async function encryptMessage(message, recipientPubKey, senderPrivKey) {
    try {
        const sharedSecret = secp256k1.getSharedSecret(senderPrivKey, '02' + recipientPubKey);
        const sharedKey = await customCrypto.subtle.importKey('raw', sharedSecret.slice(1), { name: 'AES-CBC', length: 256 }, true, ['encrypt']);
        const iv = customCrypto.getRandomValues(new Uint8Array(16));
        const encrypted = await customCrypto.subtle.encrypt({ name: 'AES-CBC', iv }, sharedKey, new TextEncoder().encode(message));
        const encryptedArray = new Uint8Array(encrypted);
        const combined = new Uint8Array(iv.length + encryptedArray.length);
        combined.set(iv);
        combined.set(encryptedArray, iv.length);
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
 * @param senderPubKey - Sender's public key
 * @param recipientPrivKey - Recipient's private key
 * @returns Decrypted message string
 */
export async function decryptMessage(encryptedMessage, senderPubKey, recipientPrivKey) {
    try {
        const combined = hexToBytes(encryptedMessage);
        const iv = combined.slice(0, 16);
        const ciphertext = combined.slice(16);
        const sharedSecret = secp256k1.getSharedSecret(recipientPrivKey, '02' + senderPubKey);
        const sharedKey = await customCrypto.subtle.importKey('raw', sharedSecret.slice(1), { name: 'AES-CBC', length: 256 }, true, ['decrypt']);
        const decrypted = await customCrypto.subtle.decrypt({ name: 'AES-CBC', iv }, sharedKey, ciphertext);
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
    const sharedPoint = secp256k1.getSharedSecret(privateKey, '02' + publicKey);
    return { sharedSecret: sharedPoint.slice(1) };
}
//# sourceMappingURL=nip-04.js.map