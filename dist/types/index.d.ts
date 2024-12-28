/**
 * @module types
 * @description Type definitions for Nostr
 */
import type { PublicKey, NostrEventKind } from './base';
export * from './base';
export * from './guards';
/**
 * @module nostr-crypto-utils/types
 * @description Type definitions for the nostr-crypto-utils library
 */
export interface KeyPair {
    privateKey: string;
    publicKey: PublicKey;
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
    kinds?: NostrEventKind[];
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
export declare enum NostrMessageType {
    EVENT = "EVENT",
    REQ = "REQ",
    CLOSE = "CLOSE",
    NOTICE = "NOTICE",
    EOSE = "EOSE",
    OK = "OK",
    AUTH = "AUTH"
}
