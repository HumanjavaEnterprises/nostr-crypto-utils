import { describe, expect, it } from 'vitest';
import { NostrMessageType } from '../types/base';
import { NostrEvent, SignedNostrEvent } from '../types/base';
import { generateKeyPair } from '../crypto/keys';
import { signEvent } from '../crypto/events';
import { createEvent } from '../crypto/events';
import { NostrMessage } from '../transport';
import { parseNostrMessage, createEventMessage } from '../protocol/transport';

describe('Transport Layer', () => {
  it('should parse EVENT message correctly', () => {
    const event: NostrEvent = {
      pubkey: {
        hex: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        bytes: new Uint8Array(32)
      },
      created_at: 1234567890,
      kind: 1,
      tags: [],
      content: 'Hello, world!'
    };

    const message = ['EVENT', event];
    const parsed = parseNostrMessage(JSON.stringify(message));

    expect(parsed.messageType).toBe(NostrMessageType.EVENT);
    expect(parsed.event).toEqual(event);
  });

  it('should parse REQ message correctly', () => {
    const subscriptionId = 'test-sub';
    const filter = { kinds: [1], limit: 10 };
    const message = ['REQ', subscriptionId, filter];
    const parsed = parseNostrMessage(JSON.stringify(message));

    expect(parsed.messageType).toBe(NostrMessageType.REQ);
    expect(parsed.subscriptionId).toBe(subscriptionId);
    expect(parsed.filter).toEqual(filter);
  });

  it('should parse CLOSE message correctly', () => {
    const subscriptionId = 'test-sub';
    const message = ['CLOSE', subscriptionId];
    const parsed = parseNostrMessage(JSON.stringify(message));

    expect(parsed.messageType).toBe(NostrMessageType.CLOSE);
    expect(parsed.subscriptionId).toBe(subscriptionId);
  });

  it('should parse OK message correctly', () => {
    const eventId = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    const success = true;
    const message = ['OK', eventId, success, ''];
    const parsed = parseNostrMessage(JSON.stringify(message));

    expect(parsed.messageType).toBe(NostrMessageType.OK);
    expect(parsed.eventId).toBe(eventId);
    expect(parsed.success).toBe(success);
  });

  it('should parse EOSE message correctly', () => {
    const subscriptionId = 'test-sub';
    const message = ['EOSE', subscriptionId];
    const parsed = parseNostrMessage(JSON.stringify(message));

    expect(parsed.messageType).toBe(NostrMessageType.EOSE);
    expect(parsed.subscriptionId).toBe(subscriptionId);
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
    expect(message[1]).toEqual(signedEvent);

    // Parse the message back
    const parsed = parseNostrMessage(JSON.stringify(message));
    expect(parsed.messageType).toBe(NostrMessageType.EVENT);
    expect(parsed.event).toEqual(signedEvent);
  });
});
