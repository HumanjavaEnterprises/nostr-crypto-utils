import { describe, expect, it } from 'vitest';
import { NostrMessageType } from '../types/base';
import { NostrEvent, SignedNostrEvent } from '../types/base';
import { generateKeyPair } from '../crypto/keys';
import { signEvent } from '../crypto/events';
import { createEvent } from '../crypto/events';
import { NostrMessage } from '../transport';
import { parseNostrMessage, createEventMessage } from '../protocol/transport';
import { hexToBytes, bytesToHex } from '../utils/encoding';

// Helper function to compare events with Uint8Array properties
function compareEvents(actual: SignedNostrEvent, expected: SignedNostrEvent) {
  expect(actual.id).toEqual(expected.id);
  expect(actual.sig).toEqual(expected.sig);
  expect(actual.kind).toEqual(expected.kind);
  expect(actual.content).toEqual(expected.content);
  expect(actual.created_at).toEqual(expected.created_at);
  expect(actual.tags).toEqual(expected.tags);
  expect(actual.pubkey.hex).toEqual(expected.pubkey.hex);
  expect(bytesToHex(actual.pubkey.bytes)).toEqual(bytesToHex(expected.pubkey.bytes));
}

describe('Transport Layer', () => {
  it('should parse EVENT message correctly', () => {
    const pubkeyHex = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    const event: SignedNostrEvent = {
      pubkey: {
        hex: pubkeyHex,
        bytes: hexToBytes(pubkeyHex)
      },
      created_at: 1234567890,
      kind: 1,
      tags: [],
      content: 'Hello, world!',
      id: 'test-id',
      sig: 'test-sig'
    };

    const message = ['EVENT', event];
    const [messageType, eventData] = parseNostrMessage(JSON.stringify(message));

    expect(messageType).toBe(NostrMessageType.EVENT);
    compareEvents(eventData as SignedNostrEvent, event);
  });

  it('should parse REQ message correctly', () => {
    const subscriptionId = 'test-sub';
    const filter = { kinds: [1], limit: 10 };
    const message = ['REQ', subscriptionId, filter];
    const [messageType, subId, filterData] = parseNostrMessage(JSON.stringify(message));

    expect(messageType).toBe(NostrMessageType.REQ);
    expect(subId).toBe(subscriptionId);
    expect(filterData).toEqual(filter);
  });

  it('should parse CLOSE message correctly', () => {
    const subscriptionId = 'test-sub';
    const message = ['CLOSE', subscriptionId];
    const [messageType, subId] = parseNostrMessage(JSON.stringify(message));

    expect(messageType).toBe(NostrMessageType.CLOSE);
    expect(subId).toBe(subscriptionId);
  });

  it('should parse OK message correctly', () => {
    const eventId = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    const success = true;
    const message = ['OK', eventId, success, ''];
    const [messageType, id, isSuccess] = parseNostrMessage(JSON.stringify(message));

    expect(messageType).toBe(NostrMessageType.OK);
    expect(id).toBe(eventId);
    expect(isSuccess).toBe(success);
  });

  it('should parse EOSE message correctly', () => {
    const subscriptionId = 'test-sub';
    const message = ['EOSE', subscriptionId];
    const [messageType, subId] = parseNostrMessage(JSON.stringify(message));

    expect(messageType).toBe(NostrMessageType.EOSE);
    expect(subId).toBe(subscriptionId);
  });

  it('should handle event publication flow', async () => {
    // Generate test keypair
    const keyPair = await generateKeyPair();

    // Create test event
    const event = createEvent({
      pubkey: keyPair.publicKey,
      kind: 1,
      content: 'Test message',
      created_at: Math.floor(Date.now() / 1000)
    });

    // Sign the event
    const signedEvent = await signEvent(event, keyPair.privateKey);

    // Validate event before sending
    expect(signedEvent.id).toBeDefined();
    expect(signedEvent.sig).toBeDefined();

    // Format event message
    const message = createEventMessage(signedEvent);
    expect(message[0]).toBe('EVENT');
    compareEvents(message[1] as SignedNostrEvent, signedEvent);

    // Parse the message back
    const [messageType, eventData] = parseNostrMessage(JSON.stringify(message));
    expect(messageType).toBe(NostrMessageType.EVENT);
    compareEvents(eventData as SignedNostrEvent, signedEvent);
  });
});
