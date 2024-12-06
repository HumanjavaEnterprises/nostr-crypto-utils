export interface KeyPair {
    privateKey: string;
    publicKey: string;
}
export interface NostrEvent {
    kind: number;
    created_at: number;
    content: string;
    tags: string[][];
    pubkey?: string;
}
export interface SignedNostrEvent extends NostrEvent {
    id: string;
    sig: string;
    pubkey: string;
}
export interface EncryptionResult {
    ciphertext: string;
    iv: string;
}
export interface ValidationResult {
    isValid: boolean;
    error?: string;
}
