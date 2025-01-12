/**
 * @module nips/nip-04
 * @description Implementation of NIP-04 (Encrypted Direct Messages)
 * @see https://github.com/nostr-protocol/nips/blob/master/04.md
 */
import type { CryptoSubtle } from '../crypto';
declare global {
    interface Window {
        crypto: CryptoSubtle;
    }
    interface Global {
        crypto: CryptoSubtle;
    }
}
interface SharedSecret {
    sharedSecret: Uint8Array;
}
/**
 * Encrypts a message using NIP-04 encryption
 * @param message - Message to encrypt
 * @param senderPrivKey - Sender's private key
 * @param recipientPubKey - Recipient's public key
 * @returns Encrypted message string
 */
export declare function encryptMessage(message: string, senderPrivKey: string, recipientPubKey: string): Promise<string>;
/**
 * Decrypts a message using NIP-04 decryption
 * @param encryptedMessage - Encrypted message string
 * @param recipientPrivKey - Recipient's private key
 * @param senderPubKey - Sender's public key
 * @returns Decrypted message string
 */
export declare function decryptMessage(encryptedMessage: string, recipientPrivKey: string, senderPubKey: string): Promise<string>;
/**
 * Generates a shared secret for NIP-04 encryption
 * @param privateKey - Private key
 * @param publicKey - Public key
 * @returns Shared secret
 */
export declare function generateSharedSecret(privateKey: string, publicKey: string): SharedSecret;
export {};
//# sourceMappingURL=nip-04.d.ts.map