/**
 * @module nips/nip-59
 * @description NIP-59 Gift Wrap — encapsulate any event as a rumor → seal
 * (`kind 13`) → gift wrap (`kind 1059` / ephemeral `kind 21059`), using
 * NIP-44 encryption. Obscures author, recipient, and content metadata.
 * @see https://github.com/nostr-protocol/nips/blob/master/59.md
 */
import type { NostrEvent, SignedNostrEvent } from '../types/index.js';
/** Seal event kind. */
export declare const KIND_SEAL = 13;
/** Gift wrap event kind (persistent). */
export declare const KIND_GIFT_WRAP = 1059;
/** Ephemeral gift wrap event kind (relays MUST NOT store). */
export declare const KIND_GIFT_WRAP_EPHEMERAL = 21059;
/** A rumor: an unsigned event (no `sig`) carrying a computed `id`. */
export interface Rumor extends NostrEvent {
    /** Event id (sha256 of the serialized event) — present even though unsigned. */
    id: string;
    /** Author public key (hex). Present on a rumor even though it is unsigned. */
    pubkey: string;
}
/** Options for {@link createGiftWrap} / {@link wrapEvent}. */
export interface GiftWrapOptions {
    /** Use the ephemeral gift wrap kind (21059) instead of 1059. */
    ephemeral?: boolean;
    /** Optional relay URL hint added to the recipient `p` tag. */
    relayUrl?: string;
}
/**
 * Build a rumor (unsigned event with a computed `id`) authored by `senderPubkey`.
 */
export declare function createRumor(event: Partial<NostrEvent>, senderPubkey: string): Promise<Rumor>;
/**
 * Seal a rumor (`kind 13`): NIP-44-encrypt the rumor to the recipient and sign
 * with the sender's real key. Tags are always empty; no `p` tag is added.
 */
export declare function createSeal(rumor: Rumor, senderPrivateKey: string | Uint8Array, recipientPublicKey: string): Promise<SignedNostrEvent>;
/**
 * Gift-wrap a seal (`kind 1059`/`21059`): NIP-44-encrypt the seal to the
 * recipient with a fresh one-time keypair, signed by that ephemeral key.
 */
export declare function createGiftWrap(seal: SignedNostrEvent, recipientPublicKey: string, opts?: GiftWrapOptions): Promise<SignedNostrEvent>;
/**
 * Full wrap for one recipient: rumor → seal → gift wrap.
 * @example
 * ```ts
 * import { createRumor, wrapEvent } from 'nostr-crypto-utils/nip59';
 *
 * const rumor = await createRumor({ kind: 1, content: 'hello' }, senderPubkeyHex);
 * const giftWrap = await wrapEvent(rumor, senderPrivkeyHex, recipientPubkeyHex);
 * // giftWrap.kind === 1059, signed by a random one-time key, p-tagged to recipient
 * ```
 */
export declare function wrapEvent(rumor: Rumor, senderPrivateKey: string | Uint8Array, recipientPublicKey: string, opts?: GiftWrapOptions): Promise<SignedNostrEvent>;
/**
 * Unwrap a gift wrap with the recipient's key, returning the inner rumor.
 * Verifies the seal signature and enforces that the seal author equals the
 * rumor author (anti-impersonation, per NIP-17/59).
 * @throws if the seal is missing/invalid or the author binding fails.
 * @example
 * ```ts
 * import { unwrapEvent } from 'nostr-crypto-utils/nip59';
 *
 * const rumor = await unwrapEvent(giftWrap, recipientPrivkeyHex);
 * // rumor.content / rumor.kind / rumor.pubkey (the verified author)
 * ```
 */
export declare function unwrapEvent(giftWrap: SignedNostrEvent, recipientPrivateKey: string | Uint8Array): Promise<Rumor>;
//# sourceMappingURL=nip-59.d.ts.map