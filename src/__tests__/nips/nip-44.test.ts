/**
 * @module test/nips/nip-44
 * @description Tests for NIP-44 (Versioned Encrypted Payloads)
 */

import { describe, it, expect } from 'vitest';
import { bytesToHex, randomBytes } from '@noble/hashes/utils.js';
import { schnorr } from '@noble/curves/secp256k1.js';
import { getConversationKey, encrypt, decrypt, calcPaddedLen } from '../../nips/nip-44';

describe('NIP-44', () => {
  // Generate two keypairs for testing
  const alicePriv = randomBytes(32);
  const bobPriv = randomBytes(32);

  // Derive public keys (schnorr x-only)
  const alicePub = bytesToHex(schnorr.getPublicKey(alicePriv));
  const bobPub = bytesToHex(schnorr.getPublicKey(bobPriv));

  describe('getConversationKey', () => {
    it('should derive a 32-byte conversation key', () => {
      const key = getConversationKey(alicePriv, bobPub);
      expect(key).toBeInstanceOf(Uint8Array);
      expect(key.length).toBe(32);
    });

    it('should produce the same key from both sides', () => {
      const keyAB = getConversationKey(alicePriv, bobPub);
      const keyBA = getConversationKey(bobPriv, alicePub);
      expect(bytesToHex(keyAB)).toBe(bytesToHex(keyBA));
    });
  });

  describe('calcPaddedLen', () => {
    it('should pad short messages to 32', () => {
      expect(calcPaddedLen(1)).toBe(32);
      expect(calcPaddedLen(16)).toBe(32);
      expect(calcPaddedLen(32)).toBe(32);
    });

    it('should pad longer messages correctly', () => {
      expect(calcPaddedLen(33)).toBe(64);
      expect(calcPaddedLen(64)).toBe(64);
      expect(calcPaddedLen(65)).toBe(96);
    });

    it('should reject invalid input', () => {
      expect(() => calcPaddedLen(0)).toThrow();
      expect(() => calcPaddedLen(-1)).toThrow();
      expect(() => calcPaddedLen(1.5)).toThrow();
    });
  });

  describe('encrypt / decrypt', () => {
    const conversationKey = getConversationKey(alicePriv, bobPub);

    it('should round-trip a simple message', () => {
      const plaintext = 'Hello NIP-44!';
      const encrypted = encrypt(plaintext, conversationKey);
      const decrypted = decrypt(encrypted, conversationKey);
      expect(decrypted).toBe(plaintext);
    });

    it('should round-trip unicode content', () => {
      const plaintext = 'Hello from the protocol layer!';
      const encrypted = encrypt(plaintext, conversationKey);
      const decrypted = decrypt(encrypted, conversationKey);
      expect(decrypted).toBe(plaintext);
    });

    it('should round-trip a long message', () => {
      const plaintext = 'A'.repeat(10000);
      const encrypted = encrypt(plaintext, conversationKey);
      const decrypted = decrypt(encrypted, conversationKey);
      expect(decrypted).toBe(plaintext);
    });

    it('should produce different ciphertexts for the same plaintext', () => {
      const plaintext = 'determinism test';
      const enc1 = encrypt(plaintext, conversationKey);
      const enc2 = encrypt(plaintext, conversationKey);
      expect(enc1).not.toBe(enc2);
    });

    it('should detect tampered ciphertext', () => {
      const plaintext = 'tamper test';
      const encrypted = encrypt(plaintext, conversationKey);
      // Flip a character in the middle of the base64 payload
      const chars = encrypted.split('');
      const mid = Math.floor(chars.length / 2);
      chars[mid] = chars[mid] === 'A' ? 'B' : 'A';
      const tampered = chars.join('');
      expect(() => decrypt(tampered, conversationKey)).toThrow();
    });

    it('should reject wrong conversation key', () => {
      const plaintext = 'wrong key test';
      const encrypted = encrypt(plaintext, conversationKey);
      const wrongKey = randomBytes(32);
      expect(() => decrypt(encrypted, wrongKey)).toThrow();
    });
  });
});
