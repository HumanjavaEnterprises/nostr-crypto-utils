/**
 * Main types export file
 */
export * from './base';
export * from './protocol';
export * from './guards';
export interface KeyPair {
    privateKey: string;
    publicKey: string;
}
export interface EncryptionResult {
    ciphertext: string;
    iv: string;
}
export interface ValidationResult {
    isValid: boolean;
    error?: string;
}
