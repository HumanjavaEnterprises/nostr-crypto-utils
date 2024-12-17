import { describe, it, expect, beforeAll } from 'vitest';
import {
  generateKeyPair,
  createEvent,
  signEvent,
  encrypt,
  decrypt,
  NostrEventKind,
  formatSubscriptionForRelay,
  formatEventForRelay,
  formatCloseForRelay
} from '../index';

describe('NIP-01: Basic Protocol Flow', () => {
  let keyPair: { privateKey: string; publicKey: string };

  beforeAll(async () => {
    keyPair = await generateKeyPair();
  });

  it('Event Creation and Signing Flow', async () => {
    // Create a text note (kind 1) as specified in NIP-01
    const event = createEvent({
      kind: NostrEventKind.TEXT_NOTE,
      content: 'Hello, Nostr!',
      tags: []
    });

    // Sign the event
    const signedEvent = await signEvent(event, keyPair.privateKey);

    // Verify the signed event structure
    expect(signedEvent.id).toBeDefined();
    expect(signedEvent.sig).toBeDefined();
    expect(signedEvent.pubkey).toBe(keyPair.publicKey);
    expect(signedEvent.kind).toBe(NostrEventKind.TEXT_NOTE);
    expect(signedEvent.content).toBe('Hello, Nostr!');
    expect(signedEvent.created_at).toBeDefined();
    expect(Array.isArray(signedEvent.tags)).toBe(true);
  });

  it('Client-Relay Message Format', async () => {
    // Test REQ message format
    const reqMessage = formatSubscriptionForRelay({ 
      id: 'test_sub', 
      filters: [{ kinds: [1], limit: 10 }] 
    });
    expect(reqMessage[0]).toBe('REQ');
    expect(reqMessage[1]).toBe('test_sub');
    expect(reqMessage[2]).toEqual({ kinds: [1], limit: 10 });

    // Test EVENT message format
    const keyPair = await generateKeyPair();
    const event = createEvent({
      kind: NostrEventKind.TEXT_NOTE,
      content: 'Test message',
      tags: []
    });
    const signedEvent = await signEvent(event, keyPair.privateKey);
    const eventMessage = formatEventForRelay(signedEvent);
    expect(eventMessage[0]).toBe('EVENT');
    expect(eventMessage[1]).toEqual(signedEvent);

    // Test CLOSE message format
    const closeMessage = formatCloseForRelay('test_sub');
    expect(closeMessage[0]).toBe('CLOSE');
    expect(closeMessage[1]).toBe('test_sub');
  });
});

describe('NIP-02: Contact List', () => {
  it('Contact List Event Structure', async () => {
    const keyPair = await generateKeyPair();
    const contacts = createEvent({
      kind: NostrEventKind.CONTACTS,
      content: JSON.stringify({
        name: 'Alice',
        about: 'I love Nostr!'
      }),
      created_at: Math.floor(Date.now() / 1000)
    });

    const signedContacts = await signEvent(contacts, keyPair.privateKey);
    expect(signedContacts).toHaveProperty('id');
    expect(signedContacts).toHaveProperty('sig');

    // Verify the event structure
    expect(signedContacts.kind).toBe(NostrEventKind.CONTACTS);
  });
});

describe('NIP-04: Encrypted Direct Messages', () => {
  let keyPair: { privateKey: string; publicKey: string };

  beforeAll(async () => {
    keyPair = await generateKeyPair();
  });

  it('Message Encryption and Decryption', async () => {
    const alice = await generateKeyPair();
    const bob = await generateKeyPair();
    const message = 'Secret message for testing';

    // Encrypt message from Alice to Bob
    const encrypted = await encrypt(message, bob.publicKey, alice.privateKey);
    expect(encrypted).not.toBe(message);

    // Decrypt message
    const decrypted = await decrypt(encrypted, alice.publicKey, bob.privateKey);
    expect(decrypted).toBe(message);
  });

  it('Encrypted DM Event Structure', async () => {
    const recipient = await generateKeyPair();
    const dmEvent = createEvent({
      kind: NostrEventKind.ENCRYPTED_DIRECT_MESSAGE,
      content: 'Encrypted message',
      tags: [['p', recipient.publicKey]]
    });

    const signedDM = await signEvent(dmEvent, keyPair.privateKey);
    expect(signedDM).toHaveProperty('id');
    expect(signedDM).toHaveProperty('sig');
    expect(signedDM.kind).toBe(NostrEventKind.ENCRYPTED_DIRECT_MESSAGE);
    expect(signedDM.tags[0][0]).toBe('p');
    expect(signedDM.tags[0][1]).toBe(recipient.publicKey);
  });
});

describe('NIP-09: Event Deletion', () => {
  it('Event Deletion Structure', async () => {
    const keyPair = await generateKeyPair();
    const originalEvent = await signEvent(createEvent({
      kind: NostrEventKind.TEXT_NOTE,
      content: 'Original post',
      tags: [],
      created_at: Math.floor(Date.now() / 1000)
    }), keyPair.privateKey);

    const deleteEvent = createEvent({
      kind: NostrEventKind.DELETE,
      content: 'Deleted due to error',
      tags: [['e', originalEvent.id]],
      created_at: Math.floor(Date.now() / 1000)
    });

    const signedDeleteEvent = await signEvent(deleteEvent, keyPair.privateKey);
    expect(signedDeleteEvent).toHaveProperty('id');
    expect(signedDeleteEvent).toHaveProperty('sig');

    // Verify the event structure
    expect(deleteEvent.kind).toBe(NostrEventKind.DELETE);
    expect(deleteEvent.tags[0][0]).toBe('e');
    expect(deleteEvent.tags[0][1]).toBe(originalEvent.id);
  });
});
