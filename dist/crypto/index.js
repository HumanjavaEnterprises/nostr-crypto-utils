/**
 * @module crypto
 * @description Cryptographic utilities for Nostr
 */
import { webcrypto } from 'node:crypto';
/**
 * Crypto implementation that works in both Node.js and browser environments
 */
export class CustomCrypto {
    constructor() {
        if (typeof window !== 'undefined' && window.crypto) {
            this.subtle = window.crypto.subtle;
            this.getRandomValues = (array) => {
                return window.crypto.getRandomValues(array);
            };
        }
        else {
            this.subtle = webcrypto.subtle;
            this.getRandomValues = (array) => {
                return webcrypto.getRandomValues(array);
            };
        }
    }
}
// Create and export default instance
export const customCrypto = new CustomCrypto();
// Export crypto functions
export { generateKeyPair, getPublicKey, validateKeyPair } from './keys';
export { createEvent, signEvent, verifySignature } from './events';
export { encrypt as encryptMessage, decrypt as decryptMessage } from './encryption';
export { generateKeyPair as generatePrivateKey } from './keys';
