"use strict";
/**
 * Base64 encoding utilities for Nostr
 * Provides consistent base64 encoding/decoding across all Nostr-related projects
 * Uses browser-compatible APIs (no Node.js Buffer dependency)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringToBase64 = stringToBase64;
exports.base64ToString = base64ToString;
exports.bufferToBase64 = bufferToBase64;
exports.base64ToBuffer = base64ToBuffer;
exports.isValidBase64 = isValidBase64;
exports.toBase64Url = toBase64Url;
exports.fromBase64Url = fromBase64Url;
exports.hexToBase64 = hexToBase64;
exports.base64ToHex = base64ToHex;
exports.bytesToBase64 = bytesToBase64;
exports.base64ToBytes = base64ToBytes;
exports.calculateBase64Length = calculateBase64Length;
exports.removeBase64Padding = removeBase64Padding;
exports.addBase64Padding = addBase64Padding;
/**
 * Convert string to base64
 * @param str String to convert
 * @returns Base64 string
 */
function stringToBase64(str) {
    const bytes = new TextEncoder().encode(str);
    return bytesToBase64(bytes);
}
/**
 * Convert base64 to string
 * @param base64 Base64 string to convert
 * @returns UTF-8 string
 * @throws Error if base64 string is invalid
 */
function base64ToString(base64) {
    if (!isValidBase64(base64)) {
        throw new Error('Invalid base64 string');
    }
    const bytes = base64ToBytes(base64);
    return new TextDecoder().decode(bytes);
}
/**
 * Convert Uint8Array to base64
 * @param buffer Uint8Array to convert
 * @returns Base64 string
 */
function bufferToBase64(buffer) {
    return bytesToBase64(buffer);
}
/**
 * Convert base64 to Uint8Array
 * @param base64 Base64 string to convert
 * @returns Uint8Array
 * @throws Error if base64 string is invalid
 */
function base64ToBuffer(base64) {
    if (!isValidBase64(base64)) {
        throw new Error('Invalid base64 string');
    }
    return base64ToBytes(base64);
}
/**
 * Check if string is valid base64
 * @param base64 String to check
 * @returns True if valid base64
 */
function isValidBase64(base64) {
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
function toBase64Url(base64) {
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
/**
 * Convert URL-safe base64 to standard base64
 * @param base64url URL-safe base64 string
 * @returns Standard base64 string
 */
function fromBase64Url(base64url) {
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
function hexToBase64(hex) {
    if (!hex.match(/^[0-9a-fA-F]*$/)) {
        throw new Error('Invalid hex string');
    }
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    }
    return bytesToBase64(bytes);
}
/**
 * Convert base64 to hex string
 * @param base64 Base64 string to convert
 * @returns Hex string
 * @throws Error if base64 string is invalid
 */
function base64ToHex(base64) {
    if (!isValidBase64(base64)) {
        throw new Error('Invalid base64 string');
    }
    const bytes = base64ToBytes(base64);
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}
/**
 * Create base64 string from byte array
 * @param bytes Byte array
 * @returns Base64 string
 */
function bytesToBase64(bytes) {
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}
/**
 * Convert base64 to byte array
 * @param base64 Base64 string
 * @returns Byte array
 * @throws Error if base64 string is invalid
 */
function base64ToBytes(base64) {
    if (!isValidBase64(base64)) {
        throw new Error('Invalid base64 string');
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}
/**
 * Calculate padded length for base64 string
 * @param dataLength Length of raw data
 * @returns Length of padded base64 string
 */
function calculateBase64Length(dataLength) {
    return Math.ceil(dataLength / 3) * 4;
}
/**
 * Remove base64 padding
 * @param base64 Base64 string
 * @returns Base64 string without padding
 */
function removeBase64Padding(base64) {
    return base64.replace(/=+$/, '');
}
/**
 * Add base64 padding
 * @param base64 Base64 string without padding
 * @returns Properly padded base64 string
 */
function addBase64Padding(base64) {
    const padding = '='.repeat((4 - base64.length % 4) % 4);
    return base64 + padding;
}
//# sourceMappingURL=base64.js.map