/**
 * @module integration
 * @description Integration tests for Nostr crypto utilities
 */

import { generateKeyPair, getPublicKey } from '../crypto.js';
import { createEvent, signEvent, verifySignature } from '../crypto.js';
import { NostrEvent, SignedNostrEvent, NostrEventKind } from '../types/index.js';

/**
 * Create and sign a test event
 */
export async function createTestEvent(): Promise<SignedNostrEvent> {
    const keyPair = await generateKeyPair();
    const publicKey = await getPublicKey(keyPair.privateKey);
    const event: NostrEvent = createEvent({
        kind: NostrEventKind.TEXT_NOTE,
        content: 'Test message',
        pubkey: publicKey.hex
    });
    
    return signEvent(event, keyPair.privateKey);
}

/**
 * Verify a test event
 */
export async function verifyTestEvent(event: SignedNostrEvent): Promise<boolean> {
    return verifySignature(event);
}
