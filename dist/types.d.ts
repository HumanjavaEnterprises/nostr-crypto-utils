/**
 * @module nostr-crypto-utils/types
 * @description Type definitions for the nostr-crypto-utils library
 */
export interface KeyPair {
    privateKey: string;
    publicKey: string;
}
export interface NostrEvent {
    kind: NostrEventKind;
    content: string;
    tags: string[][];
    created_at: number;
    pubkey: string;
}
export interface SignedNostrEvent extends NostrEvent {
    id: string;
    sig: string;
}
export interface ValidationResult {
    isValid: boolean;
    error?: string;
}
export interface EncryptionResult {
    ciphertext: string;
    iv: string;
}
export interface NostrFilter {
    ids?: string[];
    authors?: string[];
    kinds?: number[];
    since?: number;
    until?: number;
    limit?: number;
    search?: string;
    [key: string]: any;
}
export interface NostrSubscription {
    id: string;
    filters: NostrFilter[];
}
export interface NostrMessage {
    type: NostrMessageType;
    payload: any;
}
export interface NostrResponse {
    success: boolean;
    message?: string;
    data?: any;
}
export interface NostrError {
    code: string;
    message: string;
    details?: any;
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
    CHANNEL_CREATE = 40,
    CHANNEL_METADATA = 41,
    CHANNEL_MESSAGE = 42,
    CHANNEL_HIDE_MESSAGE = 43,
    CHANNEL_MUTE_USER = 44,
    REPORT = 1984,
    ZAP_REQUEST = 9734,
    ZAP = 9735
}
export declare enum NostrMessageType {
    EVENT = "EVENT",
    REQ = "REQ",
    CLOSE = "CLOSE",
    NOTICE = "NOTICE",
    EOSE = "EOSE",
    OK = "OK",
    AUTH = "AUTH"
}
