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

import { schnorr } from '@noble/curves/secp256k1.js';
import { bytesToHex, hexToBytes, randomBytes } from '@noble/hashes/utils.js';
import { sha256 } from '@noble/hashes/sha2.js';
import {
  getConversationKey as nip44GetConversationKey,
  encrypt as nip44Encrypt,
  decrypt as nip44Decrypt,
} from './nip-44';
import type {
  BunkerURI,
  BunkerValidationResult,
  Nip46Request,
  Nip46Response,
  Nip46Session,
  Nip46SessionInfo,
  Nip46SignerHandlers,
  Nip46HandleOptions,
  Nip46HandleResult,
  Nip46UnwrapResult,
  SignedNostrEvent,
} from '../types';
import { Nip46Method } from '../types';

// ─── 1. Bunker URI ─────────────────────────────────────────────────────────

/**
 * Parse a bunker:// URI into its components
 * @param uri - bunker://&lt;remote-pubkey&gt;?relay=...&secret=...
 * @returns Parsed BunkerURI or throws on invalid input
 */
export function parseBunkerURI(uri: string): BunkerURI {
  if (!uri.startsWith('bunker://')) {
    throw new Error('invalid bunker URI: must start with bunker://');
  }

  const url = new URL(uri.replace('bunker://', 'https://'));
  const remotePubkey = url.hostname;

  if (!/^[0-9a-f]{64}$/.test(remotePubkey)) {
    throw new Error('invalid bunker URI: remote pubkey must be 64 hex characters');
  }

  const relays = url.searchParams.getAll('relay');
  if (relays.length === 0) {
    throw new Error('invalid bunker URI: at least one relay is required');
  }

  const secret = url.searchParams.get('secret') || undefined;

  return { remotePubkey, relays, secret };
}

/**
 * Create a bunker:// URI string
 * @param remotePubkey - Remote signer's public key (hex)
 * @param relays - Relay URLs
 * @param secret - Optional connection secret
 * @returns bunker:// URI string
 */
export function createBunkerURI(remotePubkey: string, relays: string[], secret?: string): string {
  if (!/^[0-9a-f]{64}$/.test(remotePubkey)) {
    throw new Error('remotePubkey must be 64 hex characters');
  }
  if (relays.length === 0) {
    throw new Error('at least one relay is required');
  }

  const params = relays.map(r => `relay=${encodeURIComponent(r)}`);
  if (secret) {
    params.push(`secret=${encodeURIComponent(secret)}`);
  }

  return `bunker://${remotePubkey}?${params.join('&')}`;
}

/**
 * Validate a bunker:// URI and return structured result
 */
export function validateBunkerURI(uri: string): BunkerValidationResult {
  try {
    const parsed = parseBunkerURI(uri);
    return { isValid: true, uri: parsed };
  } catch (e) {
    return { isValid: false, error: (e as Error).message };
  }
}

// ─── 2. Session Management ─────────────────────────────────────────────────

/**
 * Create a new NIP-46 session with an ephemeral keypair
 * @param remotePubkey - Remote signer's public key (hex)
 * @returns Session containing ephemeral keys and NIP-44 conversation key
 */
export function createSession(remotePubkey: string): Nip46Session {
  if (!/^[0-9a-f]{64}$/.test(remotePubkey)) {
    throw new Error('remotePubkey must be 64 hex characters');
  }

  const clientSecretKeyBytes = randomBytes(32);
  const clientSecretKey = bytesToHex(clientSecretKeyBytes);
  const clientPubkeyBytes = schnorr.getPublicKey(clientSecretKeyBytes);
  const clientPubkey = bytesToHex(clientPubkeyBytes);

  const conversationKey = nip44GetConversationKey(clientSecretKeyBytes, remotePubkey);

  return {
    clientSecretKey,
    clientPubkey,
    remotePubkey,
    conversationKey,
  };
}

