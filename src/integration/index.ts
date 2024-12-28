/**
 * Integration module for testing full Nostr protocol flows
 */

import { NostrEvent, SignedNostrEvent, NostrEventKind } from '../types/base';
import { generateKeyPair } from '../crypto/keys';
import { signEvent } from '../crypto/events';
import { verifySignature } from '../crypto/events';

/**
 * Create and sign a test event
 */
export async function createTestEvent(): Promise<SignedNostrEvent> {
    const keyPair = await generateKeyPair();
    const event: NostrEvent = {
        kind: NostrEventKind.TEXT_NOTE,
        content: 'Test message',
        tags: [],
        created_at: Math.floor(Date.now() / 1000),
        pubkey: keyPair.publicKey.hex
    };
    
    return signEvent(event, keyPair.privateKey);
}

/**
 * Verify a test event
 */
export async function verifyTestEvent(event: SignedNostrEvent): Promise<boolean> {
    return verifySignature(event);
}
