import { describe, it, expect } from 'vitest';
import {
  generateKeyPair,
  signEvent,
  verifySignature,
  createEvent,
  encryptMessage,
  decryptMessage
} from '../index';
import { NostrEventKind } from '../types';

describe('NIP-01: Basic Protocol Flow', () => {
  it('Event Creation and Signing Flow', async () => {
    const keyPair = await generateKeyPair();
    const event = createEvent({
      kind: NostrEventKind.TEXT_NOTE,
      content: 'Hello, Nostr!',
      pubkey: keyPair.publicKey.hex,
      created_at: Math.floor(Date.now() / 1000),
      tags: []
    });

    const signedEvent = await signEvent(event, keyPair.privateKey);
    
    expect(signedEvent.id).toBeDefined();
    expect(signedEvent.sig).toBeDefined();
    expect(signedEvent.pubkey).toBe(keyPair.publicKey.hex);
    expect(signedEvent.kind).toBe(NostrEventKind.TEXT_NOTE);
    expect(signedEvent.content).toBe('Hello, Nostr!');
    expect(signedEvent.tags).toEqual([]);
    expect(signedEvent.created_at).toBeDefined();

    const isValid = await verifySignature(signedEvent);
    expect(isValid).toBe(true);
  });

  it('Client-Relay Message Format', async () => {
    const keyPair = await generateKeyPair();
    const event = createEvent({
      kind: NostrEventKind.TEXT_NOTE,
      content: 'Hello, Nostr!',
      pubkey: keyPair.publicKey.hex,
      created_at: Math.floor(Date.now() / 1000),
      tags: []
    });

    const signedEvent = await signEvent(event, keyPair.privateKey);
    const message = ['EVENT', signedEvent];
    
    expect(Array.isArray(message)).toBe(true);
    expect(message[0]).toBe('EVENT');
    expect(message[1]).toEqual(signedEvent);
  });
});

describe('NIP-04: Encrypted Direct Messages', () => {
  it('should encrypt and decrypt direct messages', async () => {
    const sender = await generateKeyPair();
    const recipient = await generateKeyPair();
    const plaintext = 'Secret message';

    const encrypted = await encryptMessage(
      plaintext,
      sender.privateKey,
      recipient.publicKey.hex
    );

    const decrypted = await decryptMessage(
      encrypted,
      recipient.privateKey,
      sender.publicKey.hex
    );

    expect(decrypted).toBe(plaintext);
  });
});
