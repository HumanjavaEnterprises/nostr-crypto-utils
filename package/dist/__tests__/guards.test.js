import { describe, it, expect } from 'vitest';
import { isNostrEvent, isSignedNostrEvent } from '../types/guards';
describe('Type Guards', () => {
    describe('isNostrEvent', () => {
        it('should return true for valid NostrEvent with all fields', () => {
            const event = {
                kind: 1,
                created_at: Math.floor(Date.now() / 1000),
                content: 'Hello, Nostr!',
                tags: [['p', '1234']],
                pubkey: '0123456789abcdef'
            };
            expect(isNostrEvent(event)).toBe(true);
        });
        it('should return true for valid NostrEvent with only required fields', () => {
            const event = {
                kind: 1,
                content: 'Minimal event',
                created_at: Math.floor(Date.now() / 1000),
                tags: []
            };
            expect(isNostrEvent(event)).toBe(true);
        });
        it('should return true for valid NostrEvent with empty tags', () => {
            const event = {
                kind: 1,
                content: 'Empty tags',
                created_at: Math.floor(Date.now() / 1000),
                tags: []
            };
            expect(isNostrEvent(event)).toBe(true);
        });
        it('should return false for invalid NostrEvent missing required fields', () => {
            const event = {
                created_at: Math.floor(Date.now() / 1000),
                content: 'Missing kind'
            };
            expect(isNostrEvent(event)).toBe(false);
        });
        it('should return false for invalid NostrEvent with wrong field types', () => {
            const event = {
                kind: '1', // should be number
                content: 123, // should be string
                tags: ['not an array of arrays']
            };
            expect(isNostrEvent(event)).toBe(false);
        });
    });
    describe('isSignedNostrEvent', () => {
        it('should return true for valid signed NostrEvent', () => {
            const event = {
                kind: 1,
                created_at: Math.floor(Date.now() / 1000),
                content: 'Signed event',
                tags: [],
                pubkey: '0123456789abcdef',
                id: '0123456789abcdef',
                sig: '0123456789abcdef'
            };
            expect(isSignedNostrEvent(event)).toBe(true);
        });
        it('should return false for unsigned NostrEvent', () => {
            const event = {
                kind: 1,
                created_at: Math.floor(Date.now() / 1000),
                content: 'Unsigned event',
                tags: [],
                pubkey: '0123456789abcdef'
            };
            expect(isSignedNostrEvent(event)).toBe(false);
        });
        it('should return false for signed event with missing required fields', () => {
            const event = {
                content: 'Missing fields',
                id: '0123456789abcdef',
                sig: '0123456789abcdef'
            };
            expect(isSignedNostrEvent(event)).toBe(false);
        });
    });
});