/**
 * Restore a session from a previously saved ephemeral private key
 * @param clientSecretKey - Hex-encoded ephemeral private key
 * @param remotePubkey - Remote signer's public key (hex)
 * @returns Restored session
 */
export function restoreSession(clientSecretKey: string, remotePubkey: string): Nip46Session {
  const clientSecretKeyBytes = hexToBytes(clientSecretKey);
  const clientPubkeyBytes = schnorr.getPublicKey(clientSecretKeyBytes);
  const clientPubkey = bytesToHex(clientPubkeyBytes);

  const conversationKey = nip44GetConversationKey(clientSecretKeyBytes, remotePubkey);

  return {
    clientSecretKey,
    clientPubkey,
    remotePubkey,
    conversationKey,
  };
}

/**
 * Get public session info (safe to expose)
 */
export function getSessionInfo(session: Nip46Session): Nip46SessionInfo {
  return {
    clientPubkey: session.clientPubkey,
    remotePubkey: session.remotePubkey,
  };
}

// ─── 3. JSON-RPC Messages ──────────────────────────────────────────────────

/**
 * Create a NIP-46 JSON-RPC request
 * @param method - RPC method name
 * @param params - Array of string parameters
 * @param id - Optional request ID (random if not provided)
 * @returns JSON-RPC request object
 */
export function createRequest(method: Nip46Method | string, params: string[], id?: string): Nip46Request {
  return {
    id: id || bytesToHex(randomBytes(16)),
    method,
    params,
  };
}

/**
 * Create a NIP-46 JSON-RPC response
 * @param id - Request ID being responded to
 * @param result - Result string (on success)
 * @param error - Error string (on failure)
 * @returns JSON-RPC response object
 */
export function createResponse(id: string, result?: string, error?: string): Nip46Response {
  const response: Nip46Response = { id };
  if (result !== undefined) response.result = result;
  if (error !== undefined) response.error = error;
  return response;
}

/**
 * Parse a JSON string into a NIP-46 request or response
 * @param json - JSON string to parse
 * @returns Parsed request or response
 */
export function parsePayload(json: string): Nip46Request | Nip46Response {
  const obj = JSON.parse(json) as Record<string, unknown>;
  if (typeof obj.id !== 'string') {
    throw new Error('invalid NIP-46 payload: missing id');
  }
  return obj as unknown as Nip46Request | Nip46Response;
}

/**
 * Check if a payload is a NIP-46 request
 */
export function isRequest(payload: Nip46Request | Nip46Response): payload is Nip46Request {
  return 'method' in payload && 'params' in payload;
}

/**
 * Check if a payload is a NIP-46 response
 */
export function isResponse(payload: Nip46Request | Nip46Response): payload is Nip46Response {
  return 'result' in payload || 'error' in payload;
}

// ─── 4. Event Wrapping (Kind 24133) ────────────────────────────────────────

/**
 * Encrypt and wrap a NIP-46 payload into a kind 24133 signed event
 * @param payload - JSON-RPC request or response to encrypt
 * @param session - NIP-46 session
 * @param recipientPubkey - The recipient's pubkey (hex)
 * @returns Signed kind 24133 event
 */
export async function wrapEvent(
  payload: Nip46Request | Nip46Response,
  session: Nip46Session,
  recipientPubkey: string
): Promise<SignedNostrEvent> {
  const json = JSON.stringify(payload);
  const encrypted = nip44Encrypt(json, session.conversationKey);

  const created_at = Math.floor(Date.now() / 1000);
  const event = {
    kind: 24133,
    created_at,
    tags: [['p', recipientPubkey]],
    content: encrypted,
    pubkey: session.clientPubkey,
  };

  // Serialize for NIP-01 event ID
  const serialized = JSON.stringify([
    0,
    event.pubkey,
    event.created_at,
    event.kind,
    event.tags,
    event.content,
  ]);

  const eventHash = sha256(new TextEncoder().encode(serialized));
  const privateKeyBytes = hexToBytes(session.clientSecretKey);
  const signatureBytes = schnorr.sign(eventHash, privateKeyBytes);

  return {
    ...event,
    id: bytesToHex(eventHash),
    sig: bytesToHex(signatureBytes),
  };
}

