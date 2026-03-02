"use strict";
/**
 * @module nips/nip-44
 * @description Implementation of NIP-44 (Versioned Encrypted Payloads)
 * @see https://github.com/nostr-protocol/nips/blob/master/44.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.v2 = void 0;
exports.getConversationKey = getConversationKey;
exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.calcPaddedLen = calcPaddedLen;
const chacha_js_1 = require("@noble/ciphers/chacha.js");
const utils_js_1 = require("@noble/ciphers/utils.js");
const secp256k1_1 = require("@noble/curves/secp256k1");
const hkdf_1 = require("@noble/hashes/hkdf");
const hmac_1 = require("@noble/hashes/hmac");
const sha256_1 = require("@noble/hashes/sha256");
const utils_1 = require("@noble/hashes/utils");
const base_1 = require("@scure/base");
const utf8Encoder = new TextEncoder();
const utf8Decoder = new TextDecoder();
const minPlaintextSize = 1;
const maxPlaintextSize = 65535;
/**
 * Calculate padded length for NIP-44 message padding
 */
function calcPaddedLen(len) {
    if (!Number.isSafeInteger(len) || len < 1)
        throw new Error('expected positive integer');
    if (len <= 32)
        return 32;
    const nextPower = 1 << (Math.floor(Math.log2(len - 1)) + 1);
    const chunk = nextPower <= 256 ? 32 : nextPower / 8;
    return chunk * (Math.floor((len - 1) / chunk) + 1);
}
/**
 * Pad plaintext per NIP-44 spec
 */
function pad(plaintext) {
    const unpadded = utf8Encoder.encode(plaintext);
    const unpaddedLen = unpadded.length;
    if (unpaddedLen < minPlaintextSize || unpaddedLen > maxPlaintextSize)
        throw new Error('invalid plaintext length: must be between 1 and 65535 bytes');
    const prefix = new Uint8Array(2);
    new DataView(prefix.buffer).setUint16(0, unpaddedLen, false); // big-endian
    const suffix = new Uint8Array(calcPaddedLen(unpaddedLen) - unpaddedLen);
    return (0, utils_1.concatBytes)(prefix, unpadded, suffix);
}
/**
 * Unpad decrypted message per NIP-44 spec
 */
function unpad(padded) {
    const unpaddedLen = new DataView(padded.buffer, padded.byteOffset).getUint16(0, false);
    const unpadded = padded.subarray(2, 2 + unpaddedLen);
    if (unpaddedLen < minPlaintextSize ||
        unpaddedLen > maxPlaintextSize ||
        unpadded.length !== unpaddedLen ||
        padded.length !== 2 + calcPaddedLen(unpaddedLen)) {
        throw new Error('invalid padding');
    }
    return utf8Decoder.decode(unpadded);
}
/**
 * Derive conversation key from private key and public key using ECDH + HKDF
 */
function getConversationKey(privkeyA, pubkeyB) {
    const sharedPoint = secp256k1_1.secp256k1.getSharedSecret(privkeyA, '02' + pubkeyB);
    const sharedX = sharedPoint.subarray(1, 33);
    return (0, hkdf_1.extract)(sha256_1.sha256, sharedX, utf8Encoder.encode('nip44-v2'));
}
/**
 * Derive message keys (chacha key, chacha nonce, hmac key) from conversation key and nonce
 */
function getMessageKeys(conversationKey, nonce) {
    const keys = (0, hkdf_1.expand)(sha256_1.sha256, conversationKey, nonce, 76);
    return {
        chacha_key: keys.subarray(0, 32),
        chacha_nonce: keys.subarray(32, 44),
        hmac_key: keys.subarray(44, 76),
    };
}
/**
 * Encrypt plaintext using NIP-44 v2
 * @param plaintext - The message to encrypt
 * @param conversationKey - 32-byte conversation key from getConversationKey
 * @param nonce - Optional 32-byte nonce (random if not provided)
 * @returns Base64-encoded encrypted payload
 */
function encrypt(plaintext, conversationKey, nonce = (0, utils_1.randomBytes)(32)) {
    const { chacha_key, chacha_nonce, hmac_key } = getMessageKeys(conversationKey, nonce);
    const padded = pad(plaintext);
    const ciphertext = (0, chacha_js_1.chacha20)(chacha_key, chacha_nonce, padded);
    const mac = (0, hmac_1.hmac)(sha256_1.sha256, hmac_key, (0, utils_1.concatBytes)(nonce, ciphertext));
    return base_1.base64.encode((0, utils_1.concatBytes)(new Uint8Array([2]), nonce, ciphertext, mac));
}
/**
 * Decrypt a NIP-44 v2 payload
 * @param payload - Base64-encoded encrypted payload
 * @param conversationKey - 32-byte conversation key from getConversationKey
 * @returns Decrypted plaintext string
 */
function decrypt(payload, conversationKey) {
    const data = base_1.base64.decode(payload);
    const version = data[0];
    if (version !== 2)
        throw new Error(`unknown encryption version: ${version}`);
    if (data.length < 99 || data.length > 65603)
        throw new Error('invalid payload size');
    const nonce = data.subarray(1, 33);
    const ciphertext = data.subarray(33, data.length - 32);
    const mac = data.subarray(data.length - 32);
    const { chacha_key, chacha_nonce, hmac_key } = getMessageKeys(conversationKey, nonce);
    const expectedMac = (0, hmac_1.hmac)(sha256_1.sha256, hmac_key, (0, utils_1.concatBytes)(nonce, ciphertext));
    if (!(0, utils_js_1.equalBytes)(mac, expectedMac))
        throw new Error('invalid MAC');
    const padded = (0, chacha_js_1.chacha20)(chacha_key, chacha_nonce, ciphertext);
    return unpad(padded);
}
/**
 * v2 API object matching nostr-tools shape for compatibility
 */
exports.v2 = {
    utils: {
        getConversationKey,
        calcPaddedLen,
    },
    encrypt,
    decrypt,
};
//# sourceMappingURL=nip-44.js.map