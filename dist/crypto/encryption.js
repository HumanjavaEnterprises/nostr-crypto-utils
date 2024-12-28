/**
 * @module crypto/encryption
 * @description Functions for encrypting and decrypting messages using NIP-04
 */
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { randomBytes } from '@noble/hashes/utils';
import { sha256 } from '@noble/hashes/sha256';
import * as secp256k1 from '@noble/secp256k1';
/**
 * Encrypts a message using NIP-04
 */
export async function encrypt(message, recipientPubKey, senderPrivKey) {
    try {
        const recipientPubKeyHex = typeof recipientPubKey === 'string'
            ? recipientPubKey
            : recipientPubKey.hex;
        // Convert hex strings to Uint8Array
        const senderPrivKeyBytes = hexToBytes(senderPrivKey);
        const recipientPubKeyBytes = hexToBytes(recipientPubKeyHex);
        // Generate shared secret using secp256k1
        const sharedPoint = secp256k1.getSharedSecret(senderPrivKeyBytes, recipientPubKeyBytes);
        const sharedSecret = sha256(sharedPoint.slice(1)); // Remove the prefix byte
        // Generate initialization vector
        const iv = randomBytes(16);
        // Encrypt the message
        const encoder = new TextEncoder();
        const messageBytes = encoder.encode(message);
        const key = await crypto.subtle.importKey('raw', sharedSecret, { name: 'AES-CBC' }, false, ['encrypt']);
        const encryptedBytes = await crypto.subtle.encrypt({ name: 'AES-CBC', iv }, key, messageBytes);
        // Combine IV and ciphertext and encode as base64
        const combined = new Uint8Array(iv.length + encryptedBytes.byteLength);
        combined.set(iv);
        combined.set(new Uint8Array(encryptedBytes), iv.length);
        return bytesToHex(combined);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error('Encryption failed: ' + errorMessage);
    }
}
/**
 * Decrypts a message using NIP-04
 */
export async function decrypt(encryptedMessage, senderPubKey, recipientPrivKey) {
    try {
        const senderPubKeyHex = typeof senderPubKey === 'string'
            ? senderPubKey
            : senderPubKey.hex;
        // Convert hex strings to Uint8Array
        const recipientPrivKeyBytes = hexToBytes(recipientPrivKey);
        const senderPubKeyBytes = hexToBytes(senderPubKeyHex);
        const encryptedBytes = hexToBytes(encryptedMessage);
        // Generate shared secret using secp256k1
        const sharedPoint = secp256k1.getSharedSecret(recipientPrivKeyBytes, senderPubKeyBytes);
        const sharedSecret = sha256(sharedPoint.slice(1)); // Remove the prefix byte
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
