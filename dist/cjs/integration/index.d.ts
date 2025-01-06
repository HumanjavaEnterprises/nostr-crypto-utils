/**
 * @module integration
 * @description Integration tests for Nostr crypto utilities
 */
import { SignedNostrEvent } from '../types/index.js';
/**
 * Create and sign a test event
 */
export declare function createTestEvent(): Promise<SignedNostrEvent>;
/**
 * Verify a test event
 */
export declare function verifyTestEvent(event: SignedNostrEvent): Promise<boolean>;
//# sourceMappingURL=index.d.ts.map