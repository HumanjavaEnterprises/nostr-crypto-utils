"use strict";
/**
 * @module nips/nip-59
 * @description NIP-59 Gift Wrap — encapsulate any event as a rumor → seal
 * (`kind 13`) → gift wrap (`kind 1059` / ephemeral `kind 21059`), using
 * NIP-44 encryption. Obscures author, recipient, and content metadata.
 * @see https://github.com/nostr-protocol/nips/blob/master/59.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.KIND_GIFT_WRAP_EPHEMERAL = exports.KIND_GIFT_WRAP = exports.KIND_SEAL = void 0;
exports.createRumor = createRumor;
exports.createSeal = createSeal;
exports.createGiftWrap = createGiftWrap;
exports.wrapEvent = wrapEvent;
exports.unwrapEvent = unwrapEvent;
const utils_js_1 = require("@noble/hashes/utils.js");
const nip_44_js_1 = require("./nip-44.js");
const crypto_js_1 = require("../crypto.js");
const creation_js_1 = require("../event/creation.js");
/** Seal event kind. */
exports.KIND_SEAL = 13;
/** Gift wrap event kind (persistent). */
exports.KIND_GIFT_WRAP = 1059;
/** Ephemeral gift wrap event kind (relays MUST NOT store). */
exports.KIND_GIFT_WRAP_EPHEMERAL = 21059;
const TWO_DAYS_SECONDS = 2 * 24 * 60 * 60;
/** Random unix timestamp within the last two days (metadata obfuscation, NIP-59). */
function randomPastTimestamp() {
    const now = Math.floor(Date.now() / 1000);
    return now - Math.floor(Math.random() * TWO_DAYS_SECONDS);
}
/**
 * Build a rumor (unsigned event with a computed `id`) authored by `senderPubkey`.
 */
async function createRumor(event, senderPubkey) {
    const base = {
        kind: event.kind ?? 1,
        created_at: event.created_at ?? Math.floor(Date.now() / 1000),
        tags: event.tags ?? [],
        content: event.content ?? '',
        pubkey: senderPubkey,
    };
    const id = await (0, creation_js_1.getEventHash)(base);
    return { ...base, id };
}
/**
 * Seal a rumor (`kind 13`): NIP-44-encrypt the rumor to the recipient and sign
 * with the sender's real key. Tags are always empty; no `p` tag is added.
 */
async function createSeal(rumor, senderPrivateKey, recipientPublicKey) {
    const privBytes = senderPrivateKey instanceof Uint8Array ? senderPrivateKey : (0, utils_js_1.hexToBytes)(senderPrivateKey);
    const ck = (0, nip_44_js_1.getConversationKey)(privBytes, recipientPublicKey);
    const content = (0, nip_44_js_1.encrypt)(JSON.stringify(rumor), ck);
    return (0, crypto_js_1.finalizeEvent)({ kind: exports.KIND_SEAL, content, tags: [], created_at: randomPastTimestamp() }, senderPrivateKey);
}
/**
 * Gift-wrap a seal (`kind 1059`/`21059`): NIP-44-encrypt the seal to the
 * recipient with a fresh one-time keypair, signed by that ephemeral key.
 */
async function createGiftWrap(seal, recipientPublicKey, opts = {}) {
    const ephemeral = await (0, crypto_js_1.generateKeyPair)();
    const ck = (0, nip_44_js_1.getConversationKey)((0, utils_js_1.hexToBytes)(ephemeral.privateKey), recipientPublicKey);
    const content = (0, nip_44_js_1.encrypt)(JSON.stringify(seal), ck);
    const pTag = opts.relayUrl
        ? ['p', recipientPublicKey, opts.relayUrl]
        : ['p', recipientPublicKey];
    return (0, crypto_js_1.finalizeEvent)({
        kind: opts.ephemeral ? exports.KIND_GIFT_WRAP_EPHEMERAL : exports.KIND_GIFT_WRAP,
        content,
        tags: [pTag],
        created_at: randomPastTimestamp(),
    }, ephemeral.privateKey);
}
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
async function wrapEvent(rumor, senderPrivateKey, recipientPublicKey, opts = {}) {
    const seal = await createSeal(rumor, senderPrivateKey, recipientPublicKey);
    return createGiftWrap(seal, recipientPublicKey, opts);
}
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
async function unwrapEvent(giftWrap, recipientPrivateKey) {
    const recipientPrivBytes = recipientPrivateKey instanceof Uint8Array ? recipientPrivateKey : (0, utils_js_1.hexToBytes)(recipientPrivateKey);
    const wrapKey = (0, nip_44_js_1.getConversationKey)(recipientPrivBytes, giftWrap.pubkey);
    const seal = JSON.parse((0, nip_44_js_1.decrypt)(giftWrap.content, wrapKey));
    if (seal.kind !== exports.KIND_SEAL)
        throw new Error('gift wrap did not contain a kind 13 seal');
    if (!(await (0, crypto_js_1.verifySignature)(seal)))
        throw new Error('invalid seal signature');
    const sealKey = (0, nip_44_js_1.getConversationKey)(recipientPrivBytes, seal.pubkey);
    const rumor = JSON.parse((0, nip_44_js_1.decrypt)(seal.content, sealKey));
    if (rumor.pubkey !== seal.pubkey) {
        throw new Error('rumor author does not match seal author');
    }
    return rumor;
}
//# sourceMappingURL=nip-59.js.map