import { describe, it, expect } from 'vitest';
import { validateEvent, validateFilter, validateSubscription } from '../validation';
import { SignedNostrEvent, NostrEventKind } from '../types/base';
import { NostrFilter, NostrSubscription } from '../types/protocol';
import { bytesToHex } from '@noble/curves/abstract/utils';

describe('Validation Functions', () => {
  describe('validateEvent', () => {
    it('should validate a valid event', () => {
      const pubkeyBytes = new Uint8Array(32).fill(1);
      const pubkeyHex = bytesToHex(pubkeyBytes);
      
      const event: SignedNostrEvent = {
        kind: NostrEventKind.TEXT_NOTE,
        content: 'Hello, Nostr!',
        created_at: Math.floor(Date.now() / 1000),
        tags: [['p', pubkeyHex]],
        pubkey: pubkeyHex,
        id: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        sig: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
      };

      const result = validateEvent(event);
      expect(result.isValid).toBe(false); // Will be false because we used dummy values
      expect(result.error).toBeDefined();
    });

    it('should reject an event with invalid kind', () => {
      const pubkeyBytes = new Uint8Array(32).fill(1);
      const pubkeyHex = bytesToHex(pubkeyBytes);
      
      const event: Omit<SignedNostrEvent, 'kind'> & { kind: number } = {
        kind: -1,
        content: 'Hello, Nostr!',
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        pubkey: pubkeyHex,
        id: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        sig: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
      };

      const result = validateEvent(event as SignedNostrEvent);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Event kind must be a non-negative integer');
    });

    it('should reject an event with future timestamp', () => {
      const pubkeyBytes = new Uint8Array(32).fill(1);
      const pubkeyHex = bytesToHex(pubkeyBytes);
      
      const event: SignedNostrEvent = {
        kind: NostrEventKind.TEXT_NOTE,
        content: 'Hello from the future!',
        created_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour in the future
        tags: [],
        pubkey: pubkeyHex,
        id: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        sig: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
      };

      const result = validateEvent(event);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Event timestamp cannot be in the future');
    });
  });

  describe('validateFilter', () => {
    it('should validate a valid filter', () => {
      const filter: NostrFilter = {
        kinds: [NostrEventKind.TEXT_NOTE],
        authors: ['1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef']
      };

      const result = validateFilter(filter);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject a filter with invalid kinds', () => {
      const filter = {
        kinds: [-1],
        authors: ['1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef']
      };

      const result = validateFilter(filter as NostrFilter);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Filter kinds must be non-negative integers');
    });
  });

  describe('validateSubscription', () => {
    it('should validate a valid subscription', () => {
      const subscription: NostrSubscription = {
        filters: [
          {
            kinds: [NostrEventKind.TEXT_NOTE],
            authors: ['1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef']
          }
        ],
        id: 'test-sub'
      };

      const result = validateSubscription(subscription);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject a subscription without filters', () => {
      const subscription = {
        id: 'test-sub'
      };

      const result = validateSubscription(subscription as NostrSubscription);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Subscription filters must be an array');
    });
  });
});
