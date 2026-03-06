/**
 * @module test/nips/nip-49
 * @description Tests for NIP-49 (Private Key Encryption / ncryptsec)
 */

import { describe, it, expect } from 'vitest';
import { bytesToHex, randomBytes } from '@noble/hashes/utils.js';
import { encrypt, decrypt } from '../../nips/nip-49';

describe('NIP-49', () => {
  // Use a fast scrypt log2(N) for tests (logn=1 → N=2, ~instant)
  const testLogn = 1;

  describe('encrypt / decrypt', () => {
    it('should round-trip a secret key', () => {
      const sec = randomBytes(32);
      const password = 'test-password-123';
      const ncryptsec = encrypt(sec, password, testLogn);

      expect(ncryptsec).toMatch(/^ncryptsec1/);

      const decrypted = decrypt(ncryptsec, password);
      expect(bytesToHex(decrypted)).toBe(bytesToHex(sec));
    });

    it('should produce different ncryptsec for same key (random salt/nonce)', () => {
      const sec = randomBytes(32);
      const password = 'determinism-test';
      const enc1 = encrypt(sec, password, testLogn);
      const enc2 = encrypt(sec, password, testLogn);
      expect(enc1).not.toBe(enc2);
    });

    it('should reject wrong password', () => {
      const sec = randomBytes(32);
      const ncryptsec = encrypt(sec, 'correct-password', testLogn);
      expect(() => decrypt(ncryptsec, 'wrong-password')).toThrow();
    });

    it('should reject invalid prefix', () => {
      expect(() => decrypt('nsec1invaliddata', 'password')).toThrow();
    });

    it('should handle unicode passwords via NFKC normalization', () => {
      const sec = randomBytes(32);
      const password = '\u00e9'; // é (precomposed)
      const ncryptsec = encrypt(sec, password, testLogn);
      // Same character decomposed then NFKC-normalized should work
      const decrypted = decrypt(ncryptsec, '\u0065\u0301'); // e + combining accent
      expect(bytesToHex(decrypted)).toBe(bytesToHex(sec));
    });

    it('should accept different key security bytes', () => {
      const sec = randomBytes(32);
      const password = 'ksb-test';

      const enc0 = encrypt(sec, password, testLogn, 0x00);
      const enc1 = encrypt(sec, password, testLogn, 0x01);
      const enc2 = encrypt(sec, password, testLogn, 0x02);

      // All should decrypt successfully
      expect(bytesToHex(decrypt(enc0, password))).toBe(bytesToHex(sec));
      expect(bytesToHex(decrypt(enc1, password))).toBe(bytesToHex(sec));
      expect(bytesToHex(decrypt(enc2, password))).toBe(bytesToHex(sec));
    });
  });
});
