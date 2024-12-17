/**
 * @module nostr-crypto-utils
 * @description A comprehensive TypeScript library providing cryptographic utilities and protocol-compliant message handling for Nostr applications
 * @packageDocumentation
 */
import { schnorr } from '@noble/curves/secp256k1';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { sha256 } from '@noble/hashes/sha256';
import * as secp256k1 from '@noble/secp256k1';
import { generatePrivateKey as generateNostrPrivateKey, getPublicKey as getNostrPublicKey } from 'nostr-tools';
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
import { NostrEventKind, NostrMessageType } from './types';
import { NOSTR_KIND, NOSTR_TAG } from './constants';
import { validateEvent, validateSignedEvent, validateFilter } from './validation';
import { isNostrEvent, isSignedNostrEvent } from './types/guards';
import { formatEventForRelay, parseNostrMessage, createMetadataEvent, extractReferencedEvents, formatSubscriptionForRelay, formatCloseForRelay, formatAuthForRelay, createTextNoteEvent, createDirectMessageEvent, createChannelMessageEvent, extractMentionedPubkeys, createKindFilter, createAuthorFilter, createReplyFilter } from './integration';
// Use Node.js crypto API
const crypto = webcrypto;
// Configure webcrypto for Node.js environment
if (typeof globalThis.crypto === 'undefined') {
    // @ts-ignore
    globalThis.crypto = webcrypto;
}
/**
 * @category Key Management
 * @description Generates a new private key for use in Nostr
 * @returns {string} A new private key in hex format
 * @example
 * ```typescript
 * const privateKey = generatePrivateKey();
 * console.log(privateKey); // 'a1b2c3d4...'
 * ```
 */
export function generatePrivateKey() {
    logger.debug('Generating new private key');
    const privateKeyBytes = generateNostrPrivateKey();
    const privateKey = bytesToHex(privateKeyBytes);
    logger.debug({ privateKey }, 'Generated new private key');
    return privateKey;
}
/**
 * @category Key Management
 * @description Derives a public key from a private key
 * @param {string} privateKey - Private key in hex format
 * @returns {string} Public key in hex format
 * @throws {Error} If the private key is invalid
 * @example
 * ```typescript
 * const publicKey = getPublicKey(privateKey);
 * console.log(publicKey); // '02abc123...'
 * ```
 */
export function getPublicKey(privateKey) {
    logger.debug('Deriving public key from private key');
    try {
        const privKeyBytes = hexToBytes(privateKey);
        const pubKeyBytes = getNostrPublicKey(privKeyBytes);
        const publicKey = bytesToHex(pubKeyBytes);
        logger.debug({ publicKey }, 'Successfully derived public key');
        return publicKey;
    }
    catch (error) {
        logger.error({ error }, 'Failed to derive public key');
        throw error;
    }
}
/**
 * @category Key Management
 * @description Generates a new key pair for use in Nostr
 * @param {string} [seedPhrase] - Optional seed phrase for deterministic key generation
 * @returns {KeyPair} Generated key pair
 * @example
 * ```typescript
 * const keyPair = generateKeyPair();
 * console.log(keyPair.privateKey); // 'a1b2c3d4...'
 * console.log(keyPair.publicKey); // '02abc123...'
 * ```
 */
export function generateKeyPair(seedPhrase) {
    logger.debug('Generating new key pair');
    if (seedPhrase) {
        // Use the seed phrase to generate a deterministic private key
        const seedHash = sha256(new TextEncoder().encode(seedPhrase));
        const privateKey = bytesToHex(seedHash);
        const publicKey = getPublicKey(privateKey);
        logger.debug({ publicKey, privateKey }, 'Generated new key pair with seed phrase');
        return { privateKey, publicKey };
    }
    // Generate a random key pair
    const privateKey = generatePrivateKey();
    const publicKey = getPublicKey(privateKey);
    logger.debug({ publicKey, privateKey }, 'Generated new random key pair');
    return { privateKey, publicKey };
}
/**
 * @category Event Operations
 * @description Calculates the hash of a Nostr event (NIP-01)
 * @param {NostrEvent} event - Event to hash
 * @returns {string} Event hash in hex format
 * @example
 * ```typescript
 * const event = createEvent({
 *   kind: NostrEventKind.TEXT_NOTE,
 *   content: 'Hello Nostr!'
 * });
 * const hash = getEventHash(event);
 * ```
 */
