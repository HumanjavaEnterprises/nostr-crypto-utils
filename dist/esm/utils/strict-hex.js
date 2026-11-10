/**
 * @module utils/strict-hex
 * @description Canonical (lowercase, fixed-length) hex checks for NIP-01 fields.
 * NIP-01 defines `id`, `pubkey` and `sig` as lowercase hex; accepting any other
 * spelling lets one event carry many distinct strings that strict relays reject.
 */
const HEX32 = /^[0-9a-f]{64}$/;
const HEX64 = /^[0-9a-f]{128}$/;
/** True if `v` is a 32-byte lowercase hex string (event id, x-only pubkey). */
export function isHex32(v) {
    return typeof v === 'string' && HEX32.test(v);
}
/** True if `v` is a 64-byte lowercase hex string (schnorr signature). */
export function isHex64(v) {
    return typeof v === 'string' && HEX64.test(v);
}
