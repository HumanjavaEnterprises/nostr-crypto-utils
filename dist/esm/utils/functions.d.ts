/**
 * @module utils/functions
 * @description General utility functions for Nostr operations
 */
import { NostrEvent } from '../types';
/**
 * Formats an event for relay transmission
 */
export declare function formatEventForRelay(event: unknown): string;
/**
 * Parses a Nostr message from a relay
 */
export declare function parseNostrMessage(message: string): unknown;
/**
 * Creates a metadata event
 */
export declare function createMetadataEvent(metadata: unknown): NostrEvent;
/**
 * Extracts referenced events from tags
 */
export declare function extractReferencedEvents(event: NostrEvent): string[];
/**
 * Convert hex string to Uint8Array
 * @param hex - Hex string to convert
 * @returns Uint8Array
 */
export declare function hexToBytes(hex: string): Uint8Array;
/**
 * Convert a value to a string representation
 */
export declare function valueToString(value: unknown): string;
/**
 * Get tag value from event
 */
export declare function getTagValue(event: NostrEvent, tagName: string): string | undefined;
/**
 * Get all tag values from event
 */
export declare function getTagValues(event: NostrEvent, tagName: string): string[];
//# sourceMappingURL=functions.d.ts.map