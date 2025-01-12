"use strict";
/**
 * Core error types and error handling utilities
 * @module core/errors
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCodes = exports.EventError = exports.ProtocolError = exports.EncodingError = exports.ValidationError = exports.CryptoError = exports.NostrError = void 0;
exports.createError = createError;
/**
 * Base error class for all Nostr-related errors
 */
class NostrError extends Error {
    code;
    constructor(message, code) {
        super(message);
        this.code = code;
        this.name = 'NostrError';
    }
}
exports.NostrError = NostrError;
/**
 * Error thrown when cryptographic operations fail
 */
class CryptoError extends NostrError {
    constructor(message, code = 'CRYPTO_ERROR') {
        super(message, code);
        this.name = 'CryptoError';
    }
}
exports.CryptoError = CryptoError;
/**
 * Error thrown when validation fails
 */
class ValidationError extends NostrError {
    constructor(message, code = 'VALIDATION_ERROR') {
        super(message, code);
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
/**
 * Error thrown when encoding/decoding fails
 */
class EncodingError extends NostrError {
    constructor(message, code = 'ENCODING_ERROR') {
        super(message, code);
        this.name = 'EncodingError';
    }
}
exports.EncodingError = EncodingError;
/**
 * Error thrown when protocol-related operations fail
 */
class ProtocolError extends NostrError {
    constructor(message, code = 'PROTOCOL_ERROR') {
        super(message, code);
        this.name = 'ProtocolError';
    }
}
exports.ProtocolError = ProtocolError;
/**
 * Error thrown when event-related operations fail
 */
class EventError extends NostrError {
    constructor(message, code = 'EVENT_ERROR') {
        super(message, code);
        this.name = 'EventError';
    }
}
exports.EventError = EventError;
/**
 * Error codes for different types of errors
 */
exports.ErrorCodes = {
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
function createError(message, code) {
    switch (code) {
        case exports.ErrorCodes.INVALID_KEY:
        case exports.ErrorCodes.SIGNING_FAILED:
        case exports.ErrorCodes.VERIFICATION_FAILED:
        case exports.ErrorCodes.ENCRYPTION_FAILED:
        case exports.ErrorCodes.DECRYPTION_FAILED:
            return new CryptoError(message, code);
        case exports.ErrorCodes.INVALID_EVENT:
        case exports.ErrorCodes.INVALID_SIGNATURE:
        case exports.ErrorCodes.INVALID_FILTER:
        case exports.ErrorCodes.INVALID_SUBSCRIPTION:
            return new ValidationError(message, code);
        case exports.ErrorCodes.INVALID_HEX:
        case exports.ErrorCodes.INVALID_BASE64:
        case exports.ErrorCodes.INVALID_BECH32:
        case exports.ErrorCodes.ENCODING_FAILED:
            return new EncodingError(message, code);
        case exports.ErrorCodes.RELAY_ERROR:
        case exports.ErrorCodes.CONNECTION_ERROR:
        case exports.ErrorCodes.SUBSCRIPTION_ERROR:
        case exports.ErrorCodes.TIMEOUT_ERROR:
            return new ProtocolError(message, code);
        case exports.ErrorCodes.EVENT_CREATION_FAILED:
        case exports.ErrorCodes.EVENT_VALIDATION_FAILED:
        case exports.ErrorCodes.EVENT_SERIALIZATION_FAILED:
            return new EventError(message, code);
        default:
            return new NostrError(message, code);
    }
}
//# sourceMappingURL=errors.js.map