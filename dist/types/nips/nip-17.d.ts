/**
 * @module nips/nip-17
 * @description NIP-17 Private Direct Messages — encrypted chat using NIP-44
 * encryption and NIP-59 gift-wrapping. Builds unsigned `kind 14` chat rumors,
 * seals + gift-wraps them to each recipient (and the sender's own copy), and
 * unwraps received gift wraps back into the rumor.
 * @see https://github.com/nostr-protocol/nips/blob/master/17.md
 */
import { type Rumor } from './nip-59';
import type { SignedNostrEvent } from '../types';
/** Chat message rumor kind. */
export declare const KIND_CHAT_MESSAGE = 14;
/** File message rumor kind. */
export declare const KIND_FILE_MESSAGE = 15;
/** Parameters for {@link createDirectMessage} / {@link createChatRumor}. */
export interface DirectMessageParams {
    /** Plain-text message body. */
    content: string;
    /** Recipient pubkeys (hex). One for a 1:1 chat; more for a group room. */
    recipients: string[];
    /** Optional relay URL hint placed on `p` tags. */
    relayUrl?: string;
    /** Event id this message replies to (adds an `e` tag). */
    replyTo?: string;
    /** Conversation subject/topic (adds a `subject` tag). */
    subject?: string;
    /** Rumor kind (default 14; use 15 for file messages). */
    kind?: number;
    /** Override created_at (unix seconds) on the rumor; defaults to now. */
    created_at?: number;
}
/** A gift-wrapped copy addressed to a single party (returned by {@link createDirectMessage}). */
export interface WrappedMessage {
    /** The pubkey this gift wrap is addressed to. */
    recipient: string;
    /** The `kind 1059` gift wrap event, ready to publish. */
    giftWrap: SignedNostrEvent;
}
/**
 * Build the unsigned `kind 14` (or 15) chat rumor for a room.
 * The room is defined by the sender + the set of recipient `p` tags.
 */
export declare function createChatRumor(senderPubkey: string, params: DirectMessageParams): Promise<Rumor>;
/**
 * Create gift-wrapped direct messages: one wrap per recipient **plus** one
 * addressed to the sender (their own readable copy), per NIP-17. Publish each
 * `giftWrap` to the corresponding party's DM inbox relays (NIP-17 `kind 10050`).
 * @example
 * ```ts
 * import { createDirectMessage } from 'nostr-crypto-utils/nip17';
 *
 * const wraps = await createDirectMessage(senderPrivkeyHex, {
 *   content: 'hey bob',
 *   recipients: [bobPubkeyHex],
 *   subject: 'dinner', // optional
 * });
 * for (const { recipient, giftWrap } of wraps) {
 *   // publish giftWrap to `recipient`'s DM inbox relays
 * }
 * ```
 */
export declare function createDirectMessage(senderPrivateKey: string | Uint8Array, params: DirectMessageParams): Promise<WrappedMessage[]>;
/**
 * Unwrap a received `kind 1059` gift wrap into its `kind 14` chat rumor.
 * Verifies the seal signature and author binding (via NIP-59).
 * @example
 * ```ts
 * import { readDirectMessage } from 'nostr-crypto-utils/nip17';
 *
 * const message = await readDirectMessage(receivedGiftWrap, recipientPrivkeyHex);
 * // message.kind === 14, message.content, message.pubkey (verified sender)
 * ```
 */
export declare function readDirectMessage(giftWrap: SignedNostrEvent, recipientPrivateKey: string | Uint8Array): Promise<Rumor>;
//# sourceMappingURL=nip-17.d.ts.map