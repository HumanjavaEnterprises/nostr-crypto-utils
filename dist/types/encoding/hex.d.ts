/**
 * Hex encoding utilities for Nostr
 * Provides consistent hex encoding/decoding across all Nostr-related projects
 */
/**
 * Convert a string to hex format
 * @param str String to convert to hex
 * @returns Hex string
 */
export declare function stringToHex(str: string): string;
/**
 * Convert hex string to UTF-8 string
 * @param hex Hex string to convert
 * @returns UTF-8 string
 * @throws Error if hex string is invalid
 */
export declare function hexToString(hex: string): string;
/**
 * Convert buffer to hex string
 * @param buffer Buffer to convert
 * @returns Hex string
 */
export declare function bufferToHex(buffer: Buffer): string;
/**
 * Convert hex string to buffer
 * @param hex Hex string to convert
 * @returns Buffer
 * @throws Error if hex string is invalid
 */
export declare function hexToBuffer(hex: string): Buffer;
/**
 * Check if string is valid hex
 * @param hex String to check
 * @returns True if valid hex
 */
export declare function isValidHex(hex: string): boolean;
/**
 * Normalize hex string (lowercase, no 0x prefix)
 * @param hex Hex string to normalize
 * @returns Normalized hex string
 * @throws Error if hex string is invalid
 */
export declare function normalizeHex(hex: string): string;
/**
 * Add 0x prefix to hex string if not present
 * @param hex Hex string
 * @returns Hex string with 0x prefix
 * @throws Error if hex string is invalid
 */
export declare function addHexPrefix(hex: string): string;
/**
 * Remove 0x prefix from hex string if present
 * @param hex Hex string
 * @returns Hex string without 0x prefix
 */
export declare function removeHexPrefix(hex: string): string;
/**
 * Pad hex string to specified length
 * @param hex Hex string to pad
 * @param length Desired length in bytes (will be doubled for hex chars)
 * @param padEnd Whether to pad at end (default: false, pad at start)
 * @returns Padded hex string
 */
export declare function padHex(hex: string, length: number, padEnd?: boolean): string;
/**
 * Convert number to hex string
 * @param num Number to convert
 * @param padToBytes Optional padding length in bytes
 * @returns Hex string
 */
export declare function numberToHex(num: number, padToBytes?: number): string;
/**
 * Convert hex string to number
 * @param hex Hex string to convert
 * @returns Number
 * @throws Error if hex string is invalid or too large
 */
export declare function hexToNumber(hex: string): number;
/**
 * Concatenate multiple hex strings
 * @param hexStrings Array of hex strings to concatenate
 * @returns Concatenated hex string
 * @throws Error if any hex string is invalid
 */
export declare function concatenateHex(hexStrings: string[]): string;
/**
 * Split hex string into chunks of specified size
 * @param hex Hex string to split
 * @param chunkSize Size of each chunk in bytes
 * @returns Array of hex strings
 */
export declare function splitHex(hex: string, chunkSize: number): string[];
//# sourceMappingURL=hex.d.ts.map