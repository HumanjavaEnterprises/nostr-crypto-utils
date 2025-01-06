/**
 * @module utils/functions
 * @description General utility functions for Nostr operations
 */
import { logger } from './logger';
/**
 * Formats an event for relay transmission
 */
export function formatEventForRelay(event) {
    try {
        return JSON.stringify(['EVENT', event]);
    }
    catch (error) {
        logger.error({ error }, 'Failed to format event for relay');
        throw error;
    }
}
/**
 * Parses a Nostr message from a relay
 */
export function parseNostrMessage(message) {
    try {
        return JSON.parse(message);
    }
    catch (error) {
        logger.error({ error }, 'Failed to parse Nostr message');
        throw error;
    }
}
/**
 * Creates a metadata event
 */
export function createMetadataEvent(metadata) {
    return {
        kind: 0,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: JSON.stringify(metadata),
        pubkey: ''
    };
}
/**
 * Extracts referenced events from tags
 */
export function extractReferencedEvents(event) {
    return event.tags
        .filter((tag) => tag[0] === 'e')
        .map((tag) => tag[1]);
}
/**
 * Convert hex string to Uint8Array
 * @param hex - Hex string to convert
 * @returns Uint8Array
 */
export function hexToBytes(hex) {
    if (typeof hex !== 'string') {
        throw new Error('Input must be a string');
    }
    if (hex.length % 2 !== 0) {
        throw new Error('Hex string must have even length');
    }
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
        const hexByte = hex.slice(i * 2, i * 2 + 2);
        const byte = parseInt(hexByte, 16);
        if (isNaN(byte)) {
            throw new Error('Invalid hex string');
        }
        bytes[i] = byte;
    }
    return bytes;
}
/**
 * Convert a value to a string representation
 */
export function valueToString(value) {
    if (value instanceof Error) {
        return value.message;
    }
    if (typeof value === 'object' && value !== null) {
        try {
            return JSON.stringify(value);
        }
        catch (error) {
            logger.error({ error }, 'Failed to stringify object');
            return String(value);
        }
    }
    return String(value);
}
/**
 * Get tag value from event
 */
export function getTagValue(event, tagName) {
    const tag = event.tags.find((t) => t[0] === tagName);
    return tag ? tag[1] : undefined;
}
/**
 * Get all tag values from event
 */
export function getTagValues(event, tagName) {
    return event.tags
        .filter((t) => t[0] === tagName)
        .map((t) => t[1]);
}
//# sourceMappingURL=functions.js.map