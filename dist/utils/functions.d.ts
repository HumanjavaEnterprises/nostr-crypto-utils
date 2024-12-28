/**
 * @module utils/functions
 * @description General utility functions for Nostr operations
 */
import type { NostrEvent, SignedNostrEvent } from '../types';
/**
 * Formats an event for relay transmission
 */
export declare function formatEventForRelay(event: SignedNostrEvent): string;
/**
 * Parses a Nostr message from a relay
 */
export declare function parseNostrMessage(message: string): any;
/**
 * Creates a metadata event
 */
export declare function createMetadataEvent(metadata: {
    name?: string;
    about?: string;
    picture?: string;
    [key: string]: any;
}): NostrEvent;
/**
 * Extracts referenced events from tags
 */
export declare function extractReferencedEvents(event: NostrEvent): string[];
