/**
 * Base64 encoding utilities for Nostr
 * Provides consistent base64 encoding/decoding across all Nostr-related projects
 */
/**
 * Convert string to base64
 * @param str String to convert
 * @returns Base64 string
 */
export declare function stringToBase64(str: string): string;
/**
 * Convert base64 to string
 * @param base64 Base64 string to convert
 * @returns UTF-8 string
 * @throws Error if base64 string is invalid
 */
export declare function base64ToString(base64: string): string;
/**
 * Convert buffer to base64
 * @param buffer Buffer to convert
 * @returns Base64 string
 */
export declare function bufferToBase64(buffer: Buffer): string;
/**
 * Convert base64 to buffer
 * @param base64 Base64 string to convert
 * @returns Buffer
 * @throws Error if base64 string is invalid
 */
export declare function base64ToBuffer(base64: string): Buffer;
/**
 * Check if string is valid base64
 * @param base64 String to check
 * @returns True if valid base64
 */
export declare function isValidBase64(base64: string): boolean;
/**
 * Convert base64 to URL-safe base64
 * @param base64 Standard base64 string
 * @returns URL-safe base64 string
 */
export declare function toBase64Url(base64: string): string;
/**
 * Convert URL-safe base64 to standard base64
 * @param base64url URL-safe base64 string
 * @returns Standard base64 string
 */
export declare function fromBase64Url(base64url: string): string;
/**
 * Convert hex string to base64
 * @param hex Hex string to convert
 * @returns Base64 string
 * @throws Error if hex string is invalid
 */
export declare function hexToBase64(hex: string): string;
/**
 * Convert base64 to hex string
 * @param base64 Base64 string to convert
 * @returns Hex string
 * @throws Error if base64 string is invalid
 */
export declare function base64ToHex(base64: string): string;
/**
 * Create base64 string from byte array
 * @param bytes Byte array
 * @returns Base64 string
 */
export declare function bytesToBase64(bytes: Uint8Array): string;
/**
 * Convert base64 to byte array
 * @param base64 Base64 string
 * @returns Byte array
 * @throws Error if base64 string is invalid
 */
export declare function base64ToBytes(base64: string): Uint8Array;
/**
 * Calculate padded length for base64 string
 * @param dataLength Length of raw data
 * @returns Length of padded base64 string
 */
export declare function calculateBase64Length(dataLength: number): number;
/**
 * Remove base64 padding
 * @param base64 Base64 string
 * @returns Base64 string without padding
 */
export declare function removeBase64Padding(base64: string): string;
/**
 * Add base64 padding
 * @param base64 Base64 string without padding
 * @returns Properly padded base64 string
 */
export declare function addBase64Padding(base64: string): string;
//# sourceMappingURL=base64.d.ts.map