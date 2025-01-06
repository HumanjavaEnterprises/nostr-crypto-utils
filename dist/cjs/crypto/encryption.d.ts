/**
 * @module crypto/encryption
 * @description Functions for encrypting and decrypting messages using NIP-04
 */
import { PublicKey } from '../types/base';
/**
 * Encrypts a message using NIP-04
 */
export declare function encrypt(message: string, recipientPubKey: PublicKey | string, senderPrivKey: string): Promise<string>;
/**
 * Decrypts a message using NIP-04
 */
export declare function decrypt(encryptedMessage: string, senderPubKey: PublicKey | string, recipientPrivKey: string): Promise<string>;
//# sourceMappingURL=encryption.d.ts.map