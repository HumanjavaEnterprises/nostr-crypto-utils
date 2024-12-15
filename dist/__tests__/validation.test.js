import { validateEvent, validateSignedEvent, validateFilter, validateSubscription } from '../validation';
describe('Validation Functions', () => {
    describe('validateEvent', () => {
        it('should validate a valid event', () => {
            const event = {
                kind: 1,
                content: 'Hello, Nostr!',
                created_at: Math.floor(Date.now() / 1000),
                tags: [['p', '1234567890abcdef']],
                pubkey: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
            };
            const result = validateEvent(event);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
        it('should reject an event with invalid kind', () => {
            const event = {
                kind: -1,
                content: 'Hello, Nostr!',
                created_at: Math.floor(Date.now() / 1000),
                tags: [],
                pubkey: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
            };
            const result = validateEvent(event);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Event kind must be a non-negative integer');
        });
        it('should reject an event with future timestamp', () => {
            const event = {
                kind: 1,
                content: 'Hello, Nostr!',
                created_at: Math.floor(Date.now() / 1000) + 7200, // 2 hours in the future
                tags: [],
                pubkey: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
            };
            const result = validateEvent(event);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Event timestamp is too far in the future');
        });
    });
    describe('validateSignedEvent', () => {
        it('should validate a valid signed event', () => {
            const event = {
                id: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
                sig: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
                kind: 1,
                content: 'Hello, Nostr!',
                created_at: Math.floor(Date.now() / 1000),
                tags: [],
                pubkey: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
            };
            const result = validateSignedEvent(event);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
        it('should reject an event with invalid signature format', () => {
            const event = {
                id: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
                sig: 'invalid-signature',
                kind: 1,
                content: 'Hello, Nostr!',
                created_at: Math.floor(Date.now() / 1000),
                tags: [],
                pubkey: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
            };
            const result = validateSignedEvent(event);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Invalid signature format');
        });
    });
    describe('validateFilter', () => {
        it('should validate a valid filter', () => {
            const filter = {
                kinds: [1, 2],
                authors: ['1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'],
                since: Math.floor(Date.now() / 1000) - 3600,
                until: Math.floor(Date.now() / 1000),
                limit: 100
            };
            const result = validateFilter(filter);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
        it('should reject a filter with invalid timestamps', () => {
            const filter = {
                kinds: [1],
                since: Math.floor(Date.now() / 1000),
                until: Math.floor(Date.now() / 1000) - 3600 // until before since
            };
            const result = validateFilter(filter);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('since timestamp cannot be greater than until timestamp');
        });
    });
    describe('validateSubscription', () => {
        it('should validate a valid subscription', () => {
            const subscription = {
                id: 'sub1',
                filters: [{
                        kinds: [1],
                        limit: 100
                    }]
            };
            const result = validateSubscription(subscription);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
        it('should reject a subscription without filters', () => {
            const subscription = {
                id: 'sub1',
                filters: []
            };
            const result = validateSubscription(subscription);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Subscription must contain at least one filter');
        });
    });
});
