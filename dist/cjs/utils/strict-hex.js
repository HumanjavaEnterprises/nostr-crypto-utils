"use strict";
/**
 * @module utils/strict-hex
 * @description Canonical (lowercase, fixed-length) hex checks for NIP-01 fields.
 * NIP-01 defines `id`, `pubkey` and `sig` as lowercase hex; accepting any other
 * spelling lets one event carry many distinct strings that strict relays reject.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHex32 = isHex32;
exports.isHex64 = isHex64;
const HEX32 = /^[0-9a-f]{64}$/;
const HEX64 = /^[0-9a-f]{128}$/;
/** True if `v` is a 32-byte lowercase hex string (event id, x-only pubkey). */
function isHex32(v) {
    return typeof v === 'string' && HEX32.test(v);
}
/** True if `v` is a 64-byte lowercase hex string (schnorr signature). */
function isHex64(v) {
    return typeof v === 'string' && HEX64.test(v);
}