/**
 * Decrypt and parse a kind 24133 event
 * @param event - Signed kind 24133 event
 * @param session - NIP-46 session
 * @returns Decrypted JSON-RPC request or response
 */
export function unwrapEvent(
  event: SignedNostrEvent,
  session: Nip46Session
): Nip46Request | Nip46Response {
  if (event.kind !== 24133) {
    throw new Error(`expected kind 24133, got ${event.kind}`);
  }

  const json = nip44Decrypt(event.content, session.conversationKey);
  return parsePayload(json);
}

// ─── 5. Convenience Request Creators ────────────────────────────────────────

/**
 * Create a 'connect' request
 * @param remotePubkey - Remote signer's pubkey
 * @param secret - Optional connection secret from bunker URI
 * @param permissions - Optional comma-separated permission string
 */
export function connectRequest(remotePubkey: string, secret?: string, permissions?: string): Nip46Request {
  const params = [remotePubkey];
  if (secret) params.push(secret);
  else if (permissions) params.push('');
  if (permissions) params.push(permissions);
  return createRequest(Nip46Method.CONNECT, params);
}

/** Create a 'ping' request */
export function pingRequest(): Nip46Request {
  return createRequest(Nip46Method.PING, []);
}

/** Create a 'get_public_key' request */
export function getPublicKeyRequest(): Nip46Request {
  return createRequest(Nip46Method.GET_PUBLIC_KEY, []);
}

/**
 * Create a 'sign_event' request
 * @param eventJson - JSON-stringified unsigned event
 */
export function signEventRequest(eventJson: string): Nip46Request {
  return createRequest(Nip46Method.SIGN_EVENT, [eventJson]);
}

/**
 * Create a 'nip04_encrypt' request
 * @param thirdPartyPubkey - Public key of the message recipient
 * @param plaintext - Message to encrypt
 */
export function nip04EncryptRequest(thirdPartyPubkey: string, plaintext: string): Nip46Request {
  return createRequest(Nip46Method.NIP04_ENCRYPT, [thirdPartyPubkey, plaintext]);
}

/**
 * Create a 'nip04_decrypt' request
 * @param thirdPartyPubkey - Public key of the message sender
 * @param ciphertext - Encrypted message to decrypt
 */
export function nip04DecryptRequest(thirdPartyPubkey: string, ciphertext: string): Nip46Request {
  return createRequest(Nip46Method.NIP04_DECRYPT, [thirdPartyPubkey, ciphertext]);
}

/**
 * Create a 'nip44_encrypt' request
 * @param thirdPartyPubkey - Public key of the message recipient
 * @param plaintext - Message to encrypt
 */
export function nip44EncryptRequest(thirdPartyPubkey: string, plaintext: string): Nip46Request {
  return createRequest(Nip46Method.NIP44_ENCRYPT, [thirdPartyPubkey, plaintext]);
}

/**
 * Create a 'nip44_decrypt' request
 * @param thirdPartyPubkey - Public key of the message sender
 * @param ciphertext - Encrypted message to decrypt
 */
export function nip44DecryptRequest(thirdPartyPubkey: string, ciphertext: string): Nip46Request {
  return createRequest(Nip46Method.NIP44_DECRYPT, [thirdPartyPubkey, ciphertext]);
}

/** Create a 'get_relays' request */
export function getRelaysRequest(): Nip46Request {
  return createRequest(Nip46Method.GET_RELAYS, []);
}

// ─── 6. Filter Helpers ─────────────────────────────────────────────────────

