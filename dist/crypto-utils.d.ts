/**
 * @module crypto-utils
 * @description Cryptographic utilities for Nostr
 */
import { encryptMessage, decryptMessage } from './nips/nip-04.js';
import { customCrypto, signSchnorr, verifySchnorrSignature, generateKeyPair, getPublicKey, validateKeyPair, getCompressedPublicKey, getSchnorrPublicKey, createEvent, signEvent, verifySignature } from './crypto.js';
export { customCrypto, signSchnorr, verifySchnorrSignature, generateKeyPair, getPublicKey, validateKeyPair, getCompressedPublicKey, getSchnorrPublicKey, createEvent, signEvent, verifySignature, encryptMessage, decryptMessage };
//# sourceMappingURL=crypto-utils.d.ts.map