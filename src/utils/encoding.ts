/**
 * Utility functions for encoding and decoding data
 */

/**
 * Convert a hex string to Uint8Array
 * @param hex Hex string to convert
 * @returns Uint8Array of bytes
 */
export function hexToBytes(hex: string): Uint8Array {
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
export function bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * Convert a UTF-8 string to Uint8Array
 * @param str UTF-8 string to convert
 * @returns Uint8Array of bytes
 */
export function utf8ToBytes(str: string): Uint8Array {
    return new TextEncoder().encode(str);
}

/**
 * Convert Uint8Array to UTF-8 string
 * @param bytes Uint8Array to convert
 * @returns UTF-8 string
 */
export function bytesToUtf8(bytes: Uint8Array): string {
    return new TextDecoder().decode(bytes);
}
