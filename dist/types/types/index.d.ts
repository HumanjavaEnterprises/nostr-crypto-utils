/**
 * @module types
 * @description Type definitions for Nostr
 */
export interface PublicKeyDetails {
    hex: string;
    bytes: Uint8Array;
}
export interface KeyPair {
    privateKey: string;
    publicKey: PublicKeyDetails;
}
export interface NostrEvent {
    kind: number;
    created_at: number;
    tags: string[][];
    content: string;
    pubkey: string;
}
export interface SignedNostrEvent extends NostrEvent {
    id: string;
    sig: string;
}
export interface PublicKey {
    hex: string;
    bytes?: Uint8Array;
}
export interface ValidationResult {
    isValid: boolean;
    error?: string;
}
export declare enum NostrEventKind {
    SET_METADATA = 0,
    TEXT_NOTE = 1,
    RECOMMEND_SERVER = 2,
    CONTACT_LIST = 3,
    ENCRYPTED_DIRECT_MESSAGE = 4,
    DELETE = 5,
    REPOST = 6,
    REACTION = 7,
    BADGE_AWARD = 8,
    CHANNEL_CREATE = 40,
    CHANNEL_METADATA = 41,
    CHANNEL_MESSAGE = 42,
    CHANNEL_HIDE_MESSAGE = 43,
    CHANNEL_MUTE_USER = 44,
    CHANNEL_RESERVE = 45,
    REPORTING = 1984,
    ZAP_REQUEST = 9734,
    ZAP = 9735,
    MUTE_LIST = 10000,
    PIN_LIST = 10001,
    RELAY_LIST_METADATA = 10002,
    CLIENT_AUTH = 22242,
    AUTH_RESPONSE = 22243,
    NOSTR_CONNECT = 24133,
    CATEGORIZED_PEOPLE = 30000,
    CATEGORIZED_BOOKMARKS = 30001,
    PROFILE_BADGES = 30008,
    BADGE_DEFINITION = 30009,
    LONG_FORM = 30023,
    APPLICATION_SPECIFIC = 30078
}
/**
 * Re-export all types from base module
 * @packageDocumentation
 */
export * from './base';
/** Re-export protocol types */
export * from './protocol';
/** Re-export message types */
export * from './messages';
/** Re-export type guards */
export * from './guards';
export type { Nip19DataType } from '../nips/nip-19';
//# sourceMappingURL=index.d.ts.map