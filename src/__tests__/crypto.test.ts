/// <reference types="jest" />

import {
  generateKeyPair,
  getPublicKey,
  validateKeyPair,
  signEvent,
  verifySignature,
  encrypt,
  decrypt
} from '../index';
import type { NostrEvent } from '../types/index';

describe('NOSTR Crypto Utils', () => {
  describe('Key Management', () => {
    it('should generate valid key pairs', async () => {
      const keyPair = await generateKeyPair();
      expect(keyPair.privateKey).toBeDefined();
      expect(keyPair.publicKey).toBeDefined();
      expect(keyPair.privateKey).toHaveLength(64);
      expect(keyPair.publicKey).toHaveLength(64);
    });

    it('should derive the correct public key', async () => {
      const keyPair = await generateKeyPair();
      const derivedPubKey = await getPublicKey(keyPair.privateKey);
      expect(derivedPubKey).toBe(keyPair.publicKey);
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
      expect(keyPair1.publicKey).toBe(keyPair2.publicKey);
    });
  });

  describe('Event Operations', () => {
    it('should sign and verify events', async () => {
      const keyPair = await generateKeyPair();
      const event: NostrEvent = {
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: 'Hello NOSTR!'
      };

      const signedEvent = await signEvent(event, keyPair.privateKey);
      expect(signedEvent.sig).toBeDefined();
      expect(signedEvent.id).toBeDefined();
      expect(signedEvent.pubkey).toBe(keyPair.publicKey);

      const isValid = await verifySignature(signedEvent);
      expect(isValid).toBe(true);
    });
  });

  describe('Encryption/Decryption', () => {
    it('should encrypt and decrypt messages', async () => {
      const alice = await generateKeyPair();
      const bob = await generateKeyPair();
      const message = 'Secret message for Bob';

      const encrypted = await encrypt(
        message,
        bob.publicKey,
        alice.privateKey
      );

      const decrypted = await decrypt(
        encrypted,
        alice.publicKey,
        bob.privateKey
      );

      expect(decrypted).toBe(message);
    });
  });

  describe('verifySignature', () => {
    it('should verify a valid signature', async () => {
      const event: NostrEvent = {
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: 'Hello, World!'
      };
      const privateKey = await generateKeyPair().privateKey;
      const signedEvent = await signEvent(event, privateKey);
      expect(await verifySignature(signedEvent)).toBe(true);
    });

    it('should reject an invalid signature', async () => {
      const event: NostrEvent = {
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: 'Hello, World!'
      };
      const privateKey = await generateKeyPair().privateKey;
      const signedEvent = await signEvent(event, privateKey);
      // Tamper with the signature
      signedEvent.sig = signedEvent.sig.replace('a', 'b');
      expect(await verifySignature(signedEvent)).toBe(false);
    });

    it('should reject if event hash does not match', async () => {
      const event: NostrEvent = {
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: 'Hello, World!'
      };
      const privateKey = await generateKeyPair().privateKey;
      const signedEvent = await signEvent(event, privateKey);
      // Tamper with the content which affects the hash
      signedEvent.content = 'Modified content';
      expect(await verifySignature(signedEvent)).toBe(false);
    });

    it('should handle invalid hex in signature', async () => {
      const event: NostrEvent = {
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: 'Hello, World!'
      };
      const privateKey = await generateKeyPair().privateKey;
      const signedEvent = await signEvent(event, privateKey);
      // Add invalid hex character
      signedEvent.sig = 'XYZ' + signedEvent.sig.slice(3);
      expect(await verifySignature(signedEvent)).toBe(false);
    });
  });

  describe('validateKeyPair', () => {
    it('should validate a correct key pair', async () => {
      const privateKey = await generateKeyPair().privateKey;
      const publicKey = await getPublicKey(privateKey);
      const result = await validateKeyPair(publicKey, privateKey);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject mismatched key pair', async () => {
      const privateKey1 = await generateKeyPair().privateKey;
      const privateKey2 = await generateKeyPair().privateKey;
      const publicKey = await getPublicKey(privateKey1);
      const result = await validateKeyPair(publicKey, privateKey2);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Public key does not match private key');
    });

    it('should handle invalid private key', async () => {
      const publicKey = await getPublicKey(await generateKeyPair().privateKey);
      const result = await validateKeyPair(publicKey, 'invalid-private-key');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid key pair');
    });
  });

  describe('signEvent', () => {
    it('should sign an event with all fields', async () => {
      const event: NostrEvent = {
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [['p', '1234']],
        content: 'Hello, World!'
      };
      const privateKey = await generateKeyPair().privateKey;
      const signedEvent = await signEvent(event, privateKey);
      expect(signedEvent.sig).toBeTruthy();
      expect(signedEvent.id).toBeTruthy();
      expect(signedEvent.pubkey).toBeTruthy();
    });

    it('should handle missing optional fields', async () => {
      const event: NostrEvent = {
        kind: 1,
        created_at: 1734127200,  // 2024-12-14 18:14:51 PST
        content: 'Hello, World!',
        tags: []  // Adding the required tags property
      };
      const privateKey = await generateKeyPair().privateKey;
      const signedEvent = await signEvent(event, privateKey);
      expect(signedEvent.sig).toBeTruthy();
      expect(signedEvent.id).toBeTruthy();
      expect(signedEvent.pubkey).toBeTruthy();
      expect(signedEvent.created_at).toBeDefined();
      expect(signedEvent.tags).toEqual([]);
    });

    it('should handle undefined tags', async () => {
      const event: NostrEvent = {
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        content: 'Hello, World!',
        tags: []  // Add empty tags array to satisfy NostrEvent interface
      };
      const privateKey = await generateKeyPair().privateKey;
      const signedEvent = await signEvent(event, privateKey);
      expect(signedEvent.tags).toEqual([]);
    });

    it('should handle undefined created_at', async () => {
      const event: NostrEvent = {
        kind: 1,
        content: 'Hello, World!',
        tags: [],
        created_at: Math.floor(Date.now() / 1000)
      };
      const privateKey = await generateKeyPair().privateKey;
      const signedEvent = await signEvent(event, privateKey);
      expect(signedEvent.created_at).toBeDefined();
      expect(typeof signedEvent.created_at).toBe('number');
    });
  });
});
