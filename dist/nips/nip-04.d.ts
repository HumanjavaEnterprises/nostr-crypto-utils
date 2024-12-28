/**
 * @module nips/nip-04
 * @description Implementation of NIP-04: Encrypted Direct Message
 * @see https://github.com/nostr-protocol/nips/blob/master/04.md
 */
/**
 * Encrypts a message using NIP-04 encryption
 * @param message - Message to encrypt
 * @param recipientPubKey - Recipient's public key
 * @param senderPrivKey - Sender's private key
 * @returns Encrypted message
 */
export declare function encrypt(message: string, recipientPubKey: string, senderPrivKey: string): Promise<string>;
/**
 * Decrypts a message using NIP-04 decryption
 * @param encryptedMessage - Encrypted message
 * @param senderPubKey - Sender's public key
 * @param recipientPrivKey - Recipient's private key
 * @returns Decrypted message
 */
export declare function decrypt(encryptedMessage: string, senderPubKey: string, recipientPrivKey: string): Promise<string>;
/**
 * Generates a shared secret for NIP-04 encryption
 * @param privateKey - Private key
 * @param publicKey - Public key
 * @returns Shared secret
 */
export declare function getSharedSecret(privateKey: string, publicKey: string): Uint8Array;
