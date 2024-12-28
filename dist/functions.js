import { schnorr } from '@noble/curves/secp256k1';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { sha256 } from '@noble/hashes/sha256';
import * as secp256k1 from '@noble/secp256k1';
import { generatePrivateKey as generateNostrPrivateKey } from 'nostr-tools';
import { webcrypto } from 'node:crypto';
import pino from 'pino';
const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
});
// Configure crypto for Node.js and test environments
let customCrypto;
if (typeof window !== 'undefined' && window.crypto) {
    customCrypto = window.crypto;
}
else {
    customCrypto = webcrypto;
}
export async function generatePrivateKey() {
    return generateNostrPrivateKey();
}
export async function generateKeyPair(seed) {
    const privateKey = await generatePrivateKey();
    const publicKey = getPublicKey(privateKey);
    return { privateKey, publicKey };
}
export function getPublicKey(privateKey) {
    return secp256k1.getPublicKey(privateKey, true);
}
export async function getEventHash(event) {
    const serialized = serializeEvent(event);
    const hash = await sha256(new TextEncoder().encode(serialized));
    return bytesToHex(hash);
}
export function serializeEvent(event) {
    return JSON.stringify([
        0,
        event.pubkey,
        event.created_at,
        event.kind,
        event.tags,
        event.content
    ]);
}
export function createEvent(params) {
    const { kind, content, tags = [], created_at = Math.floor(Date.now() / 1000), pubkey = '' } = params;
    return {
        kind,
        content,
        tags,
        created_at,
        pubkey,
    };
}
export function signEvent(event, privateKey) {
    const hash = getEventHash(event);
    const sig = secp256k1.sign(hash, privateKey);
    return {
        ...event,
        id: hash,
        sig: sig.toCompactHex(),
    };
}
export function verifySignature(event) {
    try {
        const hash = getEventHash(event);
        return schnorr.verify(event.sig, hash, event.pubkey);
    }
    catch (error) {
        logger.error('Failed to verify signature:', error);
        return false;
    }
}
export function validateKeyPair(publicKey, privateKey) {
    try {
        const derivedPublicKey = getPublicKey(privateKey);
        const isValid = derivedPublicKey === publicKey;
        return {
            isValid,
            error: isValid ? undefined : 'Public key does not match private key'
        };
    }
    catch (error) {
        return {
            isValid: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
export async function encrypt(message, recipientPubKey, senderPrivKey) {
    try {
        const sharedSecret = secp256k1.getSharedSecret(senderPrivKey, '02' + recipientPubKey);
        const sharedKey = await customCrypto.subtle.importKey('raw', sharedSecret.slice(1), { name: 'AES-CBC', length: 256 }, true, ['encrypt']);
        const iv = crypto.getRandomValues(new Uint8Array(16));
        const encrypted = await customCrypto.subtle.encrypt({ name: 'AES-CBC', iv }, sharedKey, new TextEncoder().encode(message));
        const encryptedArray = new Uint8Array(encrypted);
        const combined = new Uint8Array(iv.length + encryptedArray.length);
        combined.set(iv);
        combined.set(encryptedArray, iv.length);
        return bytesToHex(combined);
    }
    catch (error) {
        logger.error('Failed to encrypt:', error);
        throw error;
    }
}
export async function decrypt(encryptedMessage, senderPubKey, recipientPrivKey) {
    try {
        const sharedSecret = secp256k1.getSharedSecret(recipientPrivKey, '02' + senderPubKey);
        const sharedKey = await customCrypto.subtle.importKey('raw', sharedSecret.slice(1), { name: 'AES-CBC', length: 256 }, true, ['decrypt']);
        const encrypted = hexToBytes(encryptedMessage);
        const iv = encrypted.slice(0, 16);
        const ciphertext = encrypted.slice(16);
        const decrypted = await customCrypto.subtle.decrypt({ name: 'AES-CBC', iv }, sharedKey, ciphertext);
        return new TextDecoder().decode(decrypted);
    }
    catch (error) {
        logger.error('Failed to decrypt:', error);
        throw error;
    }
}
