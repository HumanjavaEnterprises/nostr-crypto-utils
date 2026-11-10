/**
 * @module crypto
 * @description Cryptographic utilities for Nostr
 *
 * IMPORTANT: Nostr Protocol Cryptographic Requirements
 * While secp256k1 is the underlying elliptic curve used by Nostr, the protocol specifically
 * requires schnorr signatures as defined in NIP-01. This means:
 *
 * 1. Always use schnorr-specific functions:
 *    - schnorr.getPublicKey() for public key generation
 *    - schnorr.sign() for signing
 *    - schnorr.verify() for verification
 *
 * 2. Avoid using secp256k1 functions directly:
 *    - DON'T use secp256k1.getPublicKey()
 *    - DON'T use secp256k1.sign()
 *    - DON'T use secp256k1.verify()
 *
 * While both might work in some cases (as they use the same curve), the schnorr signature
 * scheme has specific requirements for key and signature formats that aren't guaranteed
 * when using the lower-level secp256k1 functions directly.
 */
import { KeyPair, PublicKeyDetails, NostrEvent, SignedNostrEvent } from './types/index.js';
export declare const signSchnorr: (message: import("@noble/curves/utils.js").TArg<Uint8Array>, secretKey: import("@noble/curves/utils.js").TArg<Uint8Array>, auxRand?: import("@noble/curves/utils.js").TArg<Uint8Array>) => import("@noble/curves/utils.js").TRet<Uint8Array>;
export declare const verifySchnorrSignature: (signature: import("@noble/curves/utils.js").TArg<Uint8Array>, message: import("@noble/curves/utils.js").TArg<Uint8Array>, publicKey: import("@noble/curves/utils.js").TArg<Uint8Array>) => boolean;
/**
 * Gets the compressed public key (33 bytes with prefix)
 */
export declare function getCompressedPublicKey(privateKeyBytes: Uint8Array): Uint8Array;
/**
 * Gets the schnorr public key (32 bytes x-coordinate) as per BIP340
 */
export declare function getSchnorrPublicKey(privateKeyBytes: Uint8Array): Uint8Array;
/**
 * Generates a new key pair
 */
export declare function generateKeyPair(): Promise<KeyPair>;
/**
 * Gets a public key from a private key
 */
export declare function getPublicKey(privateKey: string): Promise<PublicKeyDetails>;
/**
 * Validates a key pair
 */
export declare function validateKeyPair(keyPair: KeyPair): Promise<boolean>;
/**
 * Creates a new event
 */
export declare function createEvent(event: Partial<NostrEvent>): NostrEvent;
/**
 * Signs an event
 * @param event - Event to sign
 * @param privateKey - Private key as hex string or Uint8Array
 */
export declare function signEvent(event: NostrEvent, privateKey: string | Uint8Array): Promise<SignedNostrEvent>;
/**
 * Gets a public key hex string from a private key (synchronous)
 * @param privateKey - Private key as hex string or Uint8Array
 * @returns Hex-encoded public key (32-byte x-only schnorr key)
 */
export declare function getPublicKeySync(privateKey: string | Uint8Array): string;
/**
 * Creates, hashes, and signs a Nostr event in one step
 * @param event - Partial event (kind, content, tags required; pubkey derived if missing)
 * @param privateKey - Private key as hex string or Uint8Array
 * @returns Fully signed event with id, pubkey, and sig
 */
export declare function finalizeEvent(event: Partial<NostrEvent>, privateKey: string | Uint8Array): Promise<SignedNostrEvent>;
/**
 * Verifies an event signature (NIP-01).
 *
 * Returns `false` — silently, without logging — for any invalid input: a
 * non-canonical (uppercase / wrong-length / non-hex) `id`, `pubkey` or `sig`,
 * an `id` that is not the hash of the event, or a bad signature.
 */
export declare function verifySignature(event: SignedNostrEvent): Promise<boolean>;
