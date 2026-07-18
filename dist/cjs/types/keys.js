"use strict";
/**
 * @module types/keys
 * @description Branded key types for compile-time safety.
 *
 * The canonical NIP-04 API (encryptMessage/decryptMessage) uses these branded
 * types so that passing a public key where a private key is expected (or swapping
 * the sender/recipient arguments) fails to type-check. The brand is erased at
 * runtime — a plain 64-char hex string is still accepted by JS callers — but the
 * validating constructors `asPrivateKey`/`asPublicKey` enforce the format.
 *
 * All public keys are 32-byte x-only hex (BIP-340), i.e. 64 hex characters.
 * Private keys are 32-byte hex, i.e. 64 hex characters.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPrivateKeyHex = isPrivateKeyHex;
exports.isPublicKeyHex = isPublicKeyHex;
exports.asPrivateKey = asPrivateKey;
exports.asPublicKey = asPublicKey;
const HEX64 = /^[0-9a-fA-F]{64}$/;
/** True if `hex` is a 64-char hex string (a valid private key form). */
function isPrivateKeyHex(hex) {
    return typeof hex === 'string' && HEX64.test(hex);
}
/** True if `hex` is a 64-char hex string (a valid x-only public key form). */
function isPublicKeyHex(hex) {
    return typeof hex === 'string' && HEX64.test(hex);
}
/**
 * Validate and brand a 64-char hex string as a {@link PrivateKey}.
 * @throws {Error} If `hex` is not 64 hex characters.
 */
function asPrivateKey(hex) {
    if (!isPrivateKeyHex(hex)) {
        throw new Error('invalid private key: expected 64-char hex string');
    }
    return hex;
}
/**
 * Validate and brand a 64-char x-only hex string as a {@link PublicKey}.
 * Accepts only the 32-byte x-only form used across Nostr (no 02/03 prefix).
 * @throws {Error} If `hex` is not 64 hex characters.
 */
function asPublicKey(hex) {
    if (!isPublicKeyHex(hex)) {
        throw new Error('invalid public key: expected 64-char x-only hex string');
    }
    return hex;
}
//# sourceMappingURL=keys.js.map