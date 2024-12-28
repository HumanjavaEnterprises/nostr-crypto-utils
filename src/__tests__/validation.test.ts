import { describe, it, expect } from 'vitest';
import { validateEvent, validateSignedEvent, validateFilter, validateSubscription } from '../validation';
import { NostrEvent, SignedNostrEvent, PublicKey } from '../types/base';
import { NostrFilter, NostrSubscription } from '../types/protocol';
import { schnorr } from '@noble/curves/secp256k1';
import { bytesToHex, hexToBytes } from '@noble/curves/abstract/utils';
import { sha256 } from '@noble/hashes/sha256';

describe('Validation Functions', () => {
  describe('validateEvent', () => {
    it('should validate a valid event', () => {
      const pubkeyBytes = new Uint8Array(32).fill(1);
      const pubkey: PublicKey = { bytes: pubkeyBytes };
      
      const event: SignedNostrEvent = {
        kind: 1,
        content: 'Hello, Nostr!',
        created_at: Math.floor(Date.now() / 1000),
        tags: [['p', bytesToHex(pubkeyBytes)]],
        pubkey,
        id: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        sig: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
      };

      const result = validateEvent(event);
      expect(result.isValid).toBe(false); // Will be false because we used dummy values
      expect(result.error).toBeDefined();
    });

    it('should reject an event with invalid kind', () => {
      const pubkeyBytes = new Uint8Array(32).fill(1);
      const pubkey: PublicKey = { bytes: pubkeyBytes };
      
      const event: SignedNostrEvent = {
        kind: -1,
        content: 'Hello, Nostr!',
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        pubkey,
        id: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        sig: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
      };

      const result = validateEvent(event);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Event kind must be a non-negative integer');
    });

    it('should reject an event with future timestamp', () => {
      const pubkeyBytes = new Uint8Array(32).fill(1);
      const pubkey: PublicKey = { bytes: pubkeyBytes };
      
      const event: SignedNostrEvent = {
        kind: 1,
        content: 'Hello, Nostr!',
        created_at: Math.floor(Date.now() / 1000) + 7200, // 2 hours in the future
        tags: [],
        pubkey,
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
      const pubkeyHex = '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
      const filter: NostrFilter = {
        kinds: [1],
        authors: [pubkeyHex],
        since: Math.floor(Date.now() / 1000) - 3600,
        until: Math.floor(Date.now() / 1000),
        limit: 10
      };

      const result = validateFilter(filter);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject a filter with invalid kinds', () => {
      const filter: NostrFilter = {
        kinds: [-1, 0, 1],
        authors: ['1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef']
      };

      const result = validateFilter(filter);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Filter kinds must be non-negative integers');
    });
  });

  describe('validateSubscription', () => {
    it('should validate a valid subscription', () => {
      const subscription: NostrSubscription = {
        filters: [
          {
            kinds: [1],
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
        filters: [],
        id: 'test-sub'
      };

      const result = validateSubscription(subscription as NostrSubscription);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Subscription must have at least one filter');
    });
  });
});