/**
 * Create a Nostr filter for subscribing to NIP-46 response events
 * @param clientPubkey - Our ephemeral public key (hex)
 * @param since - Optional since timestamp
 * @returns Filter object for kind 24133 events tagged to us
 */
export function createResponseFilter(
  clientPubkey: string,
  since?: number
): { kinds: number[]; '#p': string[]; since?: number } {
  const filter: { kinds: number[]; '#p': string[]; since?: number } = {
    kinds: [24133],
    '#p': [clientPubkey],
  };
  if (since !== undefined) {
    filter.since = since;
  }
  return filter;
}

/**
 * Create a Nostr filter for subscribing to NIP-46 request events (server-side)
 * @param signerPubkey - The signer's public key (hex)
 * @param since - Optional since timestamp
 * @returns Filter object for kind 24133 events tagged to the signer
 */
export function createRequestFilter(
  signerPubkey: string,
  since?: number
): { kinds: number[]; '#p': string[]; since?: number } {
  const filter: { kinds: number[]; '#p': string[]; since?: number } = {
    kinds: [24133],
    '#p': [signerPubkey],
  };
  if (since !== undefined) {
    filter.since = since;
  }
  return filter;
}

// ─── 7. Signer / Server Helpers ────────────────────────────────────────────

/**
 * Decrypt an incoming kind 24133 event using the signer's secret key.
 * Returns the decrypted request, client pubkey, and conversation key.
 *
 * @param event - Signed kind 24133 event from a client
 * @param signerSecretKey - Signer's private key (hex)
 * @returns Decrypted request, client pubkey, and conversation key for reuse
 */
export function unwrapRequest(
  event: SignedNostrEvent,
  signerSecretKey: string
): Nip46UnwrapResult {
  if (event.kind !== 24133) {
    throw new Error(`expected kind 24133, got ${event.kind}`);
  }

  const clientPubkey = event.pubkey;
  const signerSecretKeyBytes = hexToBytes(signerSecretKey);
  const conversationKey = nip44GetConversationKey(signerSecretKeyBytes, clientPubkey);
  const json = nip44Decrypt(event.content, conversationKey);
  const payload = parsePayload(json);

  if (!isRequest(payload)) {
    throw new Error('expected a NIP-46 request, got a response');
  }

  return {
    request: payload,
    clientPubkey,
    conversationKey,
  };
}

/**
 * Encrypt and sign a NIP-46 response from the signer's perspective.
 *
 * @param response - JSON-RPC response to send
 * @param signerSecretKey - Signer's private key (hex)
 * @param signerPubkey - Signer's public key (hex)
 * @param clientPubkey - Recipient client's public key (hex)
 * @param conversationKey - Optional pre-computed NIP-44 conversation key (avoids re-deriving ECDH)
 * @returns Signed kind 24133 event
 */
export async function wrapResponse(
  response: Nip46Response,
  signerSecretKey: string,
  signerPubkey: string,
  clientPubkey: string,
  conversationKey?: Uint8Array
): Promise<SignedNostrEvent> {
  const signerSecretKeyBytes = hexToBytes(signerSecretKey);
  const convKey = conversationKey || nip44GetConversationKey(signerSecretKeyBytes, clientPubkey);

  const json = JSON.stringify(response);
  const encrypted = nip44Encrypt(json, convKey);

  const created_at = Math.floor(Date.now() / 1000);
  const event = {
    kind: 24133,
    created_at,
    tags: [['p', clientPubkey]],
    content: encrypted,
    pubkey: signerPubkey,
  };

  const serialized = JSON.stringify([
    0,
    event.pubkey,
    event.created_at,
    event.kind,
    event.tags,
    event.content,
  ]);

  const eventHash = sha256(new TextEncoder().encode(serialized));
  const signatureBytes = schnorr.sign(eventHash, signerSecretKeyBytes);

  return {
    ...event,
    id: bytesToHex(eventHash),
    sig: bytesToHex(signatureBytes),
  };
}

