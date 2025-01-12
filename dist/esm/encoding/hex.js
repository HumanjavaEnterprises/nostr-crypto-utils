/**
 * Hex encoding utilities for Nostr
 * Provides consistent hex encoding/decoding across all Nostr-related projects
 */
/**
 * Convert a string to hex format
 * @param str String to convert to hex
 * @returns Hex string
 */
export function stringToHex(str) {
    return Buffer.from(str, 'utf8').toString('hex');
}
/**
 * Convert hex string to UTF-8 string
 * @param hex Hex string to convert
 * @returns UTF-8 string
 * @throws Error if hex string is invalid
 */
export function hexToString(hex) {
    if (!isValidHex(hex)) {
        throw new Error('Invalid hex string');
    }
    return Buffer.from(hex, 'hex').toString('utf8');
}
/**
 * Convert buffer to hex string
 * @param buffer Buffer to convert
 * @returns Hex string
 */
export function bufferToHex(buffer) {
    return buffer.toString('hex');
}
/**
 * Convert hex string to buffer
 * @param hex Hex string to convert
 * @returns Buffer
 * @throws Error if hex string is invalid
 */
export function hexToBuffer(hex) {
    if (!isValidHex(hex)) {
        throw new Error('Invalid hex string');
    }
    return Buffer.from(hex, 'hex');
}
/**
 * Check if string is valid hex
 * @param hex String to check
 * @returns True if valid hex
 */
export function isValidHex(hex) {
    return Boolean(hex.match(/^[0-9a-fA-F]*$/));
}
/**
 * Normalize hex string (lowercase, no 0x prefix)
 * @param hex Hex string to normalize
 * @returns Normalized hex string
 * @throws Error if hex string is invalid
 */
export function normalizeHex(hex) {
    // Remove 0x prefix if present
    const cleaned = hex.startsWith('0x') ? hex.slice(2) : hex;
    if (!isValidHex(cleaned)) {
        throw new Error('Invalid hex string');
    }
    return cleaned.toLowerCase();
}
/**
 * Add 0x prefix to hex string if not present
 * @param hex Hex string
 * @returns Hex string with 0x prefix
 * @throws Error if hex string is invalid
 */
export function addHexPrefix(hex) {
    const normalized = normalizeHex(hex);
    return `0x${normalized}`;
}
/**
 * Remove 0x prefix from hex string if present
 * @param hex Hex string
 * @returns Hex string without 0x prefix
 */
export function removeHexPrefix(hex) {
    return hex.startsWith('0x') ? hex.slice(2) : hex;
}
/**
 * Pad hex string to specified length
 * @param hex Hex string to pad
 * @param length Desired length in bytes (will be doubled for hex chars)
 * @param padEnd Whether to pad at end (default: false, pad at start)
 * @returns Padded hex string
 */
export function padHex(hex, length, padEnd = false) {
    const normalized = normalizeHex(hex);
    const targetLength = length * 2; // Each byte is 2 hex chars
    if (normalized.length > targetLength) {
        throw new Error('Hex string already longer than desired length');
    }
    const padding = '0'.repeat(targetLength - normalized.length);
    return padEnd ? normalized + padding : padding + normalized;
}
/**
 * Convert number to hex string
 * @param num Number to convert
 * @param padToBytes Optional padding length in bytes
 * @returns Hex string
 */
export function numberToHex(num, padToBytes) {
    const hex = num.toString(16);
    return padToBytes ? padHex(hex, padToBytes) : hex;
}
/**
 * Convert hex string to number
 * @param hex Hex string to convert
 * @returns Number
 * @throws Error if hex string is invalid or too large
 */
export function hexToNumber(hex) {
    const normalized = normalizeHex(hex);
    const num = parseInt(normalized, 16);
    if (num > Number.MAX_SAFE_INTEGER) {
        throw new Error('Hex string converts to number larger than MAX_SAFE_INTEGER');
    }
    return num;
}
/**
 * Concatenate multiple hex strings
 * @param hexStrings Array of hex strings to concatenate
 * @returns Concatenated hex string
 * @throws Error if any hex string is invalid
 */
export function concatenateHex(hexStrings) {
    return hexStrings.map(normalizeHex).join('');
}
/**
 * Split hex string into chunks of specified size
 * @param hex Hex string to split
 * @param chunkSize Size of each chunk in bytes
 * @returns Array of hex strings
 */
export function splitHex(hex, chunkSize) {
    const normalized = normalizeHex(hex);
    const chunkLength = chunkSize * 2;
    const chunks = [];
    for (let i = 0; i < normalized.length; i += chunkLength) {
        chunks.push(normalized.slice(i, i + chunkLength));
    }
    return chunks;
}
//# sourceMappingURL=hex.js.map