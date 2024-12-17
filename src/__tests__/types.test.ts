import { 
  isNostrEvent,
  isSignedNostrEvent,
  isNostrFilter,
  isNostrSubscription,
  NostrEvent,
  SignedNostrEvent,
  NostrFilter,
  NostrSubscription,
  NostrEventKind
} from '../types';

import { describe, it, expect } from 'vitest';

describe('Type Guards', () => {
  describe('isNostrEvent', () => {
    it('should validate a valid NostrEvent', () => {
      const validEvent: NostrEvent = {
        kind: NostrEventKind.TEXT_NOTE,
        created_at: Math.floor(Date.now() / 1000),
        content: 'Hello, Nostr!',
        tags: [['p', '1234'], ['t', 'test']],
        pubkey: '0123456789abcdef'
      };
      
      expect(isNostrEvent(validEvent)).toBe(true);
    });

    it('should validate a NostrEvent without optional pubkey', () => {
      const validEvent: NostrEvent = {
        kind: NostrEventKind.TEXT_NOTE,
        created_at: Math.floor(Date.now() / 1000),
        content: 'Hello, Nostr!',
        tags: []
      };
      
      expect(isNostrEvent(validEvent)).toBe(true);
    });

    it('should reject invalid NostrEvent objects', () => {
      const invalidEvents = [
        null,
        undefined,
        {},
        { kind: 'not a number' },
        { kind: 1, created_at: 'not a number' },
        { kind: 1, created_at: 123, content: 42 },
        { kind: 1, created_at: 123, content: 'valid', tags: 'not an array' },
        { kind: 1, created_at: 123, content: 'valid', tags: [['valid'], 42] },
        { kind: 1, created_at: 123, content: 'valid', tags: [], pubkey: 42 }
      ];

      invalidEvents.forEach(event => {
        expect(isNostrEvent(event)).toBe(false);
      });
    });

    it('should handle edge cases for NostrEvent', () => {
      const edgeCases: NostrEvent[] = [
        // Large tag array
        {
          kind: NostrEventKind.TEXT_NOTE,
          created_at: Math.floor(Date.now() / 1000),
          content: 'Test',
          tags: Array(1000).fill(['p', '1234']),
        },
        // Unicode content
        {
          kind: NostrEventKind.TEXT_NOTE,
          created_at: Math.floor(Date.now() / 1000),
          content: '🦄 Unicode test 漢字',
          tags: [],
        },
        // Zero timestamp
        {
          kind: NostrEventKind.TEXT_NOTE,
          created_at: 0,
          content: 'Test',
          tags: [],
        },
        // Reserved event kind
        {
          kind: 10000,
          created_at: Math.floor(Date.now() / 1000),
          content: 'Test',
          tags: [],
        },
        // Empty content
        {
          kind: NostrEventKind.TEXT_NOTE,
          created_at: Math.floor(Date.now() / 1000),
          content: '',
          tags: [],
        }
      ];

      edgeCases.forEach(event => {
        expect(isNostrEvent(event)).toBe(true);
      });
    });
  });

  describe('isSignedNostrEvent', () => {
    it('should validate a valid SignedNostrEvent', () => {
      const validEvent: SignedNostrEvent = {
        kind: NostrEventKind.TEXT_NOTE,
        created_at: Math.floor(Date.now() / 1000),
        content: 'Hello, Nostr!',
        tags: [['p', '1234'], ['t', 'test']],
        pubkey: '0123456789abcdef',
        id: 'event_id_hash',
        sig: 'valid_signature'
      };
      
      expect(isSignedNostrEvent(validEvent)).toBe(true);
    });

    it('should reject invalid SignedNostrEvent objects', () => {
      const invalidEvents = [
        null,
        undefined,
        {},
        { ...validNostrEvent }, // Missing id and sig
        { ...validNostrEvent, id: 42 }, // Wrong id type
        { ...validNostrEvent, id: 'valid', sig: 42 }, // Wrong sig type
        { ...validNostrEvent, id: 'valid', sig: 'valid', pubkey: undefined } // Missing required pubkey
      ];

      invalidEvents.forEach(event => {
        expect(isSignedNostrEvent(event)).toBe(false);
      });
    });
  });

  describe('NostrFilter Type', () => {
    it('should validate filter properties', () => {
      const validFilter: NostrFilter = {
        ids: ['abc123'],
        authors: ['def456'],
        kinds: [1, 2, 3],
        '#e': ['ghi789'],
        '#p': ['jkl012'],
        since: 123456789,
        until: 987654321,
        limit: 100
      };
      expect(validFilter).toBeDefined();
    });
  });

  describe('isNostrFilter', () => {
    it('should validate a valid NostrFilter', () => {
      const validFilter: NostrFilter = {
        ids: ['1234', '5678'],
        authors: ['abcd', 'efgh'],
        kinds: [1, 2, 3],
        '#e': ['event1', 'event2'],
        '#p': ['pubkey1', 'pubkey2'],
        since: 123456789,
        until: 987654321,
        limit: 100
      };
      
      expect(isNostrFilter(validFilter)).toBe(true);
    });

    it('should validate a NostrFilter with partial fields', () => {
      const partialFilters: Partial<NostrFilter>[] = [
        { ids: ['1234'] },
        { authors: ['abcd'] },
        { kinds: [1] },
        { '#e': ['event1'] },
        { '#p': ['pubkey1'] },
        { since: 123456789 },
        { until: 987654321 },
        { limit: 100 }
      ];

      partialFilters.forEach(filter => {
        expect(isNostrFilter(filter)).toBe(true);
      });
    });

    it('should reject invalid NostrFilter objects', () => {
      const invalidFilters = [
        null,
        undefined,
        { ids: [42] },  // Wrong type in array
        { authors: ['valid', 42] },  // Mixed types in array
        { kinds: ['1'] },  // Wrong array type
        { '#e': [42] },  // Wrong type in array
        { '#p': [true] },  // Wrong type in array
        { since: '123' },  // Wrong type
        { until: false },  // Wrong type
        { limit: '100' }  // Wrong type
      ];

      invalidFilters.forEach(filter => {
        expect(isNostrFilter(filter)).toBe(false);
      });
    });

    it('should handle edge cases for NostrFilter', () => {
      const edgeCases: NostrFilter[] = [
        // Multiple tag types
        {
          '#e': ['1234'],
          '#p': ['5678'],
          '#t': ['test'],  // Custom tag
        },
        // Time range edge cases
        {
          since: 0,
          until: Number.MAX_SAFE_INTEGER,
        },
        // Large limit
        {
          limit: Number.MAX_SAFE_INTEGER,
        },
        // Multiple array fields
        {
          ids: ['1', '2', '3'],
          authors: ['a', 'b', 'c'],
          kinds: [1, 2, 3, 10000],
        }
      ];

      edgeCases.forEach(filter => {
        expect(isNostrFilter(filter)).toBe(true);
      });
    });
  });

  describe('isNostrSubscription', () => {
    it('should validate a valid NostrSubscription', () => {
      const validSubscription: NostrSubscription = {
        id: 'sub_123',
        filters: [
          { kinds: [1], limit: 10 },
          { authors: ['abcd'], since: 123456789 }
        ]
      };
      
      expect(isNostrSubscription(validSubscription)).toBe(true);
    });

    it('should validate a NostrSubscription with empty filters', () => {
      const validSubscription: NostrSubscription = {
        id: 'sub_123',
        filters: []
      };
      
      expect(isNostrSubscription(validSubscription)).toBe(true);
    });

    it('should reject invalid NostrSubscription objects', () => {
      const invalidSubscriptions = [
        null,
        undefined,
        {},
        { id: 123, filters: [] },  // Wrong id type
        { id: 'valid' },  // Missing filters
        { id: 'valid', filters: 'not an array' },  // Wrong filters type
        { id: 'valid', filters: [null] },  // Invalid filter
        { id: 'valid', filters: [{ invalid: true }] }  // Invalid filter object
      ];

      invalidSubscriptions.forEach(sub => {
        expect(isNostrSubscription(sub)).toBe(false);
      });
    });
  });
});

// Helper for tests
const validNostrEvent: NostrEvent = {
  kind: NostrEventKind.TEXT_NOTE,
  created_at: Math.floor(Date.now() / 1000),
  content: 'Hello, Nostr!',
  tags: [['p', '1234'], ['t', 'test']],
  pubkey: '0123456789abcdef'
};
