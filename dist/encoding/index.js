/**
 * Encoding utilities for Nostr
 * @module encoding
 */
/**
 * Utility functions for encoding and decoding data
 */
export * from './hex';
export * from './base64';
export * from './binary';
/**
 * Convert a hex string to Uint8Array
 * @param hex Hex string to convert
 * @returns Uint8Array of bytes
 */
export function hexToBytes(hex) {
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
export function bytesToHex(bytes) {
    return Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}
//# sourceMappingURL=index.js.map