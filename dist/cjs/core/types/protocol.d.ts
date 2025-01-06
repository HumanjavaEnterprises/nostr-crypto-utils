/**
 * Core protocol types for Nostr
 * @module core/types/protocol
 */
import { NostrEvent, SignedNostrEvent } from './events';
/**
 * Filter for querying events
 */
export interface NostrFilter {
    ids?: string[];
    authors?: string[];
    kinds?: number[];
    '#e'?: string[];
    '#p'?: string[];
    since?: number;
    until?: number;
    limit?: number;
}
/**
 * Subscription to events
 */
export interface NostrSubscription {
    id: string;
    filters: NostrFilter[];
}
/**
 * Relay information
 */
export interface RelayInfo {
    url: string;
    status: 'connected' | 'connecting' | 'disconnected';
    supported_nips?: number[];
    software?: string;
    version?: string;
}
/**
 * Message from relay
 */
export type RelayMessage = ['EVENT', string, NostrEvent] | ['NOTICE', string] | ['EOSE', string] | ['OK', string, boolean, string] | ['AUTH', string];
/**
 * Message to relay
 */
export type ClientMessage = ['EVENT', NostrEvent] | ['REQ', string, ...NostrFilter[]] | ['CLOSE', string] | ['AUTH', string];
/**
 * Relay event handler
 */
export interface RelayEventHandlers {
    onEvent?: (event: SignedNostrEvent) => void;
    onEose?: (subscriptionId: string) => void;
    onNotice?: (message: string) => void;
    onOk?: (eventId: string, accepted: boolean, message: string) => void;
    onAuth?: (challenge: string) => void;
    onError?: (error: Error) => void;
}
/**
 * Relay connection options
 */
export interface RelayOptions {
    reconnect?: boolean;
    maxReconnectAttempts?: number;
    reconnectDelay?: number;
    timeout?: number;
    skipVerification?: boolean;
}
/**
 * Subscription options
 */
export interface SubscriptionOptions {
    oneShot?: boolean;
    timeout?: number;
    skipVerification?: boolean;
}
//# sourceMappingURL=protocol.d.ts.map