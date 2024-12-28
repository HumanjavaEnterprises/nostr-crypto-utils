/**
 * @module test/integration
 * @description Integration tests for Nostr crypto utils
 */

import { describe, it, expect } from 'vitest';
import { generateKeyPair, signEvent } from '../../crypto';
import { isNostrEvent, isSignedNostrEvent } from '../../types/guards';
import type { NostrEvent } from '../../types/base';

describe('Nostr Crypto Utils Integration', () => {
  it('should generate valid key pairs and sign events', async () => {
    // Generate key pair
    const keyPair = await generateKeyPair();
    expect(keyPair.publicKey).toBeDefined();
    expect(keyPair.privateKey).toBeDefined();

    // Create a test event
    const testEvent: NostrEvent = {
      kind: 1,
      tags: [],
      content: 'Hello, Nostr!',
      pubkey: keyPair.publicKey,
      created_at: Math.floor(Date.now() / 1000)
    };

    // Sign the event
    const signedEvent = await signEvent(testEvent, keyPair.privateKey);
    expect(isSignedNostrEvent(signedEvent)).toBe(true);
    expect(signedEvent.sig).toBeDefined();
    expect(signedEvent.id).toBeDefined();
  });
});
