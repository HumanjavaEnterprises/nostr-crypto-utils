import { describe, it, expect } from 'vitest';
import {
  generateKeyPair,
  getPublicKey,
  validateKeyPair,
  signEvent,
  verifySignature,
  createEvent,
  encryptMessage,
  decryptMessage
} from '../index';
import { NostrEventKind } from '../types';

describe('NOSTR Crypto Utils', () => {
  describe('Key Management', () => {
    it('should generate valid key pairs', async () => {
      const keyPair = await generateKeyPair();
      expect(keyPair.privateKey).toBeDefined();
      expect(keyPair.publicKey.hex).toBeDefined();
      expect(keyPair.publicKey.bytes).toBeDefined();
      
      const isValid = await validateKeyPair(keyPair);
      expect(isValid).toBe(true);
    });

    it('should derive public key from private key', async () => {
      const keyPair = await generateKeyPair();
      const derivedPubKey = await getPublicKey(keyPair.privateKey);
      expect(derivedPubKey.hex).toBe(keyPair.publicKey.hex);
    });

    it('should validate correct key pairs', async () => {
      const keyPair = await generateKeyPair();
      const isValid = await validateKeyPair(keyPair);
      expect(isValid).toBe(true);
    });

    it('should reject invalid key pairs', async () => {
      const keyPair = await generateKeyPair();
      const invalidKeyPair = {
        privateKey: keyPair.privateKey,
        publicKey: {
          hex: '0'.repeat(64),
          bytes: new Uint8Array(32),
          schnorrHex: '0'.repeat(64),
          schnorrBytes: new Uint8Array(32)
        }
      };
      const isValid = await validateKeyPair(invalidKeyPair);
      expect(isValid).toBe(false);
    });
  });

  describe('Event Operations', () => {
    it('should sign and verify events', async () => {
      const keyPair = await generateKeyPair();
      const event = createEvent({
        kind: NostrEventKind.TEXT_NOTE,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: 'Hello NOSTR!',
        pubkey: keyPair.publicKey.hex
      });

      const signedEvent = await signEvent(event, keyPair.privateKey);
      expect(signedEvent.sig).toBeDefined();
      expect(signedEvent.id).toBeDefined();
      expect(signedEvent.pubkey).toBe(keyPair.publicKey.hex);

      const isValid = await verifySignature(signedEvent);
      expect(isValid).toBe(true);
    });

    it('should reject an invalid signature', async () => {
      const keyPair = await generateKeyPair();
      const event = createEvent({
        kind: NostrEventKind.TEXT_NOTE,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: 'Hello NOSTR!',
        pubkey: keyPair.publicKey.hex
      });

      const signedEvent = await signEvent(event, keyPair.privateKey);
      signedEvent.sig = '00'.repeat(32); // Invalid signature
      const isValid = await verifySignature(signedEvent);
      expect(isValid).toBe(false);
    });
  });

  describe('Encryption/Decryption', () => {
    it('should encrypt and decrypt messages', async () => {
      const senderKeyPair = await generateKeyPair();
      const recipientKeyPair = await generateKeyPair();
      const message = 'Secret message';

      const encrypted = await encryptMessage(
        message,
        senderKeyPair.privateKey,
        recipientKeyPair.publicKey.hex
      );

      const decrypted = await decryptMessage(
        encrypted,
        recipientKeyPair.privateKey,
        senderKeyPair.publicKey.hex
      );

      expect(decrypted).toBe(message);
    });

    it('should fail to decrypt with wrong keys', async () => {
      const senderKeyPair = await generateKeyPair();
      const invalidPrivateKey = 'invalid-key';

      await expect(
        decryptMessage(
          'Secret message',
          invalidPrivateKey,
          senderKeyPair.publicKey.hex
        )
      ).rejects.toThrow('Invalid private key format');
    });

    it('should fail to decrypt with wrong recipient', async () => {
      const senderKeyPair = await generateKeyPair();
      const recipientKeyPair = await generateKeyPair();
      const wrongKeyPair = await generateKeyPair();
      const message = 'Hello, Nostr!';

      // Encrypt for recipientKeyPair
      const encrypted = await encryptMessage(message, senderKeyPair.privateKey, recipientKeyPair.publicKey.hex);
      expect(encrypted).toBeDefined();

      // Try to decrypt with wrong key pair
      await expect(decryptMessage(encrypted, wrongKeyPair.privateKey, senderKeyPair.publicKey.hex)).rejects.toThrow();
    });
  });

  describe('verifySignature', () => {
    it('should verify a valid signature', async () => {
      const keyPair = await generateKeyPair();
      const event = createEvent({
        kind: NostrEventKind.TEXT_NOTE,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: 'Test message',
        pubkey: keyPair.publicKey.hex
      });

      const signedEvent = await signEvent(event, keyPair.privateKey);
      const isValid = await verifySignature(signedEvent);
      expect(isValid).toBe(true);
    });

    it('should reject invalid signature', async () => {
      const keyPair = await generateKeyPair();
      const event = createEvent({
        kind: NostrEventKind.TEXT_NOTE,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: 'Test message',
        pubkey: keyPair.publicKey.hex
      });

      const signedEvent = await signEvent(event, keyPair.privateKey);
      signedEvent.sig = '00'.repeat(32);
      const isValid = await verifySignature(signedEvent);
      expect(isValid).toBe(false);
    });

    it('should reject tampered content', async () => {
      const keyPair = await generateKeyPair();
      const event = createEvent({
        kind: NostrEventKind.TEXT_NOTE,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: 'Original message',
        pubkey: keyPair.publicKey.hex
      });

      const signedEvent = await signEvent(event, keyPair.privateKey);
      signedEvent.content = 'Tampered message';
      const isValid = await verifySignature(signedEvent);
      expect(isValid).toBe(false);
    });

    it('should reject tampered pubkey', async () => {
      const keyPair = await generateKeyPair();
      const event = createEvent({
        kind: NostrEventKind.TEXT_NOTE,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: 'Test message',
        pubkey: keyPair.publicKey.hex
      });

      const signedEvent = await signEvent(event, keyPair.privateKey);
      signedEvent.pubkey = '00'.repeat(32);
      const isValid = await verifySignature(signedEvent);
      expect(isValid).toBe(false);
    });
  });

  describe('signEvent', () => {
    it('should sign an event with all fields', async () => {
      const keyPair = await generateKeyPair();
      const event = createEvent({
        kind: NostrEventKind.TEXT_NOTE,
        created_at: Math.floor(Date.now() / 1000),
        tags: [['e', 'event1'], ['p', 'pubkey1']],
        content: 'Hello NOSTR!',
        pubkey: keyPair.publicKey.hex
      });

      const signedEvent = await signEvent(event, keyPair.privateKey);
      expect(signedEvent.sig).toBeDefined();
      expect(signedEvent.id).toBeDefined();
      expect(signedEvent.pubkey).toBe(keyPair.publicKey.hex);
      expect(signedEvent.content).toBe('Hello NOSTR!');
      expect(signedEvent.tags).toEqual([['e', 'event1'], ['p', 'pubkey1']]);
    });

    it('should handle missing optional fields', async () => {
      const keyPair = await generateKeyPair();
      const event = createEvent({
        kind: NostrEventKind.TEXT_NOTE,
        content: 'Hello NOSTR!',
        pubkey: keyPair.publicKey.hex
      });

      const signedEvent = await signEvent(event, keyPair.privateKey);
      expect(signedEvent.sig).toBeDefined();
      expect(signedEvent.id).toBeDefined();
      expect(signedEvent.created_at).toBeDefined();
    });

    it('should handle undefined tags', async () => {
      const keyPair = await generateKeyPair();
      const event = createEvent({
        kind: NostrEventKind.TEXT_NOTE,
        content: 'Hello NOSTR!',
        created_at: Math.floor(Date.now() / 1000),
        pubkey: keyPair.publicKey.hex
      });

      const signedEvent = await signEvent(event, keyPair.privateKey);
      expect(signedEvent.tags).toEqual([]);
    });

    it('should handle undefined created_at', async () => {
      const keyPair = await generateKeyPair();
      const event = createEvent({
        kind: NostrEventKind.TEXT_NOTE,
        content: 'Hello NOSTR!',
        tags: [],
        pubkey: keyPair.publicKey.hex
      });

      const signedEvent = await signEvent(event, keyPair.privateKey);
      expect(signedEvent.created_at).toBeDefined();
      expect(typeof signedEvent.created_at).toBe('number');
    });
  });
});
