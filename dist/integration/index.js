/**
 * Integration module for testing full Nostr protocol flows
 */
import { generateKeyPair } from '../crypto/keys';
import { signEvent } from '../crypto/events';
import { verifySignature } from '../crypto/events';
/**
 * Create and sign a test event
 */
export async function createTestEvent() {
    const keyPair = await generateKeyPair();
    const event = {
        kind: 1,
        content: 'Test message',
        tags: [],
        created_at: Math.floor(Date.now() / 1000),
        pubkey: keyPair.publicKey
    };
    return signEvent(event, keyPair.privateKey);
}
/**
 * Verify a test event
 */
export async function verifyTestEvent(event) {
    return verifySignature(event);
}
