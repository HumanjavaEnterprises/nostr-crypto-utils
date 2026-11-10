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

// ─── Signer / Server Types ──────────────────────────────────────────────────

/**
 * Callback handlers the consumer provides to the signer.
 * The signer dispatches incoming NIP-46 requests to these handlers.
 * NIP-04 handlers are optional (legacy support).
 */
export interface Nip46SignerHandlers {
  /** Return the signer's public key (hex) */
  getPublicKey: () => string | Promise<string>;
  /** Sign a stringified unsigned event, return the stringified signed event */
  signEvent: (eventJson: string) => string | Promise<string>;
  /** NIP-04 encrypt (legacy, optional) */
  nip04Encrypt?: (pubkey: string, plaintext: string) => string | Promise<string>;
  /** NIP-04 decrypt (legacy, optional) */
  nip04Decrypt?: (pubkey: string, ciphertext: string) => string | Promise<string>;
  /** NIP-44 encrypt */
  nip44Encrypt?: (pubkey: string, plaintext: string) => string | Promise<string>;
  /** NIP-44 decrypt */
  nip44Decrypt?: (pubkey: string, ciphertext: string) => string | Promise<string>;
  /** Return relay map as JSON string */
  getRelays?: () => string | Promise<string>;
}

/**
 * Options for handleSignerRequest
 */
export interface Nip46HandleOptions {
  /**
   * Expected connection secret (from bunker:// URI). Compared in constant time.
   * When neither `secret` nor `onConnect` is set, `connect` is REFUSED unless
   * `allowOpenConnect` is true (fail-closed since 0.10.0).
   */
  secret?: string;
  /**
   * Secrets that were already used. If the presented secret is in this set,
   * connect is refused. Not mutated — on success the result carries
   * `consumedSecret`, which the caller should add to the set (one-time secrets).
   */
  usedSecrets?: Set<string>;
  /**
   * Approval callback for connect. Called after any `secret` check passes; connect
   * succeeds only if it returns true. With no `secret`, this is the gate.
   */
  onConnect?: (clientPubkey: string, params: string[]) => boolean | Promise<boolean>;
  /**
   * Explicit opt-in to the pre-0.10 behaviour: with no `secret` and no `onConnect`,
   * acknowledge ANY connect and authenticate the caller. Dangerous. Defaults to false.
   */
  allowOpenConnect?: boolean;
  /**
   * This signer's pubkey (hex). When set, a connect whose params[0] (the remote
   * signer pubkey) is not this key is refused.
   */
  signerPubkey?: string;
  /**
   * Set of authenticated client pubkeys. Not mutated — check newlyAuthenticated on result.
   * The dispatcher is FAIL-CLOSED: privileged methods (get_public_key, sign_event,
   * nip04/nip44 encrypt/decrypt, get_relays) are denied unless this set is provided
   * AND contains the requesting client's pubkey. Only `connect` and `ping` are allowed
   * without prior authentication.
   */
  authenticatedClients?: Set<string>;
  /**
   * Explicit opt-in to serve privileged methods WITHOUT any authentication gating.
   * Dangerous — only for trusted, single-tenant local setups. Defaults to false.
   */
  allowUnauthenticated?: boolean;
}

/**
 * Result of handleSignerRequest()
 */
export interface Nip46HandleResult {
  /** The response to send back to the client */
  response: Nip46Response;
  /** If the connect handshake succeeded, this is the client pubkey to add to authenticated set */
  newlyAuthenticated?: string;
  /** If connect succeeded with a secret, that secret — add it to `usedSecrets` for one-time use */
  consumedSecret?: string;
}

/**
 * Replay protection for unwrapRequest() / unwrapEvent().
 */
export interface Nip46UnwrapOptions {
  /**
   * Cache of already-processed requests, keyed by `<sender pubkey>:<request id>`
   * (both authenticated by the NIP-44 MAC). A repeat throws; a new key is ADDED
   * to the set. Bound its size/lifetime yourself (pair it with `maxAgeSeconds`).
   */
  seenIds?: Set<string>;
  /**
   * Reject events whose created_at is more than this many seconds from now.
   * When set, the event signature is verified too (created_at is otherwise
   * unauthenticated).
   */
  maxAgeSeconds?: number;
  /** Override "now" (unix seconds) — for testing. */
  now?: number;
}

/**
 * Result of unwrapRequest()
 */
export interface Nip46UnwrapResult {
  /** The decrypted request */
  request: Nip46Request;
  /** The client's pubkey (from event.pubkey) */
  clientPubkey: string;
  /** NIP-44 conversation key (reuse for wrapResponse) */
  conversationKey: Uint8Array;
}
