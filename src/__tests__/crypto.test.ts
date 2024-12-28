import { describe, it, expect } from 'vitest';
import {
  generateKeyPair,
  getPublicKey,
  validateKeyPair,
  signEvent,
  verifySignature,
  encrypt,
  decrypt,
  createEvent
} from '../index';
import type { NostrEvent, PublicKey } from '../types/index';
import { bytesToHex } from '@noble/hashes/utils';

describe('NOSTR Crypto Utils', () => {
  describe('Key Management', () => {
    it('should generate valid key pairs', async () => {
      const keyPair = await generateKeyPair();
      expect(keyPair.privateKey).toBeDefined();
      expect(keyPair.publicKey).toBeDefined();
      expect(keyPair.privateKey).toHaveLength(64);
      expect(keyPair.publicKey.bytes).toBeInstanceOf(Uint8Array);
      expect(bytesToHex(keyPair.publicKey.bytes)).toHaveLength(64);
    });

    it('should derive the correct public key', async () => {
      const keyPair = await generateKeyPair();
      const derivedPubKey = await getPublicKey(keyPair.privateKey);
      expect(derivedPubKey.bytes).toEqual(keyPair.publicKey.bytes);
    });

    it('should validate key pairs', async () => {
      const keyPair = await generateKeyPair();
      const result = await validateKeyPair(keyPair.publicKey, keyPair.privateKey);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should generate consistent key pairs from seed phrase', async () => {
      const seedPhrase = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
      const keyPair1 = await generateKeyPair(seedPhrase);
      const keyPair2 = await generateKeyPair(seedPhrase);
      
      expect(keyPair1.privateKey).toBe(keyPair2.privateKey);
      expect(keyPair1.publicKey.bytes).toEqual(keyPair2.publicKey.bytes);
    });
  });

  describe('Event Operations', () => {
    it('should sign and verify events', async () => {
      const keyPair = await generateKeyPair();
      const event = createEvent({
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: 'Hello NOSTR!',
        pubkey: keyPair.publicKey
      });

      const signedEvent = await signEvent(event, keyPair.privateKey);
      expect(signedEvent.sig).toBeDefined();
      expect(signedEvent.id).toBeDefined();
      expect(signedEvent.pubkey.bytes).toEqual(keyPair.publicKey.bytes);

      const isValid = await verifySignature(signedEvent);
      expect(isValid).toBe(true);
    });

    it('should reject an invalid signature', async () => {
      const keyPair = await generateKeyPair();
      const event = createEvent({
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: 'Hello NOSTR!',
        pubkey: keyPair.publicKey
      });

      const signedEvent = await signEvent(event, keyPair.privateKey);
      signedEvent.sig = '00'.repeat(32); // Invalid signature
      const isValid = await verifySignature(signedEvent);
      expect(isValid).toBe(false);
    });
  });

  describe('Encryption/Decryption', () => {
    it('should encrypt and decrypt messages', async () => {
      const alice = await generateKeyPair();
      const bob = await generateKeyPair();
      const message = 'Secret message for Bob';

      const encrypted = await encrypt(message, bob.publicKey, alice.privateKey);
      const decrypted = await decrypt(encrypted, alice.publicKey, bob.privateKey);

      expect(decrypted).toBe(message);
    });

    it('should fail to decrypt with wrong keys', async () => {
      const alice = await generateKeyPair();
      const bob = await generateKeyPair();
      const eve = await generateKeyPair();
      const message = 'Secret message for Bob';

      const encrypted = await encrypt(message, bob.publicKey, alice.privateKey);

      // Eve tries to decrypt with her private key
      await expect(decrypt(encrypted, alice.publicKey, eve.privateKey)).rejects.toThrow();
    });
  });

  describe('verifySignature', () => {
    it('should verify a valid signature', async () => {
      const keyPair = await generateKeyPair();
      const event = createEvent({
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: 'Hello NOSTR!',
        pubkey: keyPair.publicKey
      });

      const signedEvent = await signEvent(event, keyPair.privateKey);
      const isValid = await verifySignature(signedEvent);
      expect(isValid).toBe(true);
    });

    it('should reject an invalid signature', async () => {
      const keyPair = await generateKeyPair();
      const event = createEvent({
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: 'Hello NOSTR!',
        pubkey: keyPair.publicKey
      });

      const signedEvent = await signEvent(event, keyPair.privateKey);
      signedEvent.sig = '00'.repeat(32); // Invalid signature
      const isValid = await verifySignature(signedEvent);
      expect(isValid).toBe(false);
    });

    it('should reject if event hash does not match', async () => {
      const keyPair = await generateKeyPair();
      const event = createEvent({
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: 'Hello NOSTR!',
        pubkey: keyPair.publicKey
      });

      const signedEvent = await signEvent(event, keyPair.privateKey);
      signedEvent.content = 'Modified content'; // This changes the event hash
      const isValid = await verifySignature(signedEvent);
      expect(isValid).toBe(false);
    });

    it('should handle invalid hex in signature', async () => {
      const keyPair = await generateKeyPair();
      const event = createEvent({
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: 'Hello NOSTR!',
        pubkey: keyPair.publicKey
      });

      const signedEvent = await signEvent(event, keyPair.privateKey);
      signedEvent.sig = 'invalid hex'; // Invalid hex string
      const isValid = await verifySignature(signedEvent);
      expect(isValid).toBe(false);
    });
  });

  describe('signEvent', () => {
    it('should sign an event with all fields', async () => {
      const keyPair = await generateKeyPair();
      const event = createEvent({
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [['e', 'event1'], ['p', 'pubkey1']],
        content: 'Hello NOSTR!',
        pubkey: keyPair.publicKey
      });

      const signedEvent = await signEvent(event, keyPair.privateKey);
      expect(signedEvent.sig).toBeDefined();
      expect(signedEvent.id).toBeDefined();
      expect(signedEvent.pubkey.bytes).toEqual(keyPair.publicKey.bytes);
      expect(signedEvent.content).toBe('Hello NOSTR!');
      expect(signedEvent.tags).toEqual([['e', 'event1'], ['p', 'pubkey1']]);
    });

    it('should handle missing optional fields', async () => {
      const keyPair = await generateKeyPair();
      const event = createEvent({
        kind: 1,
        pubkey: keyPair.publicKey
      });

      const signedEvent = await signEvent(event, keyPair.privateKey);
      expect(signedEvent.sig).toBeDefined();
      expect(signedEvent.id).toBeDefined();
      expect(signedEvent.content).toBe('');
      expect(signedEvent.tags).toEqual([]);
    });

    it('should handle undefined tags', async () => {
      const keyPair = await generateKeyPair();
      const event = createEvent({
        kind: 1,
        content: 'Hello NOSTR!',
        pubkey: keyPair.publicKey
      });

      const signedEvent = await signEvent(event, keyPair.privateKey);
      expect(signedEvent.sig).toBeDefined();
      expect(signedEvent.id).toBeDefined();
      expect(signedEvent.tags).toEqual([]);
    });

    it('should handle undefined created_at', async () => {
      const keyPair = await generateKeyPair();
      const event = createEvent({
        kind: 1,
        content: 'Hello NOSTR!',
        tags: [],
        pubkey: keyPair.publicKey
      });

      const signedEvent = await signEvent(event, keyPair.privateKey);
      expect(signedEvent.sig).toBeDefined();
      expect(signedEvent.id).toBeDefined();
      expect(signedEvent.created_at).toBeDefined();
      expect(typeof signedEvent.created_at).toBe('number');
    });
  });
});
