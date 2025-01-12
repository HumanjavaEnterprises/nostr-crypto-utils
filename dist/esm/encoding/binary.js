/**
 * Binary data handling utilities for Nostr
 * Provides consistent binary data handling across all Nostr-related projects
 */
/**
 * Convert string to byte array
 * @param str String to convert
 * @returns Byte array
 */
export function stringToBytes(str) {
    return new TextEncoder().encode(str);
}
/**
 * Convert byte array to string
 * @param bytes Byte array to convert
 * @returns UTF-8 string
 */
export function bytesToString(bytes) {
    return new TextDecoder().decode(bytes);
}
/**
 * Convert buffer to byte array
 * @param buffer Buffer to convert
 * @returns Byte array
 */
export function bufferToBytes(buffer) {
    return new Uint8Array(buffer);
}
/**
 * Convert byte array to buffer
 * @param bytes Byte array to convert
 * @returns Buffer
 */
export function bytesToBuffer(bytes) {
    return Buffer.from(bytes);
}
/**
 * Concatenate multiple byte arrays
 * @param arrays Arrays to concatenate
 * @returns Concatenated byte array
 */
export function concatenateBytes(arrays) {
    const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
    }
    return result;
}
/**
 * Compare two byte arrays for equality
 * @param a First byte array
 * @param b Second byte array
 * @returns True if arrays are equal
 */
export function compareBytes(a, b) {
    if (a.length !== b.length)
        return false;
    return a.every((byte, i) => byte === b[i]);
}
/**
 * Create byte array filled with zeros
 * @param length Length of array
 * @returns Zero-filled byte array
 */
export function zeroBytes(length) {
    return new Uint8Array(length);
}
/**
 * Create byte array with random values
 * @param length Length of array
 * @returns Random byte array
 */
export function randomBytes(length) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return array;
}
/**
 * Convert number to byte array
 * @param num Number to convert
 * @param length Length of resulting array (default: minimum needed)
 * @param littleEndian Whether to use little-endian encoding (default: false)
 * @returns Byte array
 */
export function numberToBytes(num, length, littleEndian = false) {
    const minLength = Math.ceil(Math.log2(num + 1) / 8);
    const actualLength = length || minLength;
    if (actualLength < minLength) {
        throw new Error('Length too small to represent number');
    }
    const bytes = new Uint8Array(actualLength);
    let value = num;
    for (let i = 0; i < actualLength; i++) {
        const byteIndex = littleEndian ? i : actualLength - 1 - i;
        bytes[byteIndex] = value & 0xff;
        value >>>= 8;
    }
    return bytes;
}
/**
 * Convert byte array to number
 * @param bytes Byte array to convert
 * @param littleEndian Whether to use little-endian encoding (default: false)
 * @returns Number
 * @throws Error if number is larger than MAX_SAFE_INTEGER
 */
export function bytesToNumber(bytes, littleEndian = false) {
    let value = 0;
    const length = bytes.length;
    for (let i = 0; i < length; i++) {
        const byteIndex = littleEndian ? i : length - 1 - i;
        value = (value << 8) | bytes[byteIndex];
        if (value > Number.MAX_SAFE_INTEGER) {
            throw new Error('Number exceeds MAX_SAFE_INTEGER');
        }
    }
    return value;
}
/**
 * Split byte array into chunks
 * @param bytes Byte array to split
 * @param chunkSize Size of each chunk
 * @returns Array of byte arrays
 */
export function splitBytes(bytes, chunkSize) {
    const chunks = [];
    for (let i = 0; i < bytes.length; i += chunkSize) {
        chunks.push(bytes.slice(i, i + chunkSize));
    }
    return chunks;
}
/**
 * Create a view of the byte array without copying
 * @param bytes Source byte array
 * @param start Start index
 * @param end End index
 * @returns View of the byte array
 */
export function bytesView(bytes, start, end) {
    return new Uint8Array(bytes.buffer, bytes.byteOffset + (start || 0), (end || bytes.length) - (start || 0));
}
/**
 * Check if value is a valid byte array
 * @param value Value to check
 * @returns True if value is a Uint8Array
 */
export function isByteArray(value) {
    return value instanceof Uint8Array;
}
/**
 * Create a copy of a byte array
 * @param bytes Byte array to copy
 * @returns Copy of the byte array
 */
export function copyBytes(bytes) {
    return new Uint8Array(bytes);
}
//# sourceMappingURL=binary.js.map