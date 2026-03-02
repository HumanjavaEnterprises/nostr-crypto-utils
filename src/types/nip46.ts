/**
 * @module types/nip46
 * @description Type definitions for NIP-46 (Nostr Connect / Remote Signing)
 * @see https://github.com/nostr-protocol/nips/blob/master/46.md
 */

/**
 * NIP-46 remote signing methods
 */
export enum Nip46Method {
  CONNECT = 'connect',
  PING = 'ping',
  GET_PUBLIC_KEY = 'get_public_key',
  SIGN_EVENT = 'sign_event',
  NIP04_ENCRYPT = 'nip04_encrypt',
  NIP04_DECRYPT = 'nip04_decrypt',
  NIP44_ENCRYPT = 'nip44_encrypt',
  NIP44_DECRYPT = 'nip44_decrypt',
  GET_RELAYS = 'get_relays',
}

/**
 * Parsed bunker:// URI
 */
export interface BunkerURI {
  /** Remote signer's public key (hex) */
  remotePubkey: string;
  /** Relay URLs for communication */
  relays: string[];
  /** Optional secret for initial connection */
  secret?: string;
}

/**
 * NIP-46 JSON-RPC request (client -> signer)
 */
export interface Nip46Request {
  id: string;
  method: Nip46Method | string;
  params: string[];
}

/**
 * NIP-46 JSON-RPC response (signer -> client)
 */
export interface Nip46Response {
  id: string;
  result?: string;
  error?: string;
}

/**
 * A NIP-46 session containing the ephemeral keypair and conversation key
 */
export interface Nip46Session {
  /** Client's ephemeral private key (hex) */
  clientSecretKey: string;
  /** Client's ephemeral public key (hex) */
  clientPubkey: string;
  /** Remote signer's public key (hex) */
  remotePubkey: string;
  /** NIP-44 conversation key (derived from ECDH) */
  conversationKey: Uint8Array;
}

/**
 * Public session info (safe to expose; excludes private key and conversation key)
 */
export interface Nip46SessionInfo {
  clientPubkey: string;
  remotePubkey: string;
}

/**
 * Result of validating a bunker:// URI
 */
export interface BunkerValidationResult {
  isValid: boolean;
  error?: string;
  uri?: BunkerURI;
}
