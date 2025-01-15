import {
  formatEventForRelay,
  formatSubscriptionForRelay,
  formatCloseForRelay,
  formatAuthForRelay,
  parseNostrMessage,
  createMetadataEvent,
  createTextNoteEvent,
  createDirectMessageEvent,
  createChannelMessageEvent,
  extractReferencedEvents,
  extractMentionedPubkeys,
  createKindFilter,
  createAuthorFilter,
  createReplyFilter
} from '../utils';
import { NostrEvent, SignedNostrEvent, NostrEventKind } from '../types/base';
import { NostrSubscription } from '../types/protocol';
import { describe, it, expect } from 'vitest';

describe('Integration Utilities', () => {
  const mockSignedEvent: SignedNostrEvent = {
    kind: NostrEventKind.TEXT_NOTE,
    content: 'test',
    created_at: 1234567890,
    tags: [],
    pubkey: { hex: 'abc123', bytes: new Uint8Array() },
    id: 'def456',
    sig: 'ghi789'
  };

  describe('Message Formatting', () => {
    it('should format event message', () => {
      const formatted = formatEventForRelay(mockSignedEvent);
      expect(formatted).toEqual(['EVENT', mockSignedEvent]);
    });

    it('should format subscription message', () => {
      const subscription: NostrSubscription = {
        id: 'sub1',
        filters: [{ kinds: [1], limit: 10 }]
      };
      const formatted = formatSubscriptionForRelay(subscription);
      expect(formatted).toEqual(['REQ', 'sub1', { kinds: [1], limit: 10 }]);
    });

    it('should format close message', () => {
      const formatted = formatCloseForRelay('sub1');
      expect(formatted).toEqual(['CLOSE', 'sub1']);
    });

    it('should format auth message', () => {
      const formatted = formatAuthForRelay(mockSignedEvent);
      expect(formatted).toEqual(['AUTH', mockSignedEvent]);
    });
  });

  describe('Message Parsing', () => {
    it('should parse EVENT message', () => {
      const message = ['EVENT', mockSignedEvent];
      const parsed = parseNostrMessage(message);
      expect(parsed).not.toBeNull();
      if (parsed) {
        expect(parsed.type).toBe('EVENT');
        expect(parsed.payload).toEqual(mockSignedEvent);
      }
    });

    it('should parse NOTICE message', () => {
      const message = ['NOTICE', 'test message'];
      const parsed = parseNostrMessage(message);
      expect(parsed).not.toBeNull();
      if (parsed) {
        expect(parsed.type).toBe('NOTICE');
        expect(parsed.payload).toBe('test message');
      }
    });

    it('should parse OK message', () => {
      const message = ['OK', 'event1', 'true', 'success'];
      const parsed = parseNostrMessage(message);
      expect(parsed).not.toBeNull();
      if (parsed) {
        expect(parsed.type).toBe('OK');
        if (parsed.payload) {
          expect(parsed.payload).toEqual(['event1', true, 'success']);
        }
      }
    });

    it('should throw error for invalid message', () => {
      expect(() => parseNostrMessage('invalid')).toThrow('Invalid relay message: not an array');
      expect(() => parseNostrMessage([123])).toThrow('Invalid relay message: first element not a string');
      expect(() => parseNostrMessage(['UNKNOWN'])).toThrow('Unknown message type: UNKNOWN');
    });
  });

  describe('Event Creation', () => {
    const now = Math.floor(Date.now() / 1000);

    it('should create metadata event', () => {
      const metadata = { name: 'test', about: 'test user' };
      const event = createMetadataEvent(metadata);
      expect(event.kind).toBe(NostrEventKind.SET_METADATA);
      expect(JSON.parse(event.content)).toEqual(metadata);
      expect(event.created_at).toBeGreaterThanOrEqual(now);
      expect(event.tags).toEqual([]);
    });

    it('should create text note event', () => {
      const content = 'Hello world';
      const replyTo = 'event123';
      const mentions = ['pubkey123'];
      const event = createTextNoteEvent(content, replyTo, mentions);
      expect(event.kind).toBe(NostrEventKind.TEXT_NOTE);
      expect(event.content).toBe(content);
      expect(event.created_at).toBeGreaterThanOrEqual(now);
      expect(event.tags).toContainEqual(['e', replyTo]);
      expect(event.tags).toContainEqual(['p', mentions[0]]);
    });

    it('should create direct message event', () => {
      const recipientPubkey = 'pubkey123';
      const content = 'Secret message';
      const event = createDirectMessageEvent(recipientPubkey, content);
      expect(event.kind).toBe(NostrEventKind.ENCRYPTED_DIRECT_MESSAGE);
      expect(event.content).toBe(content);
      expect(event.created_at).toBeGreaterThanOrEqual(now);
      expect(event.tags).toContainEqual(['p', recipientPubkey]);
    });

    it('should create channel message event', () => {
      const channelId = 'channel123';
      const content = 'Channel message';
      const replyTo = 'event123';
      const event = createChannelMessageEvent(channelId, content, replyTo);
      expect(event.kind).toBe(NostrEventKind.CHANNEL_MESSAGE);
      expect(event.content).toBe(content);
      expect(event.created_at).toBeGreaterThanOrEqual(now);
      expect(event.tags).toContainEqual(['e', channelId, '', 'root']);
      expect(event.tags).toContainEqual(['e', replyTo, '', 'reply']);
    });
  });

  describe('Event Analysis', () => {
    const mockEvent: NostrEvent = {
      kind: NostrEventKind.TEXT_NOTE,
      content: 'test',
      created_at: 1234567890,
      tags: [
        ['e', 'event1'],
        ['e', 'event2'],
        ['p', 'pubkey1'],
        ['p', 'pubkey2']
      ],
      pubkey: { hex: 'abc123', bytes: new Uint8Array() }
    };

    it('should extract referenced events', () => {
      const refs = extractReferencedEvents(mockEvent);
      expect(refs).toEqual(['event1', 'event2']);
    });

    it('should extract mentioned pubkeys', () => {
      const mentions = extractMentionedPubkeys(mockEvent);
      expect(mentions).toEqual(['pubkey1', 'pubkey2']);
    });
  });

  describe('Filter Creation', () => {
    it('should create kind filter', () => {
      const filter = createKindFilter(1, 10);
      expect(filter).toEqual({ kinds: [1], limit: 10 });
    });

    it('should create author filter', () => {
      const filter = createAuthorFilter('pubkey123', [1, 2], 10);
      expect(filter).toEqual({
        authors: ['pubkey123'],
        kinds: [1, 2],
        limit: 10
      });
    });

    it('should create reply filter', () => {
      const filter = createReplyFilter('event123', 10);
      expect(filter).toEqual({
        '#e': ['event123'],
        kinds: [NostrEventKind.TEXT_NOTE, NostrEventKind.CHANNEL_MESSAGE],
        limit: 10
      });
    });
  });
});
