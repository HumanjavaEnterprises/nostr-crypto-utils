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
export declare function hexToBytes(hex: string): Uint8Array;
/**
 * Convert Uint8Array to hex string
 * @param bytes Uint8Array to convert
 * @returns Hex string
 */
export declare function bytesToHex(bytes: Uint8Array): string;
//# sourceMappingURL=index.d.ts.map