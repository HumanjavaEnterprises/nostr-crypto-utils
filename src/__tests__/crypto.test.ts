import {
  generateKeyPair,
  getPublicKey,
  validateKeyPair,
  signEvent,
  verifySignature,
  encrypt,
  decrypt
} from '../index';

describe('NOSTR Crypto Utils', () => {
  describe('Key Management', () => {
    it('should generate valid key pairs', () => {
      const keyPair = generateKeyPair();
      expect(keyPair.privateKey).toBeDefined();
      expect(keyPair.publicKey).toBeDefined();
      expect(keyPair.privateKey).toHaveLength(64);
      expect(keyPair.publicKey).toHaveLength(64);
    });

    it('should derive the correct public key', () => {
      const keyPair = generateKeyPair();
      const derivedPubKey = getPublicKey(keyPair.privateKey);
      expect(derivedPubKey).toBe(keyPair.publicKey);
    });

    it('should validate key pairs', () => {
      const keyPair = generateKeyPair();
      const result = validateKeyPair(keyPair.publicKey, keyPair.privateKey);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should generate consistent key pairs from seed phrase', () => {
      const seedPhrase = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
      const keyPair1 = generateKeyPair(seedPhrase);
      const keyPair2 = generateKeyPair(seedPhrase);
      
      expect(keyPair1.privateKey).toBe(keyPair2.privateKey);
      expect(keyPair1.publicKey).toBe(keyPair2.publicKey);
    });
  });

  describe('Event Operations', () => {
    it('should sign and verify events', async () => {
      const keyPair = await generateKeyPair();
      const event = {
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
});
