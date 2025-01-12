/**
 * Base64 encoding utilities for Nostr
 * Provides consistent base64 encoding/decoding across all Nostr-related projects
 */
/**
 * Convert string to base64
 * @param str String to convert
 * @returns Base64 string
 */
export function stringToBase64(str) {
    return Buffer.from(str, 'utf8').toString('base64');
}
/**
 * Convert base64 to string
 * @param base64 Base64 string to convert
 * @returns UTF-8 string
 * @throws Error if base64 string is invalid
 */
export function base64ToString(base64) {
    if (!isValidBase64(base64)) {
        throw new Error('Invalid base64 string');
    }
    return Buffer.from(base64, 'base64').toString('utf8');
}
/**
 * Convert buffer to base64
 * @param buffer Buffer to convert
 * @returns Base64 string
 */
export function bufferToBase64(buffer) {
    return buffer.toString('base64');
}
/**
 * Convert base64 to buffer
 * @param base64 Base64 string to convert
 * @returns Buffer
 * @throws Error if base64 string is invalid
 */
export function base64ToBuffer(base64) {
    if (!isValidBase64(base64)) {
        throw new Error('Invalid base64 string');
    }
    return Buffer.from(base64, 'base64');
}
/**
 * Check if string is valid base64
 * @param base64 String to check
 * @returns True if valid base64
 */
export function isValidBase64(base64) {
    try {
        return Boolean(base64.match(/^[A-Za-z0-9+/]*={0,2}$/));
    }
    catch {
        return false;
    }
}
/**
 * Convert base64 to URL-safe base64
 * @param base64 Standard base64 string
 * @returns URL-safe base64 string
 */
export function toBase64Url(base64) {
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
/**
 * Convert URL-safe base64 to standard base64
 * @param base64url URL-safe base64 string
 * @returns Standard base64 string
 */
export function fromBase64Url(base64url) {
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    const padding = '='.repeat((4 - base64.length % 4) % 4);
    return base64 + padding;
}
/**
 * Convert hex string to base64
 * @param hex Hex string to convert
 * @returns Base64 string
 * @throws Error if hex string is invalid
 */
export function hexToBase64(hex) {
    if (!hex.match(/^[0-9a-fA-F]*$/)) {
        throw new Error('Invalid hex string');
    }
    return Buffer.from(hex, 'hex').toString('base64');
}
/**
 * Convert base64 to hex string
 * @param base64 Base64 string to convert
 * @returns Hex string
 * @throws Error if base64 string is invalid
 */
export function base64ToHex(base64) {
    if (!isValidBase64(base64)) {
        throw new Error('Invalid base64 string');
    }
    return Buffer.from(base64, 'base64').toString('hex');
}
/**
 * Create base64 string from byte array
 * @param bytes Byte array
 * @returns Base64 string
 */
export function bytesToBase64(bytes) {
    return Buffer.from(bytes).toString('base64');
}
/**
 * Convert base64 to byte array
 * @param base64 Base64 string
 * @returns Byte array
 * @throws Error if base64 string is invalid
 */
export function base64ToBytes(base64) {
    if (!isValidBase64(base64)) {
        throw new Error('Invalid base64 string');
    }
    return new Uint8Array(Buffer.from(base64, 'base64'));
}
/**
 * Calculate padded length for base64 string
 * @param dataLength Length of raw data
 * @returns Length of padded base64 string
 */
export function calculateBase64Length(dataLength) {
    return Math.ceil(dataLength / 3) * 4;
}
/**
 * Remove base64 padding
 * @param base64 Base64 string
 * @returns Base64 string without padding
 */
export function removeBase64Padding(base64) {
    return base64.replace(/=+$/, '');
}
/**
 * Add base64 padding
 * @param base64 Base64 string without padding
 * @returns Properly padded base64 string
 */
export function addBase64Padding(base64) {
    const padding = '='.repeat((4 - base64.length % 4) % 4);
    return base64 + padding;
}
//# sourceMappingURL=base64.js.map