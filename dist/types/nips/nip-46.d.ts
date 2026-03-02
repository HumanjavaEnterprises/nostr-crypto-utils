/**
 * @module nips/nip-46
 * @description Implementation of NIP-46 (Nostr Connect / Remote Signing)
 *
 * Pure protocol layer — crypto, encoding, message formatting.
 * No WebSocket, no relay connections, no I/O.
 * Consumers provide their own transport.
 *
 * @see https://github.com/nostr-protocol/nips/blob/master/46.md
 */
import type { BunkerURI, BunkerValidationResult, Nip46Request, Nip46Response, Nip46Session, Nip46SessionInfo, SignedNostrEvent } from '../types';
import { Nip46Method } from '../types';
/**
 * Parse a bunker:// URI into its components
 * @param uri - bunker://&lt;remote-pubkey&gt;?relay=...&secret=...
 * @returns Parsed BunkerURI or throws on invalid input
 */
export declare function parseBunkerURI(uri: string): BunkerURI;
/**
 * Create a bunker:// URI string
 * @param remotePubkey - Remote signer's public key (hex)
 * @param relays - Relay URLs
 * @param secret - Optional connection secret
 * @returns bunker:// URI string
 */
export declare function createBunkerURI(remotePubkey: string, relays: string[], secret?: string): string;
/**
 * Validate a bunker:// URI and return structured result
 */
export declare function validateBunkerURI(uri: string): BunkerValidationResult;
/**
 * Create a new NIP-46 session with an ephemeral keypair
 * @param remotePubkey - Remote signer's public key (hex)
 * @returns Session containing ephemeral keys and NIP-44 conversation key
 */
export declare function createSession(remotePubkey: string): Nip46Session;
/**
 * Restore a session from a previously saved ephemeral private key
 * @param clientSecretKey - Hex-encoded ephemeral private key
 * @param remotePubkey - Remote signer's public key (hex)
 * @returns Restored session
 */
export declare function restoreSession(clientSecretKey: string, remotePubkey: string): Nip46Session;
/**
 * Get public session info (safe to expose)
 */
export declare function getSessionInfo(session: Nip46Session): Nip46SessionInfo;
/**
 * Create a NIP-46 JSON-RPC request
 * @param method - RPC method name
 * @param params - Array of string parameters
 * @param id - Optional request ID (random if not provided)
 * @returns JSON-RPC request object
 */
export declare function createRequest(method: Nip46Method | string, params: string[], id?: string): Nip46Request;
/**
 * Create a NIP-46 JSON-RPC response
 * @param id - Request ID being responded to
 * @param result - Result string (on success)
 * @param error - Error string (on failure)
 * @returns JSON-RPC response object
 */
export declare function createResponse(id: string, result?: string, error?: string): Nip46Response;
/**
 * Parse a JSON string into a NIP-46 request or response
 * @param json - JSON string to parse
 * @returns Parsed request or response
 */
export declare function parsePayload(json: string): Nip46Request | Nip46Response;
/**
 * Check if a payload is a NIP-46 request
 */
export declare function isRequest(payload: Nip46Request | Nip46Response): payload is Nip46Request;
/**
 * Check if a payload is a NIP-46 response
 */
export declare function isResponse(payload: Nip46Request | Nip46Response): payload is Nip46Response;
/**
 * Encrypt and wrap a NIP-46 payload into a kind 24133 signed event
 * @param payload - JSON-RPC request or response to encrypt
 * @param session - NIP-46 session
 * @param recipientPubkey - The recipient's pubkey (hex)
 * @returns Signed kind 24133 event
 */
export declare function wrapEvent(payload: Nip46Request | Nip46Response, session: Nip46Session, recipientPubkey: string): Promise<SignedNostrEvent>;
/**
 * Decrypt and parse a kind 24133 event
 * @param event - Signed kind 24133 event
 * @param session - NIP-46 session
 * @returns Decrypted JSON-RPC request or response
 */
export declare function unwrapEvent(event: SignedNostrEvent, session: Nip46Session): Nip46Request | Nip46Response;
/**
 * Create a 'connect' request
 * @param remotePubkey - Remote signer's pubkey
 * @param secret - Optional connection secret from bunker URI
 * @param permissions - Optional comma-separated permission string
 */
export declare function connectRequest(remotePubkey: string, secret?: string, permissions?: string): Nip46Request;
/** Create a 'ping' request */
export declare function pingRequest(): Nip46Request;
/** Create a 'get_public_key' request */
export declare function getPublicKeyRequest(): Nip46Request;
/**
 * Create a 'sign_event' request
 * @param eventJson - JSON-stringified unsigned event
 */
export declare function signEventRequest(eventJson: string): Nip46Request;
/**
 * Create a 'nip04_encrypt' request
 * @param thirdPartyPubkey - Public key of the message recipient
 * @param plaintext - Message to encrypt
 */
export declare function nip04EncryptRequest(thirdPartyPubkey: string, plaintext: string): Nip46Request;
/**
 * Create a 'nip04_decrypt' request
 * @param thirdPartyPubkey - Public key of the message sender
 * @param ciphertext - Encrypted message to decrypt
 */
export declare function nip04DecryptRequest(thirdPartyPubkey: string, ciphertext: string): Nip46Request;
/**
 * Create a 'nip44_encrypt' request
 * @param thirdPartyPubkey - Public key of the message recipient
 * @param plaintext - Message to encrypt
 */
export declare function nip44EncryptRequest(thirdPartyPubkey: string, plaintext: string): Nip46Request;
/**
 * Create a 'nip44_decrypt' request
 * @param thirdPartyPubkey - Public key of the message sender
 * @param ciphertext - Encrypted message to decrypt
 */
export declare function nip44DecryptRequest(thirdPartyPubkey: string, ciphertext: string): Nip46Request;
/** Create a 'get_relays' request */
export declare function getRelaysRequest(): Nip46Request;
/**
 * Create a Nostr filter for subscribing to NIP-46 response events
 * @param clientPubkey - Our ephemeral public key (hex)
 * @param since - Optional since timestamp
 * @returns Filter object for kind 24133 events tagged to us
 */
export declare function createResponseFilter(clientPubkey: string, since?: number): {
    kinds: number[];
    '#p': string[];
    since?: number;
};
//# sourceMappingURL=nip-46.d.ts.map