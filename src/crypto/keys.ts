/**
 * @module crypto/keys
 * @description Key pair generation and validation for Nostr
 */

import { secp256k1, schnorr } from '@noble/curves/secp256k1';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { sha256 } from '@noble/hashes/sha256';
import { KeyPair, ValidationResult, PublicKey } from '../types/base';
import { logger } from '../utils';

/**
 * Gets the compressed public key (33 bytes with prefix)
 */
function getCompressedPublicKey(privateKeyBytes: Uint8Array): Uint8Array {
  return secp256k1.getPublicKey(privateKeyBytes, true);
}

/**
 * Gets the schnorr public key (32 bytes x-coordinate) as per BIP340
 */
function getSchnorrPublicKey(privateKeyBytes: Uint8Array): Uint8Array {
  return schnorr.getPublicKey(privateKeyBytes);
}

/**
 * Creates a PublicKey object from a hex string
 */
export function createPublicKey(hex: string): PublicKey {
  const bytes = hexToBytes(hex);
  // For schnorr, we need to remove the first byte (compression prefix)
  const schnorrBytes = bytes.length === 33 ? bytes.slice(1) : bytes;
  return {
    hex,
    bytes,
    schnorrHex: bytesToHex(schnorrBytes),
    schnorrBytes
  };
}

/**
 * Generates a new key pair for use in Nostr
 */
export async function generateKeyPair(seedPhrase?: string): Promise<KeyPair> {
  try {
    let privateKeyBytes: Uint8Array;
    
    if (seedPhrase) {
      // Generate deterministic private key from seed
      privateKeyBytes = sha256(new TextEncoder().encode(seedPhrase));
      // Ensure it's a valid private key
      if (!secp256k1.utils.isValidPrivateKey(privateKeyBytes)) {
        // If not valid, hash it again
        privateKeyBytes = sha256(privateKeyBytes);
      }
    } else {
      // Generate random private key
      privateKeyBytes = secp256k1.utils.randomPrivateKey();
    }

    // Convert private key to hex
    const privateKey = bytesToHex(privateKeyBytes);

    // Get compressed public key for hex (33 bytes)
    const compressedPubKey = getCompressedPublicKey(privateKeyBytes);
    
    // Get schnorr public key (32 bytes)
    const schnorrPubKey = getSchnorrPublicKey(privateKeyBytes);
  
    return {
      privateKey,
      publicKey: {
        hex: bytesToHex(compressedPubKey),
        bytes: compressedPubKey,
        schnorrHex: bytesToHex(schnorrPubKey),
        schnorrBytes: schnorrPubKey
      }
    };
  } catch (error) {
    logger.error('Failed to generate key pair:', error);
    throw error;
  }
}

/**
 * Gets the public key from a private key
 */
export function getPublicKey(privateKey: string): PublicKey {
  try {
    const privateKeyBytes = hexToBytes(privateKey);
    
    // Get compressed public key (33 bytes)
    const compressedPubKey = getCompressedPublicKey(privateKeyBytes);

    // Get schnorr public key (32 bytes)
    const schnorrPubKey = getSchnorrPublicKey(privateKeyBytes);

    return {
      hex: bytesToHex(compressedPubKey),
      bytes: compressedPubKey,
      schnorrHex: bytesToHex(schnorrPubKey),
      schnorrBytes: schnorrPubKey
    };
  } catch (error) {
    logger.error('Failed to derive public key:', error);
    throw error;
  }
}

/**
 * Validates a key pair
 */
export async function validateKeyPair(publicKey: PublicKey, privateKey: string): Promise<ValidationResult> {
  try {
    // Convert private key to bytes
    const privateKeyBytes = hexToBytes(privateKey);
    
    // Check if private key is valid
    if (!secp256k1.utils.isValidPrivateKey(privateKeyBytes)) {
      return {
        isValid: false,
        error: 'Invalid private key'
      };
    }

    // Derive public key from private key
    const derivedPublicKey = getPublicKey(privateKey);
    
    // Compare derived public key with provided public key
    const publicKeysMatch = 
      derivedPublicKey.hex === publicKey.hex &&
      derivedPublicKey.schnorrHex === publicKey.schnorrHex;

    if (!publicKeysMatch) {
      return {
        isValid: false,
        error: 'Public key does not match private key'
      };
    }

    return {
      isValid: true
    };
  } catch (error) {
    logger.error('Failed to validate key pair:', error);
    return {
      isValid: false,
      error: 'Failed to validate key pair: ' + (error instanceof Error ? error.message : String(error))
    };
  }
}

/**
 * Validates a Nostr public key
 */
export function validatePublicKey(publicKey: PublicKey): boolean {
  try {
    // Convert hex to bytes (already in compressed format)
    const publicKeyBytes = hexToBytes(publicKey.hex);
    
    // Check if the public key is a valid secp256k1 point
    const point = secp256k1.getPublicKey(publicKeyBytes, true);
    // If we get here without throwing, the point is valid
    return true;
  } catch (error) {
    logger.error('Failed to validate public key:', error);
    return false;
  }
}

export {
  getCompressedPublicKey,
  getSchnorrPublicKey
};
