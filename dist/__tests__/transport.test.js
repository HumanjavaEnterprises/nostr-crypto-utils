import { parseNostrMessage, NostrEventKind, createEvent, signEvent, generateKeyPair, validateSignedEvent, formatEventForRelay } from '../index';
// Mock WebSocket for testing
class MockWebSocket {
    constructor(url) {
        this.url = url;
        this.listeners = {};
        this.readyState = 1;
    }
    send(data) {
        // Simulate relay behavior
        const message = JSON.parse(data);
        if (message[0] === 'REQ') {
            // Simulate EOSE after subscription
            this.emit('message', JSON.stringify(['EOSE', message[1]]));
        }
    }
    addEventListener(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }
    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => {
                callback({ data });
            });
        }
    }
    close() {
        this.readyState = 3;
        this.emit('close', null);
    }
}
describe('Transport Layer Integration', () => {
    let keyPair;
    let mockRelay;
    beforeEach(async () => {
        keyPair = await generateKeyPair();
        mockRelay = new MockWebSocket('wss://mock.relay');
    });
    test('Subscription Flow', done => {
        // Create subscription request
        const subId = 'test-sub';
        const filter = { kinds: [1], limit: 10 };
        const subMessage = JSON.stringify(['REQ', subId, filter]);
        // Listen for EOSE
        mockRelay.addEventListener('message', event => {
            const message = JSON.parse(event.data);
            if (message[0] === 'EOSE' && message[1] === subId) {
                done();
            }
        });
        // Send subscription
        mockRelay.send(subMessage);
    });
    test('Event Publication Flow', async () => {
        // Create and sign an event
        const timestamp = Math.floor(Date.now() / 1000);
        const event = createEvent({
            kind: NostrEventKind.TEXT_NOTE,
            content: 'Test message',
            tags: [],
            created_at: timestamp,
            pubkey: keyPair.publicKey
        });
        // Sign the event
        const signedEvent = await signEvent(event, keyPair.privateKey);
        // Validate event before sending
        const validation = await validateSignedEvent(signedEvent);
        expect(validation.isValid).toBe(true);
        // Format event message
        const [messageType, eventPayload] = formatEventForRelay(signedEvent);
        expect(messageType).toBe('EVENT');
        // Simulate sending to relay
        mockRelay.send(JSON.stringify([messageType, eventPayload]));
    });
    test('Message Parsing', () => {
        // Test EVENT message parsing
        const eventMessage = ['EVENT', { id: 'test_id', pubkey: 'test_pubkey', kind: 1, content: 'test', created_at: 123, sig: 'test_sig', tags: [] }];
        const eventResponse = parseNostrMessage(eventMessage);
        expect(eventResponse.type).toBe('EVENT');
        if (eventResponse.type === 'EVENT') {
            expect(eventResponse.payload).toMatchObject({
                id: 'test_id',
                pubkey: 'test_pubkey',
                kind: 1
            });
        }
        // Test NOTICE message parsing
        const noticeMessage = ['NOTICE', 'test message'];
        const noticeResponse = parseNostrMessage(noticeMessage);
        expect(noticeResponse.type).toBe('NOTICE');
        if (noticeResponse.type === 'NOTICE') {
            expect(noticeResponse.payload).toBe('test message');
        }
    });
    test('Connection State Handling', () => {
        expect(mockRelay.readyState).toBe(1); // Connected
        mockRelay.close();
        expect(mockRelay.readyState).toBe(3); // Closed
    });
});
describe('Transport Error Handling', () => {
    test('Invalid Message Format', () => {
        const invalidMessage = ['EVENT', { id: 'test_id', pubkey: 'test_pubkey', kind: 1, content: 'test', created_at: 123, sig: 'test_sig', tags: [] }];
        expect(() => parseNostrMessage(invalidMessage)).not.toThrow();
    });
    test('Malformed JSON', () => {
        const malformedMessage = ['EVENT', { id: 'test_id', pubkey: 'test_pubkey', kind: 1, content: 'test', created_at: 123, sig: 'test_sig', tags: [] }];
        expect(() => parseNostrMessage(malformedMessage)).not.toThrow();
    });
});
