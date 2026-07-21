"use strict";
/**
 * @module nips/nip-04
 * @description Implementation of NIP-04 (Encrypted Direct Messages).
 *
 * This module is the SINGLE canonical NIP-04 implementation for the package.
 * The blessed API is:
 *
 *   encryptMessage(message, senderPrivkey: PrivateKey, recipientPubkey: PublicKey): string
 *   decryptMessage(ciphertext, recipientPrivkey: PrivateKey, senderPubkey: PublicKey): string
 *
 * Branded key types (see ../types/keys) make argument-order mistakes a compile
 * error. The ECDH accepts 32-byte x-only Nostr public keys (the only form used
 * on the wire) by prepending the 02 prefix before deriving the shared secret.
 *
 * @see https://github.com/nostr-protocol/nips/blob/master/04.md
 *
 * @deprecated NIP-04 is `unrecommended` upstream — it leaks metadata and uses a
 * weaker scheme. Prefer NIP-17 Private Direct Messages (NIP-44 encryption +
 * NIP-59 gift wrap). Retained for compatibility with legacy events only.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.asPublicKey = exports.asPrivateKey = void 0;
exports.encryptMessage = encryptMessage;
exports.decryptMessage = decryptMessage;
exports.generateSharedSecret = generateSharedSecret;
exports.computeSharedSecret = generateSharedSecret;
const secp256k1_js_1 = require("@noble/curves/secp256k1.js");
const aes_js_1 = require("@noble/ciphers/aes.js");
const utils_js_1 = require("@noble/hashes/utils.js");
const logger_js_1 = require("../utils/logger.js");
const base64_js_1 = require("../encoding/base64.js");
const keys_js_1 = require("../types/keys.js");
const utf8Encoder = new TextEncoder();
const utf8Decoder = new TextDecoder();
/**
 * Derive the NIP-04 shared secret (x-coordinate of the ECDH point).
 * Accepts a 32-byte x-only pubkey (64 hex) — the standard Nostr key format —
 * by prepending the 02 prefix, or an already-prefixed 33-byte pubkey (66 hex).
 */
function deriveSharedX(privHex, pubHex) {
    // Detect the x-only form by LENGTH, not the leading byte. A 32-byte x-only
    // pubkey (64 hex) is a raw x-coordinate whose first byte can itself be 0x02 or
    // 0x03 (~1.5% of keys); the old `startsWith('02'/'03')` check misread those as
    // already-compressed 33-byte keys, skipped the prefix, and passed a 32-byte
    // value to getSharedSecret → "second arg must be public key". 64 hex ⇒ prepend
    // the 02 prefix; a 66-hex compressed key is used as-is.
    const normalizedPub = pubHex.length === 64 ? '02' + pubHex : pubHex;
    const sharedPoint = secp256k1_js_1.secp256k1.getSharedSecret((0, utils_js_1.hexToBytes)(privHex), (0, utils_js_1.hexToBytes)(normalizedPub));
    const sharedX = sharedPoint.slice(1, 33);
    sharedPoint.fill(0);
    return sharedX;
}
/**
 * Encrypt a message using NIP-04 (AES-256-CBC over the ECDH shared secret).
 *
 * @param message - Plaintext message to encrypt
 * @param senderPrivkey - Sender's private key (branded {@link PrivateKey})
 * @param recipientPubkey - Recipient's x-only public key (branded {@link PublicKey})
 * @returns NIP-04 payload: `base64(ciphertext)?iv=base64(iv)`
 */
function encryptMessage(message, senderPrivkey, recipientPubkey) {
    try {
        // Defensive runtime validation (branding is erased at runtime).
        (0, keys_js_1.asPrivateKey)(senderPrivkey);
        const sharedX = deriveSharedX(senderPrivkey, recipientPubkey);
        const iv = (0, utils_js_1.randomBytes)(16);
        const ciphertext = (0, aes_js_1.cbc)(sharedX, iv).encrypt(utf8Encoder.encode(message));
        sharedX.fill(0);
        return (0, base64_js_1.bytesToBase64)(ciphertext) + '?iv=' + (0, base64_js_1.bytesToBase64)(iv);
    }
    catch (error) {
        logger_js_1.logger.error({ error }, 'Failed to encrypt message');
        throw error;
    }
}
/**
 * Decrypt a NIP-04 message.
 *
 * @param ciphertext - NIP-04 payload (`base64(ct)?iv=base64(iv)`), or legacy hex (iv||ct)
 * @param recipientPrivkey - Recipient's private key (branded {@link PrivateKey})
 * @param senderPubkey - Sender's x-only public key (branded {@link PublicKey})
 * @returns Decrypted plaintext
 */
function decryptMessage(ciphertext, recipientPrivkey, senderPubkey) {
    try {
        (0, keys_js_1.asPrivateKey)(recipientPrivkey);
        const sharedX = deriveSharedX(recipientPrivkey, senderPubkey);
        let iv;
        let ct;
        if (ciphertext.includes('?iv=')) {
            // NIP-04 standard format: base64(ciphertext) + "?iv=" + base64(iv)
            const [ctB64, ivB64] = ciphertext.split('?iv=');
            ct = (0, base64_js_1.base64ToBytes)(ctB64);
            iv = (0, base64_js_1.base64ToBytes)(ivB64);
        }
        else {
            // Legacy hex format fallback: first 16 bytes are IV, rest is ciphertext
            const raw = (0, utils_js_1.hexToBytes)(ciphertext);
            iv = raw.slice(0, 16);
            ct = raw.slice(16);
        }
        const plaintext = (0, aes_js_1.cbc)(sharedX, iv).decrypt(ct);
        sharedX.fill(0);
        return utf8Decoder.decode(plaintext);
    }
    catch (error) {
        logger_js_1.logger.error({ error }, 'Failed to decrypt message');
        throw error;
    }
}
/**
 * Generate the NIP-04 shared secret (x-coordinate) for a private/public key pair.
 * @param privateKey - Private key (64 hex)
 * @param publicKey - Public key (64 hex x-only, or 66 hex prefixed)
 */
function generateSharedSecret(privateKey, publicKey) {
    if (!privateKey || !publicKey) {
        throw new Error('Invalid input parameters');
    }
    if (!/^[0-9a-f]{64}$/i.test(privateKey)) {
        throw new Error('Invalid private key format');
    }
    return { sharedSecret: deriveSharedX(privateKey, publicKey) };
}
// Re-export branded key types and constructors so consumers of the nip04
// namespace can build the arguments the canonical API requires.
var keys_js_2 = require("../types/keys.js");
Object.defineProperty(exports, "asPrivateKey", { enumerable: true, get: function () { return keys_js_2.asPrivateKey; } });
Object.defineProperty(exports, "asPublicKey", { enumerable: true, get: function () { return keys_js_2.asPublicKey; } });
//# sourceMappingURL=nip-04.js.map