export function getEventHash(event) {
    logger.debug('Calculating event hash');
    const serialized = serializeEvent(event);
    const hash = bytesToHex(sha256(new TextEncoder().encode(serialized)));
    logger.debug({ hash }, 'Calculated event hash');
    return hash;
}
/**
 * @category Event Operations
 * @description Serializes a Nostr event for signing/hashing (NIP-01)
 * @param {NostrEvent} event - Event to serialize
 * @returns {string} Serialized event JSON string
 */
export function serializeEvent(event) {
    logger.debug('Serializing event');
    const serialized = JSON.stringify([
        0,
        event.pubkey,
        event.created_at,
        event.kind,
        event.tags,
        event.content
    ]);
    logger.debug({ serialized }, 'Serialized event');
    return serialized;
}
/**
 * @category Event Operations
 * @description Creates a new Nostr event with the specified parameters
 * @param {object} params - Event parameters
 * @param {NostrEventKind} params.kind - Event kind (NIP-01)
 * @param {string} params.content - Event content
 * @param {string[][]} [params.tags] - Event tags
 * @param {number} [params.created_at] - Event creation timestamp
 * @param {string} [params.pubkey] - Event author's public key
 * @returns {NostrEvent} Created event
 * @example
 * ```typescript
 * const event = createEvent({
 *   kind: NostrEventKind.TEXT_NOTE,
 *   content: 'Hello Nostr!',
 *   tags: [['p', recipientPubkey]]
 * });
 * ```
 */
export function createEvent(params) {
    logger.debug('Creating new event');
    const { kind, content, tags = [], created_at = Math.floor(Date.now() / 1000), pubkey = '' } = params;
    const event = {
        kind,
        content,
        created_at,
        tags,
        pubkey
    };
    logger.debug({ event }, 'Created new event');
    return event;
}
/**
 * @category Event Operations
 * @description Signs a Nostr event with a private key (NIP-01)
 * @param {NostrEvent} event - Event to sign
 * @param {string} privateKey - Private key in hex format
 * @returns {Promise<SignedNostrEvent>} Signed event
 * @throws {Error} If signing fails
 * @example
 * ```typescript
 * const event = createEvent({
 *   kind: NostrEventKind.TEXT_NOTE,
 *   content: 'Hello Nostr!'
 * });
 * const signedEvent = await signEvent(event, privateKey);
 * ```
 */
export async function signEvent(event, privateKey) {
    logger.debug('Signing event');
    const hash = getEventHash(event);
    const sig = await schnorr.sign(hexToBytes(hash), hexToBytes(privateKey));
    // Ensure pubkey is set in the signed event
    const pubkey = event.pubkey || getPublicKey(privateKey);
    const signedEvent = {
        ...event,
        id: hash,
        sig: bytesToHex(sig),
        pubkey, // Required in SignedNostrEvent
        created_at: event.created_at || Math.floor(Date.now() / 1000),
        tags: event.tags || []
    };
    logger.debug({ signedEvent }, 'Signed event');
    return signedEvent;
}
/**
 * @category Event Operations
 * @description Verifies the signature of a signed Nostr event (NIP-01)
 * @param {SignedNostrEvent} event - Event to verify
 * @returns {boolean} True if signature is valid
 * @example
 * ```typescript
 * const isValid = verifySignature(signedEvent);
 * if (isValid) {
 *   console.log('Event signature is valid');
 * }
 * ```
 */
export function verifySignature(event) {
    logger.debug('Verifying event signature');
    try {
        const hash = getEventHash(event);
        const isValid = schnorr.verify(hexToBytes(event.sig), hexToBytes(hash), event.pubkey);
        logger.debug({ isValid }, 'Verified event signature');
        return isValid;
    }
    catch {
        logger.error('Failed to verify event signature');
        return false;
    }
}
/**
 * @category Key Management
 * @description Validates a Nostr key pair
 * @param {string} publicKey - Public key in hex format
 * @param {string} privateKey - Private key in hex format
 * @returns {ValidationResult} Validation result
 * @example
 * ```typescript
 * const validation = validateKeyPair(publicKey, privateKey);
 * if (validation.isValid) {
 *   console.log('Key pair is valid');
 * } else {
 *   console.error('Validation error:', validation.error);
 * }
 * ```
 */
