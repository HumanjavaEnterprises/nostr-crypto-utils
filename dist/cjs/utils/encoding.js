"use strict";
/**
 * Utility functions for encoding and decoding data
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexToBytes = hexToBytes;
exports.bytesToHex = bytesToHex;
exports.utf8ToBytes = utf8ToBytes;
exports.bytesToUtf8 = bytesToUtf8;
/**
 * Convert a hex string to Uint8Array
 * @param hex Hex string to convert
 * @returns Uint8Array of bytes
 */
function hexToBytes(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
    }
    return bytes;
}
/**
 * Convert Uint8Array to hex string
 * @param bytes Uint8Array to convert
 * @returns Hex string
 */
function bytesToHex(bytes) {
    return Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}
/**
 * Convert a UTF-8 string to Uint8Array
 * @param str UTF-8 string to convert
 * @returns Uint8Array of bytes
 */
function utf8ToBytes(str) {
    return new TextEncoder().encode(str);
}
/**
 * Convert Uint8Array to UTF-8 string
 * @param bytes Uint8Array to convert
 * @returns UTF-8 string
 */
function bytesToUtf8(bytes) {
    return new TextDecoder().decode(bytes);
}
//# sourceMappingURL=encoding.js.map