/**
 * Pure dispatch: validates auth, routes a NIP-46 method to the appropriate handler,
 * and returns a response. No state mutation — caller manages authenticated clients.
 *
 * @param request - Parsed NIP-46 request
 * @param clientPubkey - The requesting client's pubkey (hex)
 * @param handlers - Consumer-provided crypto callbacks
 * @param opts - Optional secret and authenticated client set
 * @returns Response and optional newlyAuthenticated pubkey
 */
export async function handleSignerRequest(
  request: Nip46Request,
  clientPubkey: string,
  handlers: Nip46SignerHandlers,
  opts?: Nip46HandleOptions
): Promise<Nip46HandleResult> {
  const { method, params, id } = request;
  const authenticated = opts?.authenticatedClients;

  // connect is always allowed (it's the auth handshake)
  if (method === Nip46Method.CONNECT || method === 'connect') {
    // params[0] = remote pubkey, params[1] = secret (optional)
    const clientSecret = params[1] || undefined;

    if (opts?.secret && clientSecret !== opts.secret) {
      return {
        response: createResponse(id, undefined, 'invalid secret'),
      };
    }

    return {
      response: createResponse(id, 'ack'),
      newlyAuthenticated: clientPubkey,
    };
  }

  // ping is always allowed (even unauthenticated)
  if (method === Nip46Method.PING || method === 'ping') {
    return {
      response: createResponse(id, 'pong'),
    };
  }

  // All other methods require authentication
  if (authenticated && !authenticated.has(clientPubkey)) {
    return {
      response: createResponse(id, undefined, 'unauthorized: call connect first'),
    };
  }

  try {
    switch (method) {
      case Nip46Method.GET_PUBLIC_KEY:
      case 'get_public_key': {
        const pubkey = await handlers.getPublicKey();
        return { response: createResponse(id, pubkey) };
      }

      case Nip46Method.SIGN_EVENT:
      case 'sign_event': {
        const signedEvent = await handlers.signEvent(params[0]);
        return { response: createResponse(id, signedEvent) };
      }

      case Nip46Method.NIP04_ENCRYPT:
      case 'nip04_encrypt': {
        if (!handlers.nip04Encrypt) {
          return { response: createResponse(id, undefined, 'nip04_encrypt not supported') };
        }
        const result = await handlers.nip04Encrypt(params[0], params[1]);
        return { response: createResponse(id, result) };
      }

      case Nip46Method.NIP04_DECRYPT:
      case 'nip04_decrypt': {
        if (!handlers.nip04Decrypt) {
          return { response: createResponse(id, undefined, 'nip04_decrypt not supported') };
        }
        const result = await handlers.nip04Decrypt(params[0], params[1]);
        return { response: createResponse(id, result) };
      }

      case Nip46Method.NIP44_ENCRYPT:
      case 'nip44_encrypt': {
        if (!handlers.nip44Encrypt) {
          return { response: createResponse(id, undefined, 'nip44_encrypt not supported') };
        }
        const result = await handlers.nip44Encrypt(params[0], params[1]);
        return { response: createResponse(id, result) };
      }

      case Nip46Method.NIP44_DECRYPT:
      case 'nip44_decrypt': {
        if (!handlers.nip44Decrypt) {
          return { response: createResponse(id, undefined, 'nip44_decrypt not supported') };
        }
        const result = await handlers.nip44Decrypt(params[0], params[1]);
        return { response: createResponse(id, result) };
      }

      case Nip46Method.GET_RELAYS:
      case 'get_relays': {
        if (!handlers.getRelays) {
          return { response: createResponse(id, undefined, 'get_relays not supported') };
        }
        const relays = await handlers.getRelays();
        return { response: createResponse(id, relays) };
      }

      default:
        return {
          response: createResponse(id, undefined, `unsupported method: ${method}`),
        };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      response: createResponse(id, undefined, message),
    };
  }
}
