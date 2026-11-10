/**
 * @module utils/strict-hex
 * @description Canonical (lowercase, fixed-length) hex checks for NIP-01 fields.
 * NIP-01 defines `id`, `pubkey` and `sig` as lowercase hex; accepting any other
 * spelling lets one event carry many distinct strings that strict relays reject.
 */
/** True if `v` is a 32-byte lowercase hex string (event id, x-only pubkey). */
export declare function isHex32(v: unknown): v is string;
/** True if `v` is a 64-byte lowercase hex string (schnorr signature). */
export declare function isHex64(v: unknown): v is string;
