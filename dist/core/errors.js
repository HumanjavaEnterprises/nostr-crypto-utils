/**
 * Core error types and error handling utilities
 * @module core/errors
 */
/**
 * Base error class for all Nostr-related errors
 */
export class NostrError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
        this.name = 'NostrError';
    }
}
/**
 * Error thrown when cryptographic operations fail
 */
export class CryptoError extends NostrError {
    constructor(message, code = 'CRYPTO_ERROR') {
        super(message, code);
        this.name = 'CryptoError';
    }
}
/**
 * Error thrown when validation fails
 */
export class ValidationError extends NostrError {
    constructor(message, code = 'VALIDATION_ERROR') {
        super(message, code);
        this.name = 'ValidationError';
    }
}
/**
 * Error thrown when encoding/decoding fails
 */
export class EncodingError extends NostrError {
    constructor(message, code = 'ENCODING_ERROR') {
        super(message, code);
        this.name = 'EncodingError';
    }
}
/**
 * Error thrown when protocol-related operations fail
 */
export class ProtocolError extends NostrError {
    constructor(message, code = 'PROTOCOL_ERROR') {
        super(message, code);
        this.name = 'ProtocolError';
    }
}
/**
 * Error thrown when event-related operations fail
 */
export class EventError extends NostrError {
    constructor(message, code = 'EVENT_ERROR') {
        super(message, code);
        this.name = 'EventError';
    }
}
/**
 * Error codes for different types of errors
 */
export const ErrorCodes = {
    // Crypto errors
    INVALID_KEY: 'INVALID_KEY',
    SIGNING_FAILED: 'SIGNING_FAILED',
    VERIFICATION_FAILED: 'VERIFICATION_FAILED',
    ENCRYPTION_FAILED: 'ENCRYPTION_FAILED',
    DECRYPTION_FAILED: 'DECRYPTION_FAILED',
    // Validation errors
    INVALID_EVENT: 'INVALID_EVENT',
    INVALID_SIGNATURE: 'INVALID_SIGNATURE',
    INVALID_FILTER: 'INVALID_FILTER',
    INVALID_SUBSCRIPTION: 'INVALID_SUBSCRIPTION',
    // Encoding errors
    INVALID_HEX: 'INVALID_HEX',
    INVALID_BASE64: 'INVALID_BASE64',
    INVALID_BECH32: 'INVALID_BECH32',
    ENCODING_FAILED: 'ENCODING_FAILED',
    // Protocol errors
    RELAY_ERROR: 'RELAY_ERROR',
    CONNECTION_ERROR: 'CONNECTION_ERROR',
    SUBSCRIPTION_ERROR: 'SUBSCRIPTION_ERROR',
    TIMEOUT_ERROR: 'TIMEOUT_ERROR',
    // Event errors
    EVENT_CREATION_FAILED: 'EVENT_CREATION_FAILED',
    EVENT_VALIDATION_FAILED: 'EVENT_VALIDATION_FAILED',
    EVENT_SERIALIZATION_FAILED: 'EVENT_SERIALIZATION_FAILED'
};
/**
 * Create an error with the appropriate type based on the error code
 * @param message Error message
 * @param code Error code
 * @returns Appropriate error instance
 */
export function createError(message, code) {
    switch (code) {
        case ErrorCodes.INVALID_KEY:
        case ErrorCodes.SIGNING_FAILED:
        case ErrorCodes.VERIFICATION_FAILED:
        case ErrorCodes.ENCRYPTION_FAILED:
        case ErrorCodes.DECRYPTION_FAILED:
            return new CryptoError(message, code);
        case ErrorCodes.INVALID_EVENT:
        case ErrorCodes.INVALID_SIGNATURE:
        case ErrorCodes.INVALID_FILTER:
        case ErrorCodes.INVALID_SUBSCRIPTION:
            return new ValidationError(message, code);
        case ErrorCodes.INVALID_HEX:
        case ErrorCodes.INVALID_BASE64:
        case ErrorCodes.INVALID_BECH32:
        case ErrorCodes.ENCODING_FAILED:
            return new EncodingError(message, code);
        case ErrorCodes.RELAY_ERROR:
        case ErrorCodes.CONNECTION_ERROR:
        case ErrorCodes.SUBSCRIPTION_ERROR:
        case ErrorCodes.TIMEOUT_ERROR:
            return new ProtocolError(message, code);
        case ErrorCodes.EVENT_CREATION_FAILED:
        case ErrorCodes.EVENT_VALIDATION_FAILED:
        case ErrorCodes.EVENT_SERIALIZATION_FAILED:
            return new EventError(message, code);
        default:
            return new NostrError(message, code);
    }
}
//# sourceMappingURL=errors.js.map