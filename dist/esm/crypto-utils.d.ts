/**
 * @module crypto-utils
 * @description Cryptographic utilities for Nostr
 */
import { encryptMessage, decryptMessage } from './nips/nip-04';
import { customCrypto, signSchnorr, verifySchnorrSignature, generateKeyPair, getPublicKey, validateKeyPair, getCompressedPublicKey, getSchnorrPublicKey, createEvent, signEvent, verifySignature } from './crypto';
export { customCrypto, signSchnorr, verifySchnorrSignature, generateKeyPair, getPublicKey, validateKeyPair, getCompressedPublicKey, getSchnorrPublicKey, createEvent, signEvent, verifySignature, encryptMessage, decryptMessage };
//# sourceMappingURL=crypto-utils.d.ts.map