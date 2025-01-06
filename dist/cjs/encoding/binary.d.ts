/**
 * Binary data handling utilities for Nostr
 * Provides consistent binary data handling across all Nostr-related projects
 */
/**
 * Convert string to byte array
 * @param str String to convert
 * @returns Byte array
 */
export declare function stringToBytes(str: string): Uint8Array;
/**
 * Convert byte array to string
 * @param bytes Byte array to convert
 * @returns UTF-8 string
 */
export declare function bytesToString(bytes: Uint8Array): string;
/**
 * Convert buffer to byte array
 * @param buffer Buffer to convert
 * @returns Byte array
 */
export declare function bufferToBytes(buffer: Buffer): Uint8Array;
/**
 * Convert byte array to buffer
 * @param bytes Byte array to convert
 * @returns Buffer
 */
export declare function bytesToBuffer(bytes: Uint8Array): Buffer;
/**
 * Concatenate multiple byte arrays
 * @param arrays Arrays to concatenate
 * @returns Concatenated byte array
 */
export declare function concatenateBytes(arrays: Uint8Array[]): Uint8Array;
/**
 * Compare two byte arrays for equality
 * @param a First byte array
 * @param b Second byte array
 * @returns True if arrays are equal
 */
export declare function compareBytes(a: Uint8Array, b: Uint8Array): boolean;
/**
 * Create byte array filled with zeros
 * @param length Length of array
 * @returns Zero-filled byte array
 */
export declare function zeroBytes(length: number): Uint8Array;
/**
 * Create byte array with random values
 * @param length Length of array
 * @returns Random byte array
 */
export declare function randomBytes(length: number): Uint8Array;
/**
 * Convert number to byte array
 * @param num Number to convert
 * @param length Length of resulting array (default: minimum needed)
 * @param littleEndian Whether to use little-endian encoding (default: false)
 * @returns Byte array
 */
export declare function numberToBytes(num: number, length?: number, littleEndian?: boolean): Uint8Array;
/**
 * Convert byte array to number
 * @param bytes Byte array to convert
 * @param littleEndian Whether to use little-endian encoding (default: false)
 * @returns Number
 * @throws Error if number is larger than MAX_SAFE_INTEGER
 */
export declare function bytesToNumber(bytes: Uint8Array, littleEndian?: boolean): number;
/**
 * Split byte array into chunks
 * @param bytes Byte array to split
 * @param chunkSize Size of each chunk
 * @returns Array of byte arrays
 */
export declare function splitBytes(bytes: Uint8Array, chunkSize: number): Uint8Array[];
/**
 * Create a view of the byte array without copying
 * @param bytes Source byte array
 * @param start Start index
 * @param end End index
 * @returns View of the byte array
 */
export declare function bytesView(bytes: Uint8Array, start?: number, end?: number): Uint8Array;
/**
 * Check if value is a valid byte array
 * @param value Value to check
 * @returns True if value is a Uint8Array
 */
export declare function isByteArray(value: unknown): value is Uint8Array;
/**
 * Create a copy of a byte array
 * @param bytes Byte array to copy
 * @returns Copy of the byte array
 */
export declare function copyBytes(bytes: Uint8Array): Uint8Array;
//# sourceMappingURL=binary.d.ts.map