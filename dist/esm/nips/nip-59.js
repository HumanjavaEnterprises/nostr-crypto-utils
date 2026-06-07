/**
 * @module nips/nip-59
 * @description NIP-59 Gift Wrap — encapsulate any event as a rumor → seal
 * (`kind 13`) → gift wrap (`kind 1059` / ephemeral `kind 21059`), using
 * NIP-44 encryption. Obscures author, recipient, and content metadata.
 * @see https://github.com/nostr-protocol/nips/blob/master/59.md
 */
import { hexToBytes } from '@noble/hashes/utils.js';
import { getConversationKey, encrypt, decrypt } from './nip-44';
import { finalizeEvent, generateKeyPair, verifySignature } from '../crypto';
import { getEventHash } from '../event/creation';
/** Seal event kind. */
export const KIND_SEAL = 13;
/** Gift wrap event kind (persistent). */
export const KIND_GIFT_WRAP = 1059;
/** Ephemeral gift wrap event kind (relays MUST NOT store). */
export const KIND_GIFT_WRAP_EPHEMERAL = 21059;
const TWO_DAYS_SECONDS = 2 * 24 * 60 * 60;
/** Random unix timestamp within the last two days (metadata obfuscation, NIP-59). */
function randomPastTimestamp() {
    const now = Math.floor(Date.now() / 1000);
    return now - Math.floor(Math.random() * TWO_DAYS_SECONDS);
}
/**
 * Build a rumor (unsigned event with a computed `id`) authored by `senderPubkey`.
 */
export async function createRumor(event, senderPubkey) {
    const base = {
        kind: event.kind ?? 1,
        created_at: event.created_at ?? Math.floor(Date.now() / 1000),
        tags: event.tags ?? [],
        content: event.content ?? '',
        pubkey: senderPubkey,
    };
    const id = await getEventHash(base);
    return { ...base, id };
}
/**
 * Seal a rumor (`kind 13`): NIP-44-encrypt the rumor to the recipient and sign
 * with the sender's real key. Tags are always empty; no `p` tag is added.
 */
export async function createSeal(rumor, senderPrivateKey, recipientPublicKey) {
    const privBytes = senderPrivateKey instanceof Uint8Array ? senderPrivateKey : hexToBytes(senderPrivateKey);
    const ck = getConversationKey(privBytes, recipientPublicKey);
    const content = encrypt(JSON.stringify(rumor), ck);
    return finalizeEvent({ kind: KIND_SEAL, content, tags: [], created_at: randomPastTimestamp() }, senderPrivateKey);
}
/**
 * Gift-wrap a seal (`kind 1059`/`21059`): NIP-44-encrypt the seal to the
 * recipient with a fresh one-time keypair, signed by that ephemeral key.
 */
export async function createGiftWrap(seal, recipientPublicKey, opts = {}) {
    const ephemeral = await generateKeyPair();
    const ck = getConversationKey(hexToBytes(ephemeral.privateKey), recipientPublicKey);
    const content = encrypt(JSON.stringify(seal), ck);
    const pTag = opts.relayUrl
        ? ['p', recipientPublicKey, opts.relayUrl]
        : ['p', recipientPublicKey];
    return finalizeEvent({
        kind: opts.ephemeral ? KIND_GIFT_WRAP_EPHEMERAL : KIND_GIFT_WRAP,
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
export async function wrapEvent(rumor, senderPrivateKey, recipientPublicKey, opts = {}) {
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
export async function unwrapEvent(giftWrap, recipientPrivateKey) {
    const recipientPrivBytes = recipientPrivateKey instanceof Uint8Array ? recipientPrivateKey : hexToBytes(recipientPrivateKey);
    const wrapKey = getConversationKey(recipientPrivBytes, giftWrap.pubkey);
    const seal = JSON.parse(decrypt(giftWrap.content, wrapKey));
    if (seal.kind !== KIND_SEAL)
        throw new Error('gift wrap did not contain a kind 13 seal');
    if (!(await verifySignature(seal)))
        throw new Error('invalid seal signature');
    const sealKey = getConversationKey(recipientPrivBytes, seal.pubkey);
    const rumor = JSON.parse(decrypt(seal.content, sealKey));
    if (rumor.pubkey !== seal.pubkey) {
        throw new Error('rumor author does not match seal author');
    }
    return rumor;
}
//# sourceMappingURL=nip-59.js.map