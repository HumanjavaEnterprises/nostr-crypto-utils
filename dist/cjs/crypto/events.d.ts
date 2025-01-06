/**
 * @module crypto/events
 * @description Event signing and verification for Nostr
 */
import { NostrEvent, SignedNostrEvent } from '../types';
interface EventInput {
    pubkey: string;
    kind?: number;
    content?: string;
    tags?: string[][];
    created_at?: number;
}
/**
 * Creates an unsigned Nostr event
 */
export declare function createEvent(params: EventInput): NostrEvent;
/**
 * Signs a Nostr event
 */
export declare function signEvent(event: NostrEvent, privateKey: string): Promise<SignedNostrEvent>;
/**
 * Verifies a signed Nostr event
 */
export declare function verifySignature(event: SignedNostrEvent): Promise<boolean>;
export {};
//# sourceMappingURL=events.d.ts.map