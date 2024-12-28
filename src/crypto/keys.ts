/**
 * @module crypto/keys
 * @description Key pair generation and validation for Nostr
 */

import * as secp256k1 from '@noble/secp256k1';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { sha256 } from '@noble/hashes/sha256';
import { KeyPair, ValidationResult, PublicKey } from '../types/base';
import { logger } from '../utils';

// Import ProjectivePoint class from secp256k1
import { ProjectivePoint } from '@noble/secp256k1';

/**
 * Generates a new private key for use in Nostr
 * @returns A new private key in hex format
 */
export async function generatePrivateKey(): Promise<string> {
  try {
    const privateKey = secp256k1.utils.randomPrivateKey();
    return bytesToHex(privateKey);
  } catch (error) {
    logger.error('Failed to generate private key:', error);
    throw error;
  }
}

/**
 * Gets the compressed public key (33 bytes with prefix)
 */
function getCompressedPublicKey(privateKeyBytes: Uint8Array): Uint8Array {
  return secp256k1.getPublicKey(privateKeyBytes, true);
}

/**
 * Gets the uncompressed public key (64 bytes without prefix)
 */
function getUncompressedPublicKey(privateKeyBytes: Uint8Array): Uint8Array {
  const fullKey = secp256k1.getPublicKey(privateKeyBytes, false);
  return fullKey.slice(1);  // Remove 0x04 prefix
}

/**
 * Converts a compressed public key to uncompressed format
 */
function compressedToUncompressed(compressedKey: Uint8Array): Uint8Array {
  // Convert to Point and back to get uncompressed format
  const point = ProjectivePoint.fromHex(bytesToHex(compressedKey));
  const uncompressed = point.toRawBytes(false);
  return uncompressed.slice(1); // Remove prefix byte
}

/**
 * Converts an uncompressed public key to compressed format
 */
function uncompressedToCompressed(uncompressedKey: Uint8Array): Uint8Array {
  // Add 0x04 prefix back first
  const fullKey = new Uint8Array(65);
  fullKey[0] = 0x04;
  fullKey.set(uncompressedKey, 1);
  
  // Convert to Point and back to get compressed format
  const point = ProjectivePoint.fromHex(bytesToHex(fullKey));
  return point.toRawBytes(true);
}

/**
 * Generates a new key pair
 */
export async function generateKeyPair(seedPhrase?: string): Promise<KeyPair> {
  try {
    let privateKeyBytes: Uint8Array;
    
    if (seedPhrase) {
      // Generate deterministic private key from seed phrase
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

    // Get uncompressed public key for bytes (64 bytes)
    const publicKeyBytes = getUncompressedPublicKey(privateKeyBytes);

    // Get compressed public key for hex (33 bytes)
    const compressedPubKey = getCompressedPublicKey(privateKeyBytes);
  
    return {
      privateKey,
      publicKey: {
        hex: bytesToHex(compressedPubKey),  // Store compressed hex
        bytes: publicKeyBytes  // Store uncompressed bytes
      }
    };
  } catch (error) {
    logger.error('Failed to generate key pair:', error);
    throw error;
  }
}

/**
 * Derives a public key from a private key
 */
export function getPublicKey(privateKey: string): PublicKey {
  try {
    const privateKeyBytes = hexToBytes(privateKey);
    
    // Get uncompressed public key for bytes (64 bytes)
    const publicKeyBytes = getUncompressedPublicKey(privateKeyBytes);

    // Get compressed public key for hex (33 bytes)
    const compressedPubKey = getCompressedPublicKey(privateKeyBytes);

    return {
      hex: bytesToHex(compressedPubKey),  // Store compressed hex
      bytes: publicKeyBytes  // Store uncompressed bytes
    };
  } catch (error) {
    logger.error('Failed to derive public key:', error);
    throw error;
  }
}

/**
 * Validates a Nostr key pair
 */
export function validateKeyPair(publicKey: PublicKey, privateKey: string): ValidationResult {
  try {
    // Convert private key to bytes
    const privateKeyBytes = hexToBytes(privateKey);
    
    // Get both formats of the derived public key
    const derivedUncompressed = getUncompressedPublicKey(privateKeyBytes);
    const derivedCompressed = getCompressedPublicKey(privateKeyBytes);

    // Compare both formats
    const bytesMatch = publicKey.bytes.every((byte, i) => byte === derivedUncompressed[i]);
    const hexMatch = publicKey.hex === bytesToHex(derivedCompressed);

    const isValid = bytesMatch && hexMatch;

    return {
      isValid,
      error: isValid ? undefined : 'Public key does not match private key'
    };
  } catch (error) {
    logger.error('Failed to validate key pair:', error);
    return {
      isValid: false,
      error: 'Invalid key pair'
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
    const point = ProjectivePoint.fromHex(publicKey.hex);
    // If we get here without throwing, the point is valid
    return true;
  } catch (error) {
    logger.error('Failed to validate public key:', error);
    return false;
  }
}

// Export internal functions for testing
export const _internal = {
  getCompressedPublicKey,
  getUncompressedPublicKey,
  compressedToUncompressed,
  uncompressedToCompressed
};
