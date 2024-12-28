import { describe, expect, it } from 'vitest';
import { SignedNostrEvent, NostrMessageType } from '../types/base';
import { generateKeyPair } from '../crypto';
import { signEvent } from '../crypto';
import { createEvent } from '../crypto';
import { parseMessage, formatEventForRelay } from '../protocol';

describe('Transport Layer', () => {
  it('should parse EVENT message correctly', (): void => {
    const pubkeyHex = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    const event: SignedNostrEvent = {
      pubkey: pubkeyHex,
      created_at: 1234567890,
      kind: 1,
      tags: [],
      content: 'Hello, NOSTR!',
      id: 'eventid',
      sig: 'signature'
    };

    const message = ['EVENT', event];
    const parsed = parseMessage(JSON.stringify(message));

    expect(parsed.type).toBe(NostrMessageType.EVENT);
    expect(parsed.event).toEqual(event);
  });

  it('should parse REQ message correctly', (): void => {
    const message = ['REQ', 'subscription_id', { kinds: [1], limit: 10 }];
    const parsed = parseMessage(JSON.stringify(message));

    expect(parsed.type).toBe(NostrMessageType.REQ);
    expect(parsed.subscriptionId).toBe('subscription_id');
    expect(parsed.filters).toEqual([{ kinds: [1], limit: 10 }]);
  });

  it('should parse CLOSE message correctly', (): void => {
    const message = ['CLOSE', 'subscription_id'];
    const parsed = parseMessage(JSON.stringify(message));

    expect(parsed.type).toBe(NostrMessageType.CLOSE);
    expect(parsed.subscriptionId).toBe('subscription_id');
  });

  it('should parse OK message correctly', (): void => {
    const message = ['OK', 'event_id', true, 'success'];
    const parsed = parseMessage(JSON.stringify(message));

    expect(parsed.type).toBe(NostrMessageType.OK);
    expect(parsed.eventId).toBe('event_id');
    expect(parsed.accepted).toBe(true);
    expect(parsed.message).toBe('success');
  });

  it('should parse EOSE message correctly', (): void => {
    const message = ['EOSE', 'subscription_id'];
    const parsed = parseMessage(JSON.stringify(message));

    expect(parsed.type).toBe(NostrMessageType.EOSE);
    expect(parsed.subscriptionId).toBe('subscription_id');
  });

  it('should handle event publication flow', async () => {
    const keyPair = await generateKeyPair();
    const event = createEvent({
      kind: 1,
      content: 'Hello, NOSTR!',
      pubkey: keyPair.publicKey.hex
    });

    const signedEvent = await signEvent(event, keyPair.privateKey);
    const message = formatEventForRelay(signedEvent);
    const parsed = parseMessage(JSON.stringify(message));

    expect(parsed.type).toBe(NostrMessageType.EVENT);
    expect(parsed.event).toBeDefined();
    if (!parsed.event) {
      throw new Error('Event should be defined');
    }
    expect(parsed.event.pubkey).toBe(keyPair.publicKey.hex);
    expect(parsed.event.content).toBe('Hello, NOSTR!');
    expect(parsed.event.kind).toBe(1);
  });
});
