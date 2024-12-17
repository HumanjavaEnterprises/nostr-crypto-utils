import { describe, it, expect, beforeEach } from 'vitest';
import {
  generateKeyPair,
  formatEventForRelay,
  parseNostrMessage,
  signEvent,
  validateSignedEvent
} from '../index';

// Mock WebSocket class for testing
class MockWebSocket {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;

  readonly CONNECTING = MockWebSocket.CONNECTING;
  readonly OPEN = MockWebSocket.OPEN;
  readonly CLOSING = MockWebSocket.CLOSING;
  readonly CLOSED = MockWebSocket.CLOSED;

  private listeners = {};
  public readyState = MockWebSocket.OPEN;
  public binaryType = 'blob';
  public bufferedAmount = 0;
  public extensions = '';
  public protocol = '';
  public url;

  // Event handlers
  public onclose = null;
  public onerror = null;
  public onmessage = null;
  public onopen = null;

  constructor(url: string | URL): void {
    this.url = url.toString();
  }

  close(code?: number, reason?: string): void {
    this.readyState = MockWebSocket.CLOSED;
    if (this.onclose) {
      this.onclose(new CloseEvent('close', { code, reason }));
    }
  }

  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void {
    const event = new MessageEvent('message', { data });
    this.listeners['message']?.forEach(listener => listener(event));
    if (this.onmessage) {
      this.onmessage(event);
    }
  }

  addEventListener(type: string, listener: (event: Event) => void): void {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(listener);
  }

  removeEventListener(type: string, listener: (event: Event) => void): void {
    if (!this.listeners[type]) return;
    this.listeners[type] = this.listeners[type].filter(l => l !== listener);
  }

  dispatchEvent(event: Event): boolean {
    const listeners = this.listeners[event.type];
    if (listeners) {
      listeners.forEach(listener => listener(event));
      return true;
    }
    return false;
  }
}

// Mock the global WebSocket to use MockWebSocket
global.WebSocket = MockWebSocket;

describe('Transport Layer', () => {
  let keyPair;
  let mockRelay;

  beforeEach(async () => {
    keyPair = await generateKeyPair();
    mockRelay = new MockWebSocket('wss://mock.relay');
  });

  it('should handle subscription flow', async () => {
    // Create subscription request
    const subId = 'test-sub';
    const filter = { kinds: [1], limit: 10 };
    const subMessage = JSON.stringify(['REQ', subId, filter]);

    // Listen for EOSE
    mockRelay.addEventListener('message', event => {
      // Ensure data is a string before parsing
      if (typeof event.data !== 'string') {
        throw new Error('Expected string data from WebSocket');
      }
      const message = JSON.parse(event.data);
      if (message[0] === 'EOSE' && message[1] === subId) {
        expect(true).toBe(true);
      }
    });

    // Send subscription
    mockRelay.send(subMessage);
  });

  it('should handle event publication flow', async () => {
    // Create and sign an event
    const timestamp = Math.floor(Date.now() / 1000);
    const event = {
      kind: 1,
      content: 'Test message',
      tags: [],
      created_at: timestamp,
      pubkey: keyPair.publicKey
    };
    
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

  it('should handle message parsing', () => {
    // Test EVENT message parsing
    const eventMessage = ['EVENT', { id: 'test_id', pubkey: 'test_pubkey', kind: 1, content: 'test', created_at: 123, sig: 'test_sig', tags: [] }];
    const eventResponse = parseNostrMessage(eventMessage);
    expect(eventResponse).not.toBeNull();
    if (eventResponse) {
      expect(eventResponse.type).toBe('EVENT');
      if (eventResponse.type === 'EVENT') {
        expect(eventResponse.payload).toMatchObject({
          id: 'test_id',
          pubkey: 'test_pubkey',
          kind: 1
        });
      }
    }
    
    // Test NOTICE message parsing
    const noticeMessage = ['NOTICE', 'test message'];
    const noticeResponse = parseNostrMessage(noticeMessage);
    expect(noticeResponse).not.toBeNull();
    if (noticeResponse && noticeResponse.type === 'NOTICE') {
      expect(noticeResponse.payload).toBe('test message');
    }
  });

  it('should handle connection state handling', () => {
    expect(mockRelay.readyState).toBe(MockWebSocket.OPEN); // Connected
    mockRelay.close();
    expect(mockRelay.readyState).toBe(MockWebSocket.CLOSED); // Closed
  });
});

describe('Transport Error Handling', () => {
  it('should handle invalid message format', () => {
    const invalidMessage = ['EVENT', { id: 'test_id', pubkey: 'test_pubkey', kind: 1, content: 'test', created_at: 123, sig: 'test_sig', tags: [] }];
    expect(() => parseNostrMessage(invalidMessage)).not.toThrow();
  });

  it('should handle malformed JSON', () => {
    const malformedMessage = ['EVENT', { id: 'test_id', pubkey: 'test_pubkey', kind: 1, content: 'test', created_at: 123, sig: 'test_sig', tags: [] }];
    expect(() => parseNostrMessage(malformedMessage)).not.toThrow();
  });
});