export function validateKeyPair(publicKey, privateKey) {
    logger.debug('Validating key pair');
    try {
        const derivedPubKey = getPublicKey(privateKey);
        const isValid = derivedPubKey === publicKey;
        const result = {
            isValid,
            error: isValid ? undefined : 'Public key does not match private key'
        };
        logger.debug({ result }, 'Validated key pair');
        return result;
    }
    catch (error) {
        logger.error({ error }, 'Failed to validate key pair');
        return {
            isValid: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
/**
 * @category Encryption
 * @description Encrypts a message using NIP-04 encryption
 * @param {string} message - Message to encrypt
 * @param {string} recipientPubKey - Recipient's public key
 * @param {string} senderPrivKey - Sender's private key
 * @returns {Promise<string>} Encrypted message
 * @throws {Error} If encryption fails
 * @example
 * ```typescript
 * const encrypted = await encrypt(
 *   'Hello Alice!',
 *   alicePubKey,
 *   bobPrivKey
 * );
 * ```
 */
export async function encrypt(message, recipientPubKey, senderPrivKey) {
    logger.debug('Encrypting message');
    const shared = secp256k1.getSharedSecret(senderPrivKey, '02' + recipientPubKey);
    const sharedKey = bytesToHex(shared).substring(2);
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const key = await crypto.subtle.importKey('raw', hexToBytes(sharedKey), { name: 'AES-CBC', length: 256 }, false, ['encrypt']);
    const encoded = new TextEncoder().encode(message);
    const ciphertext = await crypto.subtle.encrypt({ name: 'AES-CBC', iv }, key, encoded);
    const combined = new Uint8Array(iv.length + new Uint8Array(ciphertext).length);
    combined.set(iv);
    combined.set(new Uint8Array(ciphertext), iv.length);
    const encrypted = bytesToHex(combined);
    logger.debug({ encrypted }, 'Encrypted message');
    return encrypted;
}
/**
 * @category Encryption
 * @description Decrypts a message using NIP-04 decryption
 * @param {string} encryptedMessage - Encrypted message
 * @param {string} senderPubKey - Sender's public key
 * @param {string} recipientPrivKey - Recipient's private key
 * @returns {Promise<string>} Decrypted message
 * @throws {Error} If decryption fails
 * @example
 * ```typescript
 * const decrypted = await decrypt(
 *   encrypted,
 *   bobPubKey,
 *   alicePrivKey
 * );
 * ```
 */
export async function decrypt(encryptedMessage, senderPubKey, recipientPrivKey) {
    logger.debug('Decrypting message');
    const shared = secp256k1.getSharedSecret(recipientPrivKey, '02' + senderPubKey);
    const sharedKey = bytesToHex(shared).substring(2);
    const encrypted = hexToBytes(encryptedMessage);
    const iv = encrypted.slice(0, 16);
    const ciphertext = encrypted.slice(16);
    const key = await crypto.subtle.importKey('raw', hexToBytes(sharedKey), { name: 'AES-CBC', length: 256 }, false, ['decrypt']);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-CBC', iv }, key, ciphertext);
    const message = new TextDecoder().decode(decrypted);
    logger.debug({ message }, 'Decrypted message');
    return message;
}
// Export all functions and types
export { NostrEventKind, NostrMessageType, 
// Constants
NOSTR_KIND, NOSTR_TAG, 
// Validation
validateEvent, validateSignedEvent, validateFilter, 
// Type Guards
isNostrEvent, isSignedNostrEvent, 
// Integration
formatEventForRelay, parseNostrMessage, createMetadataEvent, extractReferencedEvents, formatSubscriptionForRelay, formatCloseForRelay, formatAuthForRelay, createTextNoteEvent, createDirectMessageEvent, createChannelMessageEvent, extractMentionedPubkeys, createKindFilter, createAuthorFilter, createReplyFilter };
