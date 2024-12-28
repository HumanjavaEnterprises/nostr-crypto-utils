/**
 * @module transport
 * @description Functions for handling Nostr protocol messages and transport layer operations
 */
import { NostrEvent, NostrFilter, NostrMessageType } from '../types/base';
export interface NostrMessage {
    messageType: NostrMessageType;
    success: boolean;
    message?: string;
    payload?: any;
}
/**
 * Parses a Nostr message from a relay
 */
export declare function parseNostrMessage(message: any[]): NostrMessage;
/**
 * Formats an event for relay transmission
 */
export declare function formatEventForRelay(event: NostrEvent): [string, NostrEvent];
/**
 * Formats a subscription request for relay transmission
 */
export declare function formatSubscriptionForRelay(id: string, filters: NostrFilter[]): [string, string, ...NostrFilter[]];
/**
 * Formats a close message for relay transmission
 */
export declare function formatCloseForRelay(id: string): [string, string];
