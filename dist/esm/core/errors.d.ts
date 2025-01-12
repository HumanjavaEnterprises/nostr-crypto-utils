/**
 * Core error types and error handling utilities
 * @module core/errors
 */
/**
 * Base error class for all Nostr-related errors
 */
export declare class NostrError extends Error {
    code: string;
    constructor(message: string, code: string);
}
/**
 * Error thrown when cryptographic operations fail
 */
export declare class CryptoError extends NostrError {
    constructor(message: string, code?: string);
}
/**
 * Error thrown when validation fails
 */
export declare class ValidationError extends NostrError {
    constructor(message: string, code?: string);
}
/**
 * Error thrown when encoding/decoding fails
 */
export declare class EncodingError extends NostrError {
    constructor(message: string, code?: string);
}
/**
 * Error thrown when protocol-related operations fail
 */
export declare class ProtocolError extends NostrError {
    constructor(message: string, code?: string);
}
/**
 * Error thrown when event-related operations fail
 */
export declare class EventError extends NostrError {
    constructor(message: string, code?: string);
}
/**
 * Error codes for different types of errors
 */
export declare const ErrorCodes: {
    readonly INVALID_KEY: "INVALID_KEY";
    readonly SIGNING_FAILED: "SIGNING_FAILED";
    readonly VERIFICATION_FAILED: "VERIFICATION_FAILED";
    readonly ENCRYPTION_FAILED: "ENCRYPTION_FAILED";
    readonly DECRYPTION_FAILED: "DECRYPTION_FAILED";
    readonly INVALID_EVENT: "INVALID_EVENT";
    readonly INVALID_SIGNATURE: "INVALID_SIGNATURE";
    readonly INVALID_FILTER: "INVALID_FILTER";
    readonly INVALID_SUBSCRIPTION: "INVALID_SUBSCRIPTION";
    readonly INVALID_HEX: "INVALID_HEX";
    readonly INVALID_BASE64: "INVALID_BASE64";
    readonly INVALID_BECH32: "INVALID_BECH32";
    readonly ENCODING_FAILED: "ENCODING_FAILED";
    readonly RELAY_ERROR: "RELAY_ERROR";
    readonly CONNECTION_ERROR: "CONNECTION_ERROR";
    readonly SUBSCRIPTION_ERROR: "SUBSCRIPTION_ERROR";
    readonly TIMEOUT_ERROR: "TIMEOUT_ERROR";
    readonly EVENT_CREATION_FAILED: "EVENT_CREATION_FAILED";
    readonly EVENT_VALIDATION_FAILED: "EVENT_VALIDATION_FAILED";
    readonly EVENT_SERIALIZATION_FAILED: "EVENT_SERIALIZATION_FAILED";
};
/**
 * Type for error codes
 */
export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];
/**
 * Create an error with the appropriate type based on the error code
 * @param message Error message
 * @param code Error code
 * @returns Appropriate error instance
 */
export declare function createError(message: string, code: ErrorCode): NostrError;
//# sourceMappingURL=errors.d.ts.map