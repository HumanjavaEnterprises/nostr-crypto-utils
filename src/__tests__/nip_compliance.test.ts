import {
  generateKeyPair,
  signEvent,
  verifySignature,
  encrypt,
  decrypt,
  createEvent,
  validateEvent,
  validateSignedEvent,
  NostrEventKind,
  NostrMessageType,
  NostrFilter,
  formatSubscriptionForRelay,
  formatEventForRelay,
  formatCloseForRelay,
  parseNostrMessage
} from '../index';
import type { SignedNostrEvent } from '../types';

describe('NIP-01: Basic Protocol Flow', () => {
  let keyPair: { privateKey: string; publicKey: string };

  beforeAll(async () => {
    keyPair = await generateKeyPair();
  });

  test('Event Creation and Signing Flow', async () => {
    // Create a text note (kind 1) as specified in NIP-01
    const event = createEvent({
      kind: NostrEventKind.TEXT_NOTE,
      content: 'Hello Nostr!',
      tags: [],
      created_at: Math.floor(Date.now() / 1000)
    });

    // Sign the event
    const signedEvent = await signEvent(event, keyPair.privateKey);

    // Verify event structure according to NIP-01
    const validation = validateSignedEvent(signedEvent);
    expect(validation.isValid).toBe(true);
    expect(signedEvent.pubkey).toBe(keyPair.publicKey);
    expect(typeof signedEvent.created_at).toBe('number');
    expect(Array.isArray(signedEvent.tags)).toBe(true);
  });

  test('Client-Relay Message Format', async () => {
    // Test REQ message format
    const reqMessage = formatSubscriptionForRelay({ id: 'test_sub', filters: [{ kinds: [1], limit: 10 }] });
    expect(reqMessage[0]).toBe('REQ');
    expect(Array.isArray(reqMessage)).toBe(true);
    expect(reqMessage.length).toBeGreaterThan(2);

    // Test EVENT message format
    const event2 = createEvent({
      kind: NostrEventKind.TEXT_NOTE,
      content: 'test message',
      tags: []
    });
    const signedEvent = await signEvent(event2, keyPair.privateKey);
    const eventMessage = formatEventForRelay(signedEvent);
    expect(eventMessage[0]).toBe('EVENT');
    expect(eventMessage[1]).toMatchObject({
      kind: NostrEventKind.TEXT_NOTE,
      content: 'test message'
    });

    // Test CLOSE message format
    const closeMessage = JSON.stringify(formatCloseForRelay('subscription_id'));
    const closeParsed = JSON.parse(closeMessage) as any[];
    expect(closeParsed[0]).toBe('CLOSE');
    expect(closeParsed[1]).toBe('subscription_id');
  });
});

describe('NIP-02: Contact List', () => {
  test('Contact List Event Structure', async () => {
    const keyPair = await generateKeyPair();
    const contacts = createEvent({
      kind: NostrEventKind.CONTACTS,
      content: JSON.stringify([
        {
          pubkey: '0123456789abcdef',
          relay: 'wss://relay.example.com',
          petname: 'friend'
        }
      ]),
      tags: [],
      created_at: Math.floor(Date.now() / 1000)
    });

    const validation = validateEvent(contacts);
    expect(validation.isValid).toBe(true);
    expect(contacts.kind).toBe(NostrEventKind.CONTACTS);
  });
});

describe('NIP-04: Encrypted Direct Messages', () => {
  test('Message Encryption and Decryption', async () => {
    const alice = await generateKeyPair();
    const bob = await generateKeyPair();
    const message = 'Secret message for testing';

    // Encrypt message from Alice to Bob
    const encrypted = await encrypt(message, bob.publicKey, alice.privateKey);
    expect(encrypted).not.toBe(message);

    // Bob decrypts message from Alice
    const decrypted = await decrypt(encrypted, alice.publicKey, bob.privateKey);
    expect(decrypted).toBe(message);
  });

  test('Encrypted DM Event Structure', async () => {
    const sender = await generateKeyPair();
    const recipient = await generateKeyPair();
    const message = 'Secret message';

    const encrypted = await encrypt(message, recipient.publicKey, sender.privateKey);
    const dmEvent = createEvent({
      kind: NostrEventKind.ENCRYPTED_DIRECT_MESSAGE,
      content: encrypted,
      tags: [['p', recipient.publicKey]],
      created_at: Math.floor(Date.now() / 1000)
    });

    const validation = validateEvent(dmEvent);
    expect(validation.isValid).toBe(true);
    expect(dmEvent.kind).toBe(NostrEventKind.ENCRYPTED_DIRECT_MESSAGE);
    expect(dmEvent.tags[0][0]).toBe('p');
    expect(dmEvent.tags[0][1]).toBe(recipient.publicKey);
  });
});

describe('NIP-09: Event Deletion', () => {
  test('Event Deletion Structure', async () => {
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

    const validation = validateEvent(deleteEvent);
    expect(validation.isValid).toBe(true);
    expect(deleteEvent.kind).toBe(NostrEventKind.DELETE);
    expect(deleteEvent.tags[0][0]).toBe('e');
    expect(deleteEvent.tags[0][1]).toBe(originalEvent.id);
  });
});
