"use strict";
/**
 * @module nips/nip-17
 * @description NIP-17 Private Direct Messages — encrypted chat using NIP-44
 * encryption and NIP-59 gift-wrapping. Builds unsigned `kind 14` chat rumors,
 * seals + gift-wraps them to each recipient (and the sender's own copy), and
 * unwraps received gift wraps back into the rumor.
 * @see https://github.com/nostr-protocol/nips/blob/master/17.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.KIND_FILE_MESSAGE = exports.KIND_CHAT_MESSAGE = void 0;
exports.createChatRumor = createChatRumor;
exports.createDirectMessage = createDirectMessage;
exports.readDirectMessage = readDirectMessage;
const nip_59_1 = require("./nip-59");
const crypto_1 = require("../crypto");
/** Chat message rumor kind. */
exports.KIND_CHAT_MESSAGE = 14;
/** File message rumor kind. */
exports.KIND_FILE_MESSAGE = 15;
/**
 * Build the unsigned `kind 14` (or 15) chat rumor for a room.
 * The room is defined by the sender + the set of recipient `p` tags.
 */
async function createChatRumor(senderPubkey, params) {
    const tags = params.recipients.map((pk) => params.relayUrl ? ['p', pk, params.relayUrl] : ['p', pk]);
    if (params.replyTo) {
        tags.push(params.relayUrl ? ['e', params.replyTo, params.relayUrl] : ['e', params.replyTo]);
    }
    if (params.subject)
        tags.push(['subject', params.subject]);
    return (0, nip_59_1.createRumor)({
        kind: params.kind ?? exports.KIND_CHAT_MESSAGE,
        content: params.content,
        tags,
        created_at: params.created_at,
    }, senderPubkey);
}
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
async function createDirectMessage(senderPrivateKey, params) {
    const senderPubkey = (0, crypto_1.getPublicKeySync)(senderPrivateKey);
    const rumor = await createChatRumor(senderPubkey, params);
    // Wrap for each recipient and the sender's own copy (deduped).
    const targets = Array.from(new Set([...params.recipients, senderPubkey]));
    const wrapped = [];
    for (const recipient of targets) {
        const giftWrap = await (0, nip_59_1.wrapEvent)(rumor, senderPrivateKey, recipient, {
            relayUrl: params.relayUrl,
        });
        wrapped.push({ recipient, giftWrap });
    }
    return wrapped;
}
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
async function readDirectMessage(giftWrap, recipientPrivateKey) {
    return (0, nip_59_1.unwrapEvent)(giftWrap, recipientPrivateKey);
}
//# sourceMappingURL=nip-17.js.map