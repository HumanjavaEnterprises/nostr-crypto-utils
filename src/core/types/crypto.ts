/**
 * Core cryptographic types
 * @module core/types/crypto
 */

/**
 * Public key formats supported in core crypto operations
 */
export type PublicKey = string | {
  type: 'hex';
  data: string;
};

/**
 * Private key formats supported in core crypto operations
 */
export type PrivateKey = string | {
  type: 'hex';
  data: string;
};

/**
 * Basic encryption options
 */
export interface EncryptionOptions {
  iv?: Buffer;
}

/**
 * Basic key pair structure
 */
export interface KeyPair {
  privateKey: string; // hex format
  publicKey: string;  // hex format
}

/**
 * Signature verification result
 */
export interface SignatureVerification {
  valid: boolean;
  reason?: string;
}

/**
 * Basic encryption result
 */
export interface EncryptionResult {
  ciphertext: string; // hex format
  iv: string;        // hex format
}
