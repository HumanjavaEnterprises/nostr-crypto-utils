/**
 * @module crypto-utils
 * @description Cryptographic utilities for Nostr
 */
import { encryptMessage, decryptMessage } from './nips/nip-04.js';
import { customCrypto, signSchnorr, verifySchnorrSignature, generateKeyPair, getPublicKey, validateKeyPair, getCompressedPublicKey, getSchnorrPublicKey, createEvent, signEvent, verifySignature } from './crypto.js';
export { 
// Core crypto functionality
customCrypto, signSchnorr, verifySchnorrSignature, 
// Key management
generateKeyPair, getPublicKey, validateKeyPair, getCompressedPublicKey, getSchnorrPublicKey, 
// Event handling
createEvent, signEvent, verifySignature, 
// Message encryption (NIP-04)
encryptMessage, decryptMessage };
//# sourceMappingURL=crypto-utils.js.map