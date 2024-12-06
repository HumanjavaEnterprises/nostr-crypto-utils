import { schnorr } from '@noble/curves/secp256k1';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { sha256 } from '@noble/hashes/sha256';
import { randomBytes } from '@noble/hashes/utils';
import * as secp256k1 from '@noble/secp256k1';
import { generateSecretKey, getPublicKey as getNostrPublicKey } from 'nostr-tools';
import { webcrypto } from 'node:crypto';
// Use Node.js crypto API
const crypto = webcrypto;
/**
 * Generate a private key for use with NOSTR
 */
export function generatePrivateKey() {
    return bytesToHex(generateSecretKey());
}
/**
 * Get a public key from a private key
 */
export function getPublicKey(privateKey) {
    return getNostrPublicKey(hexToBytes(privateKey));
}
/**
 * Generate a new key pair
 * @param seedPhrase Optional seed phrase to generate deterministic key pair
 */
export function generateKeyPair(seedPhrase) {
    if (seedPhrase) {
        // Use the seed phrase to generate a deterministic private key
        const encoder = new TextEncoder();
        const seedBytes = encoder.encode(seedPhrase);
        const hash = sha256(seedBytes);
        const privateKey = bytesToHex(hash);
        const publicKey = getPublicKey(privateKey);
        return { privateKey, publicKey };
    }
    const privateKey = generatePrivateKey();
    const publicKey = getPublicKey(privateKey);
    return { privateKey, publicKey };
}
/**
 * Get the hash of a NOSTR event
 */
export function getEventHash(event) {
    const serialized = JSON.stringify([
        0,
        event.pubkey,
        event.created_at,
        event.kind,
        event.tags,
        event.content,
    ]);
    const hash = sha256(new TextEncoder().encode(serialized));
    return bytesToHex(hash);
}
/**
 * Sign a NOSTR event
 */
export async function signEvent(event, privateKey) {
    const pubkey = getPublicKey(privateKey);
    const eventToSign = {
        ...event,
        pubkey,
        created_at: event.created_at || Math.floor(Date.now() / 1000),
        tags: event.tags || []
    };
    const hash = getEventHash(eventToSign);
    const sig = bytesToHex(await schnorr.sign(hexToBytes(hash), hexToBytes(privateKey)));
    return {
        ...eventToSign,
        id: hash,
        sig
    };
}
/**
 * Verify a signature
 */
export function verifySignature(event) {
    try {
        const hash = getEventHash({
            kind: event.kind,
            created_at: event.created_at,
            tags: event.tags,
            content: event.content,
            pubkey: event.pubkey
        });
        if (hash !== event.id) {
            return false;
        }
        return schnorr.verify(hexToBytes(event.sig), hexToBytes(hash), hexToBytes(event.pubkey));
    }
    catch (error) {
        return false;
    }
}
/**
 * Validate a key pair
 */
export function validateKeyPair(publicKey, privateKey) {
    try {
        const derivedPublicKey = getPublicKey(privateKey);
        if (derivedPublicKey !== publicKey) {
            return {
                isValid: false,
                error: 'Public key does not match private key'
            };
        }
        return { isValid: true };
    }
    catch (error) {
        return {
            isValid: false,
            error: 'Invalid key pair'
        };
    }
}
/**
 * Encrypt a message using NIP-04
 */
export async function encrypt(message, recipientPubKey, senderPrivKey) {
    const sharedPoint = secp256k1.getSharedSecret(senderPrivKey, '02' + recipientPubKey);
    const sharedX = sharedPoint.slice(1, 33);
    const iv = randomBytes(16);
    const textEncoder = new TextEncoder();
    const plaintext = textEncoder.encode(message);
    const key = await crypto.subtle.importKey('raw', sharedX, { name: 'AES-CBC', length: 256 }, false, ['encrypt']);
    const ciphertext = await crypto.subtle.encrypt({ name: 'AES-CBC', iv }, key, plaintext);
    const ctb64 = Buffer.from(new Uint8Array(ciphertext)).toString('base64');
    const ivb64 = Buffer.from(new Uint8Array(iv)).toString('base64');
    return `${ctb64}?iv=${ivb64}`;
}
/**
 * Decrypt a message using NIP-04
 */
export async function decrypt(encryptedMessage, senderPubKey, recipientPrivKey) {
    const [ctb64, ivb64] = encryptedMessage.split('?iv=');
    const sharedPoint = secp256k1.getSharedSecret(recipientPrivKey, '02' + senderPubKey);
    const sharedX = sharedPoint.slice(1, 33);
    const key = await crypto.subtle.importKey('raw', sharedX, { name: 'AES-CBC', length: 256 }, false, ['decrypt']);
    const iv = Buffer.from(ivb64, 'base64');
    const ciphertext = Buffer.from(ctb64, 'base64');
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-CBC', iv }, key, ciphertext);
    const textDecoder = new TextDecoder();
    return textDecoder.decode(new Uint8Array(decrypted));
}
