/**
 * @module types/nip46
 * @description Type definitions for NIP-46 (Nostr Connect / Remote Signing)
 * @see https://github.com/nostr-protocol/nips/blob/master/46.md
 */
/**
 * NIP-46 remote signing methods
 */
export declare enum Nip46Method {
    CONNECT = "connect",
    PING = "ping",
    GET_PUBLIC_KEY = "get_public_key",
    SIGN_EVENT = "sign_event",
    NIP04_ENCRYPT = "nip04_encrypt",
    NIP04_DECRYPT = "nip04_decrypt",
    NIP44_ENCRYPT = "nip44_encrypt",
    NIP44_DECRYPT = "nip44_decrypt",
    GET_RELAYS = "get_relays"
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
    /** Expected connection secret (from bunker:// URI) */
    secret?: string;
    /** Set of authenticated client pubkeys. Not mutated — check newlyAuthenticated on result. */
    authenticatedClients?: Set<string>;
}
/**
 * Result of handleSignerRequest()
 */
export interface Nip46HandleResult {
    /** The response to send back to the client */
    response: Nip46Response;
    /** If the connect handshake succeeded, this is the client pubkey to add to authenticated set */
    newlyAuthenticated?: string;
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
//# sourceMappingURL=nip46.d.ts.map