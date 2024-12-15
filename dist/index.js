import { schnorr } from '@noble/curves/secp256k1';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { sha256 } from '@noble/hashes/sha256';
import { randomBytes } from '@noble/hashes/utils';
import * as secp256k1 from '@noble/secp256k1';
import { generateSecretKey, getPublicKey as getNostrPublicKey } from 'nostr-tools';
import { webcrypto } from 'node:crypto';
import { NostrEventKind, NostrMessageType } from './types';
import { NOSTR_KIND, NOSTR_TAG } from './constants';
import { validateEvent, validateSignedEvent, validateFilter } from './validation';
import { isNostrEvent, isSignedNostrEvent } from './types/guards';
import { formatEventForRelay, parseNostrMessage, createMetadataEvent, extractReferencedEvents, formatSubscriptionForRelay, formatCloseForRelay, formatAuthForRelay, createTextNoteEvent, createDirectMessageEvent, createChannelMessageEvent, extractMentionedPubkeys, createKindFilter, createAuthorFilter, createReplyFilter } from './integration';
// Use Node.js crypto API
const crypto = webcrypto;
// Export enums and constants
export { NostrMessageType, NostrEventKind, NOSTR_KIND, NOSTR_TAG };
// Function implementations
function generatePrivateKey() {
    return bytesToHex(generateSecretKey());
}
function getPublicKey(privateKey) {
    return getNostrPublicKey(hexToBytes(privateKey));
}
function generateKeyPair(seedPhrase) {
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
function getEventHash(event) {
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
function createEvent(params) {
    return {
        kind: params.kind,
        content: params.content,
        tags: params.tags || [],
        created_at: params.created_at || Math.floor(Date.now() / 1000),
        pubkey: params.pubkey || '' // This will be filled in when signing if not provided
    };
}
async function signEvent(event, privateKey) {
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
function verifySignature(event) {
    try {
        // Create a NostrEvent object from the SignedNostrEvent
        const eventData = {
            kind: event.kind,
            created_at: event.created_at,
            tags: event.tags,
            content: event.content,
            pubkey: event.pubkey
        };
        const hash = getEventHash(eventData);
        if (hash !== event.id) {
            return false;
        }
        return schnorr.verify(hexToBytes(event.sig), hexToBytes(hash), hexToBytes(event.pubkey));
    }
    catch (error) {
        return false;
    }
}
function validateKeyPair(publicKey, privateKey) {
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
async function encrypt(message, recipientPubKey, senderPrivKey) {
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
async function decrypt(encryptedMessage, senderPubKey, recipientPrivKey) {
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
// Export all functions
export { 
// Core functions
generatePrivateKey, getPublicKey, generateKeyPair, validateKeyPair, createEvent, signEvent, verifySignature, encrypt, decrypt, 
// Integration functions
formatEventForRelay, formatSubscriptionForRelay, formatCloseForRelay, formatAuthForRelay, parseNostrMessage, createMetadataEvent, createTextNoteEvent, createDirectMessageEvent, createChannelMessageEvent, extractReferencedEvents, extractMentionedPubkeys, createKindFilter, createAuthorFilter, createReplyFilter, 
// Validation functions
validateEvent, validateSignedEvent, validateFilter, isNostrEvent, isSignedNostrEvent };
