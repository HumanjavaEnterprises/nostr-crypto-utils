/**
 * @module nostr-crypto-utils
 * @description A comprehensive TypeScript library providing cryptographic utilities and protocol-compliant message handling for Nostr applications
 * @packageDocumentation
 */
import type { KeyPair, NostrEvent, SignedNostrEvent, ValidationResult, EncryptionResult, NostrFilter, NostrSubscription, NostrMessage, NostrResponse, NostrError } from './types';
import { NostrEventKind, NostrMessageType } from './types';
import { NOSTR_KIND, NOSTR_TAG } from './constants';
import { validateEvent, validateSignedEvent, validateFilter } from './validation';
import { isNostrEvent, isSignedNostrEvent } from './types/guards';
import { formatEventForRelay, parseNostrMessage, createMetadataEvent, extractReferencedEvents, formatSubscriptionForRelay, formatCloseForRelay, formatAuthForRelay, createTextNoteEvent, createDirectMessageEvent, createChannelMessageEvent, extractMentionedPubkeys, createKindFilter, createAuthorFilter, createReplyFilter } from './integration';
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
export declare function generatePrivateKey(): Promise<string>;
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
export declare function generateKeyPair(seed?: string): Promise<{
    privateKey: string;
    publicKey: string;
}>;
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
export declare function getPublicKey(privateKey: string): string;
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
export declare function getEventHash(event: NostrEvent): Promise<string>;
/**
 * @category Event Operations
 * @description Serializes a Nostr event for signing/hashing (NIP-01)
 * @param {NostrEvent} event - Event to serialize
 * @returns {string} Serialized event JSON string
 */
export declare function serializeEvent(event: NostrEvent): string;
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
export declare function createEvent(params: {
    kind: NostrEventKind;
    content: string;
    tags?: string[][];
    created_at?: number;
    pubkey?: string;
}): NostrEvent;
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
export declare function signEvent(event: NostrEvent, privateKey: string): SignedNostrEvent;
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
export declare function verifySignature(event: SignedNostrEvent): boolean;
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
export declare function validateKeyPair(publicKey: string, privateKey: string): ValidationResult;
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
export declare function encrypt(message: string, recipientPubKey: string, senderPrivKey: string): Promise<string>;
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
export declare function decrypt(encryptedMessage: string, senderPubKey: string, recipientPrivKey: string): Promise<string>;
export { KeyPair, NostrEvent, SignedNostrEvent, ValidationResult, EncryptionResult, NostrFilter, NostrSubscription, NostrMessage, NostrResponse, NostrError, NostrEventKind, NostrMessageType, NOSTR_KIND, NOSTR_TAG, validateEvent, validateSignedEvent, validateFilter, isNostrEvent, isSignedNostrEvent, formatEventForRelay, parseNostrMessage, createMetadataEvent, extractReferencedEvents, formatSubscriptionForRelay, formatCloseForRelay, formatAuthForRelay, createTextNoteEvent, createDirectMessageEvent, createChannelMessageEvent, extractMentionedPubkeys, createKindFilter, createAuthorFilter, createReplyFilter };
