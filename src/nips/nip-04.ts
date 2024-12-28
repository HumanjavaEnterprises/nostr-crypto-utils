/**
 * @module nips/nip-04
 * @description Implementation of NIP-04: Encrypted Direct Message
 * @see https://github.com/nostr-protocol/nips/blob/master/04.md
 */

import * as secp256k1 from '@noble/secp256k1';
import { webcrypto } from 'node:crypto';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { logger } from '../utils';

// Configure crypto for Node.js and test environments
let customCrypto: any;

if (typeof window !== 'undefined' && window.crypto) {
  customCrypto = window.crypto;
} else {
  customCrypto = webcrypto;
}

/**
 * Encrypts a message using NIP-04 encryption
 * @param message - Message to encrypt
 * @param recipientPubKey - Recipient's public key
 * @param senderPrivKey - Sender's private key
 * @returns Encrypted message
 */
export async function encrypt(
  message: string,
  recipientPubKey: string,
  senderPrivKey: string
): Promise<string> {
  try {
    const sharedSecret = secp256k1.getSharedSecret(senderPrivKey, '02' + recipientPubKey);
    const sharedKey = await customCrypto.subtle.importKey(
      'raw',
      sharedSecret.slice(1),
      { name: 'AES-CBC', length: 256 },
      true,
      ['encrypt']
    );
    
    const iv = customCrypto.getRandomValues(new Uint8Array(16));
    const encrypted = await customCrypto.subtle.encrypt(
      { name: 'AES-CBC', iv },
      sharedKey,
      new TextEncoder().encode(message)
    );
    
    const encryptedArray = new Uint8Array(encrypted);
    const combined = new Uint8Array(iv.length + encryptedArray.length);
    combined.set(iv);
    combined.set(encryptedArray, iv.length);
    
    return bytesToHex(combined);
  } catch (error) {
    logger.error('Failed to encrypt message:', error);
    throw error;
  }
}

/**
 * Decrypts a message using NIP-04 decryption
 * @param encryptedMessage - Encrypted message
 * @param senderPubKey - Sender's public key
 * @param recipientPrivKey - Recipient's private key
 * @returns Decrypted message
 */
export async function decrypt(
  encryptedMessage: string,
  senderPubKey: string,
  recipientPrivKey: string
): Promise<string> {
  try {
    const sharedSecret = secp256k1.getSharedSecret(recipientPrivKey, '02' + senderPubKey);
    const sharedKey = await customCrypto.subtle.importKey(
      'raw',
      sharedSecret.slice(1),
      { name: 'AES-CBC', length: 256 },
      true,
      ['decrypt']
    );
    
    const encrypted = hexToBytes(encryptedMessage);
    const iv = encrypted.slice(0, 16);
    const ciphertext = encrypted.slice(16);
    
    const decrypted = await customCrypto.subtle.decrypt(
      { name: 'AES-CBC', iv },
      sharedKey,
      ciphertext
    );
    
    return new TextDecoder().decode(decrypted);
  } catch (error) {
    logger.error('Failed to decrypt message:', error);
    throw error;
  }
}

/**
 * Generates a shared secret for NIP-04 encryption
 * @param privateKey - Private key
 * @param publicKey - Public key
 * @returns Shared secret
 */
export function getSharedSecret(
  privateKey: string,
  publicKey: string
): Uint8Array {
  try {
    return secp256k1.getSharedSecret(privateKey, '02' + publicKey).slice(1);
  } catch (error) {
    logger.error('Failed to generate shared secret:', error);
    throw error;
  }
}
