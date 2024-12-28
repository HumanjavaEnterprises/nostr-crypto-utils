/**
 * Integration module for testing full Nostr protocol flows
 */
import { SignedNostrEvent } from '../types/base';
/**
 * Create and sign a test event
 */
export declare function createTestEvent(): Promise<SignedNostrEvent>;
/**
 * Verify a test event
 */
export declare function verifyTestEvent(event: SignedNostrEvent): Promise<boolean>;
