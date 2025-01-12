/**
 * @module integration
 * @description Integration tests for Nostr crypto utilities
 */
import { generateKeyPair, getPublicKey } from '../crypto.js';
import { createEvent, signEvent, verifySignature } from '../crypto.js';
import { NostrEventKind } from '../types/index.js';
/**
 * Create and sign a test event
 */
export async function createTestEvent() {
    const keyPair = await generateKeyPair();
    const publicKey = await getPublicKey(keyPair.privateKey);
    const event = createEvent({
        kind: NostrEventKind.TEXT_NOTE,
        content: 'Test message',
        pubkey: publicKey.hex
    });
    return signEvent(event, keyPair.privateKey);
}
/**
 * Verify a test event
 */
export async function verifyTestEvent(event) {
    return verifySignature(event);
}
//# sourceMappingURL=index.js.map