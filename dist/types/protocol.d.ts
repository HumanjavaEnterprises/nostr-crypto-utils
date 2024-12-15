/**
 * Nostr protocol specific types and enums
 * @module protocol
 */
import { SignedNostrEvent } from './base';
/**
 * Standard Nostr message types as defined in NIP-01
 * @enum {string}
 */
export declare enum NostrMessageType {
    /** Client sending an event to a relay */
    EVENT = "EVENT",
    /** Client requesting events from a relay */
    REQ = "REQ",
    /** Client closing a subscription */
    CLOSE = "CLOSE",
    /** Relay sending a notice/message to a client */
    NOTICE = "NOTICE",
    /** Relay acknowledging an event */
    OK = "OK",
    /** Relay requesting client authentication */
    AUTH = "AUTH",
    /** Relay indicating end of stored events */
    EOSE = "EOSE"
}
/**
 * Standard event kinds as defined in various NIPs
 * @enum {number}
 */
export declare enum NostrEventKind {
    /** User metadata (NIP-01) */
    METADATA = 0,
    /** Text note (NIP-01) */
    TEXT_NOTE = 1,
    /** Relay recommendation (NIP-01) */
    RECOMMEND_SERVER = 2,
    /** Contact list (NIP-02) */
    CONTACTS = 3,
    /** Encrypted direct message (NIP-04) */
    ENCRYPTED_DIRECT_MESSAGE = 4,
    /** Event deletion (NIP-09) */
    DELETE = 5,
    /** Event repost (NIP-18) */
    REPOST = 6,
    /** Reaction (NIP-25) */
    REACTION = 7,
    /** Channel creation (NIP-28) */
    CHANNEL_CREATION = 40,
    /** Channel message (NIP-28) */
    CHANNEL_MESSAGE = 42,
    /** Channel message hiding (NIP-28) */
    CHANNEL_HIDE_MESSAGE = 43,
    /** Channel user muting (NIP-28) */
    CHANNEL_MUTE_USER = 44
}
/**
 * Filter for querying events from relays
 * @interface NostrFilter
 */
export interface NostrFilter {
    /** List of event IDs to match */
    ids?: string[];
    /** List of pubkeys (authors) to match */
    authors?: string[];
    /** List of event kinds to match */
    kinds?: number[];
    /** List of referenced event IDs to match */
    '#e'?: string[];
    /** List of referenced pubkeys to match */
    '#p'?: string[];
    /** Earliest timestamp to match */
    since?: number;
    /** Latest timestamp to match */
    until?: number;
    /** Maximum number of events to return */
    limit?: number;
    /** Allow any custom tag filters */
    [key: `#${string}`]: string[] | undefined;
}
/**
 * Subscription request to a relay
 * @interface NostrSubscription
 */
export interface NostrSubscription {
    /** Unique subscription identifier */
    id: string;
    /** Array of filters to apply */
    filters: NostrFilter[];
}
/**
 * Server response message
 * @interface NostrResponse
 */
export interface NostrResponse {
    /** Type of the response message */
    type: NostrMessageType;
    /** Response payload, format varies by type */
    payload: unknown;
}
/**
 * Error response from a relay
 * @interface NostrError
 */
export interface NostrError {
    /** Error code */
    code: number;
    /** Error message */
    message: string;
    /** Additional error data */
    data?: unknown;
}
/**
 * Standard Nostr message format
 * @interface NostrMessage
 */
export interface NostrMessage {
    /** The type of message */
    type: NostrMessageType;
    /** Optional subscription ID for subscription-related messages */
    subscriptionId?: string;
    /** Optional event data for EVENT messages */
    event?: SignedNostrEvent;
    /** Optional message content for NOTICE messages */
    message?: string;
}
