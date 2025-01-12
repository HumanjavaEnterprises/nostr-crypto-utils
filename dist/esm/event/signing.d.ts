/**
 * @module event/signing
 * @description Event signing and verification utilities for Nostr
 */
import type { NostrEvent, SignedNostrEvent } from '../types';
/**
 * Signs a Nostr event with a private key (NIP-01)
 * @param event - Event to sign
 * @param privateKey - Private key in hex format
 * @returns Signed event
 */
export declare function signEvent(event: NostrEvent, privateKey: string): Promise<SignedNostrEvent>;
/**
 * Verifies the signature of a signed Nostr event (NIP-01)
 * @param event - Event to verify
 * @returns True if signature is valid
 */
export declare function verifySignature(event: SignedNostrEvent): boolean;
//# sourceMappingURL=signing.d.ts.map