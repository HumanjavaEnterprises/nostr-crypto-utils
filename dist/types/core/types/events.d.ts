/**
 * Core event types for Nostr
 * @module core/types/events
 */
import { NostrEventKind, NostrMessageType } from '../constants';
/**
 * Basic Nostr event structure
 */
export interface NostrEvent {
    id?: string;
    pubkey?: string;
    created_at: number;
    kind: number;
    tags: string[][];
    content: string;
}
/**
 * Signed Nostr event with id, pubkey, and sig
 */
export interface SignedNostrEvent extends NostrEvent {
    id: string;
    pubkey: string;
    sig: string;
}
/**
 * Event kinds type
 */
export type EventKind = typeof NostrEventKind[keyof typeof NostrEventKind];
/**
 * Message types for relay communication
 */
export type MessageType = typeof NostrMessageType[keyof typeof NostrMessageType];
/**
 * Event creation options
 */
export interface EventOptions {
    kind?: EventKind;
    tags?: string[][];
    content?: string;
    created_at?: number;
}
/**
 * Event verification result
 */
export interface EventVerification {
    valid: boolean;
    reason?: string;
}
/**
 * Event with optional fields for creation
 */
export type PartialEvent = Partial<NostrEvent>;
/**
 * Event with required fields for signing
 */
export type UnsignedEvent = Omit<NostrEvent, 'id' | 'sig' | 'pubkey'> & {
    pubkey: string;
};
//# sourceMappingURL=events.d.ts.map