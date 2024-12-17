/**
 * @module nostr-crypto-utils
 * @description A comprehensive TypeScript library providing cryptographic utilities and protocol-compliant message handling for Nostr applications
 * @packageDocumentation
 */
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
import { NostrEventKind, NostrMessageType } from './types';
import { NOSTR_KIND, NOSTR_TAG } from './constants';
import { validateEvent, validateSignedEvent, validateFilter } from './validation';
import { isNostrEvent, isSignedNostrEvent } from './types/guards';
import { formatEventForRelay, parseNostrMessage, createMetadataEvent, extractReferencedEvents, formatSubscriptionForRelay, formatCloseForRelay, formatAuthForRelay, createTextNoteEvent, createDirectMessageEvent, createChannelMessageEvent, extractMentionedPubkeys, createKindFilter, createAuthorFilter, createReplyFilter } from './integration';
// Configure crypto for Node.js and test environments
let customCrypto;
if (typeof window !== 'undefined' && window.crypto) {
    // Browser environment
    customCrypto = window.crypto;
}
else if (typeof globalThis !== 'undefined' && globalThis.crypto) {
    // Node.js environment with crypto
    customCrypto = globalThis.crypto;
}
else {
    // Fallback to Node.js webcrypto
    customCrypto = webcrypto;
}
// Ensure crypto is available globally
if (typeof globalThis.crypto === 'undefined') {
    globalThis.crypto = customCrypto;
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
export async function generatePrivateKey() {
    logger.debug('Generating new private key');
    const privateKey = generateNostrPrivateKey();
    logger.debug({ privateKey }, 'Generated new private key');
    return privateKey;
}
/**
 * @category Key Management
 * @description Generates a new key pair for use in Nostr
 * @param {string} [seedPhrase] - Optional seed phrase for deterministic key generation
 * @returns {Promise<KeyPair>} Generated key pair
 * @example
 * ```typescript
 * const keyPair = await generateKeyPair();
 * console.log(keyPair.privateKey); // 'a1b2c3d4...'
 * console.log(keyPair.publicKey); // '02abc123...'
 * ```
 */
export async function generateKeyPair(seed) {
    let privateKeyBytes;
    const subtle = customCrypto.subtle;
    if (seed) {
        // Generate deterministic private key from seed
        const encoder = new TextEncoder();
        const seedHash = await subtle.digest('SHA-256', encoder.encode(seed));
        privateKeyBytes = new Uint8Array(seedHash);
    }
    else {
        // Generate random private key
        privateKeyBytes = crypto.getRandomValues(new Uint8Array(32));
    }
    // Convert to hex format
    const privateKeyHex = bytesToHex(privateKeyBytes);
    const publicKeyHex = getPublicKey(privateKeyHex);
    logger.debug({ publicKey: publicKeyHex }, 'Generated key pair');
    return {
        privateKey: privateKeyHex,
        publicKey: publicKeyHex,
    };
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
    try {
        // Normalize private key to 32 bytes
        let privateKeyBytes;
        if (privateKey.length === 64) {
            privateKeyBytes = hexToBytes(privateKey);
        }
        else if (privateKey.length === 32) {
            privateKeyBytes = new Uint8Array(privateKey.split('').map(c => c.charCodeAt(0)));
        }
        else {
            throw new Error('Invalid private key length');
        }
        const publicKeyBytes = schnorr.getPublicKey(privateKeyBytes);
        return bytesToHex(publicKeyBytes);
    }
    catch (error) {
        throw new Error(`Failed to derive public key: ${error instanceof Error ? error.message : 'unknown error'}`);
    }
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
export async function getEventHash(event) {
    logger.debug('Calculating event hash');
    const serialized = serializeEvent(event);
    const subtle = customCrypto.subtle;
    const hash = await subtle.digest('SHA-256', new TextEncoder().encode(serialized));
    const hashHex = bytesToHex(new Uint8Array(hash));
    logger.debug({ hash: hashHex }, 'Calculated event hash');
    return hashHex;
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
 * @returns {SignedNostrEvent} Signed event
 * @throws {Error} If signing fails
 * @example
 * ```typescript
 * const event = createEvent({
 *   kind: NostrEventKind.TEXT_NOTE,
 *   content: 'Hello Nostr!'
 * });
 * const signedEvent = signEvent(event, privateKey);
 * ```
 */
export function signEvent(event, privateKey) {
    try {
        // Convert hex private key to bytes
        if (privateKey.length !== 64) {
            throw new Error('Invalid private key length - must be 64 hex characters');
        }
        const privateKeyBytes = hexToBytes(privateKey);
        // Derive public key
        const pubkey = getPublicKey(privateKey);
        // Prepare event for signing
        const signedEvent = {
            ...event,
            pubkey,
            created_at: event.created_at ?? Math.floor(Date.now() / 1000),
            tags: event.tags ?? [],
            id: '', // Will be set after serialization
            sig: '' // Will be set after signing
        };
        // Calculate event ID
        const serializedEvent = JSON.stringify([
            0,
            signedEvent.pubkey,
            signedEvent.created_at,
            signedEvent.kind,
            signedEvent.tags,
            signedEvent.content,
        ]);
        // Generate event ID using SHA-256
        signedEvent.id = bytesToHex(sha256(new TextEncoder().encode(serializedEvent)));
        // Sign the event ID
        const signature = schnorr.sign(hexToBytes(signedEvent.id), privateKeyBytes);
        signedEvent.sig = bytesToHex(signature);
        logger.debug('Event signed successfully');
        return signedEvent;
    }
    catch (error) {
        logger.error({ error }, 'Failed to sign event');
        throw new Error(`Failed to sign event: ${error instanceof Error ? error.message : 'unknown error'}`);
    }
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
    try {
        // Verify event ID
        const serializedEvent = JSON.stringify([
            0,
            event.pubkey,
            event.created_at,
            event.kind,
            event.tags,
            event.content,
        ]);
        const expectedId = bytesToHex(sha256(new TextEncoder().encode(serializedEvent)));
        if (event.id !== expectedId) {
            return false;
        }
        // Verify signature
        return schnorr.verify(hexToBytes(event.sig), hexToBytes(event.id), hexToBytes(event.pubkey));
    }
    catch (error) {
        logger.error({ error }, 'Failed to verify event signature');
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
        const derivedPublicKey = getPublicKey(privateKey);
        const isValid = derivedPublicKey === publicKey;
        logger.debug({ isValid }, 'Validated key pair');
        return {
            isValid,
            error: isValid ? undefined : 'Public key does not match private key',
        };
    }
    catch (error) {
        logger.error({ error }, 'Failed to validate key pair');
        return {
            isValid: false,
            error: 'Invalid key pair',
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
    const key = await customCrypto.subtle.importKey('raw', hexToBytes(sharedKey), { name: 'AES-CBC', length: 256 }, false, ['encrypt']);
    const encoded = new TextEncoder().encode(message);
    const ciphertext = await customCrypto.subtle.encrypt({ name: 'AES-CBC', iv }, key, encoded);
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
    const key = await customCrypto.subtle.importKey('raw', hexToBytes(sharedKey), { name: 'AES-CBC', length: 256 }, false, ['decrypt']);
    const decrypted = await customCrypto.subtle.decrypt({ name: 'AES-CBC', iv }, key, ciphertext);
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
