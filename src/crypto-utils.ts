/**
 * @module crypto-utils
 * @description Cryptographic utilities for Nostr
 */

import { encryptMessage, decryptMessage } from './nips/nip-04.js';
import {
  signSchnorr,
  verifySchnorrSignature,
  generateKeyPair,
  getPublicKey,
  validateKeyPair,
  getCompressedPublicKey,
  getSchnorrPublicKey,
  createEvent,
  signEvent,
  verifySignature
} from './crypto.js';

export {
  // Core crypto functionality
  signSchnorr,
  verifySchnorrSignature,
  
  // Key management
  generateKeyPair,
  getPublicKey,
  validateKeyPair,
  getCompressedPublicKey,
  getSchnorrPublicKey,
  
  // Event handling
  createEvent,
  signEvent,
  verifySignature,
  
  // Message encryption (NIP-04)
  encryptMessage,
  decryptMessage
};
