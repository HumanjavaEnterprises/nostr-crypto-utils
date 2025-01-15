import {
  NostrEventKind,
  SignedNostrEvent,
  isNostrEvent,
  isSignedNostrEvent,
  isNostrFilter,
  NostrFilter
} from '../types';

import { describe, it, expect } from 'vitest';

describe('Type Guards', () => {
  describe('Event Types', () => {
    it('should validate a SignedNostrEvent', () => {
      const signedEvent: SignedNostrEvent = {
        kind: NostrEventKind.TEXT_NOTE,
        created_at: Math.floor(Date.now() / 1000),
        content: 'Hello, Nostr!',
        tags: [['p', '1234'], ['t', 'test']],
        pubkey: '0123456789abcdef',
        id: '0123456789abcdef',
        sig: '0123456789abcdef'
      };
      
      expect(isSignedNostrEvent(signedEvent)).toBe(true);
    });

    it('should handle NIP-42 authentication events', () => {
      const authEvent: SignedNostrEvent = {
        kind: NostrEventKind.AUTH_RESPONSE,
        created_at: Math.floor(Date.now() / 1000),
        content: 'challenge-response',
        tags: [['challenge', '1234']],
        pubkey: '0123456789abcdef',
        id: '0123456789abcdef',
        sig: '0123456789abcdef'
      };
      
      expect(isSignedNostrEvent(authEvent)).toBe(true);
      expect(authEvent.kind).toBe(NostrEventKind.AUTH_RESPONSE);
    });
  });

  describe('isNostrEvent', () => {
    it('should validate a valid NostrEvent', () => {
      const event: SignedNostrEvent = {
        kind: NostrEventKind.TEXT_NOTE,
        content: 'Hello, Nostr!',
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        pubkey: '0123456789abcdef',
        id: '0123456789abcdef',
        sig: '0123456789abcdef'
      };

      expect(isNostrEvent(event)).toBe(true);
    });
  });

  describe('isNostrFilter', () => {
    it('should validate a valid NostrFilter', () => {
      const validFilter: NostrFilter = {
        ids: ['1234', '5678'],
        authors: ['abcd', 'efgh'],
        kinds: [NostrEventKind.TEXT_NOTE, NostrEventKind.AUTH_RESPONSE],
        since: 123,
        until: 456,
        limit: 10,
        '#e': ['1234'],
        '#p': ['5678']
      };

      expect(isNostrFilter(validFilter)).toBe(true);
    });
  });
});
