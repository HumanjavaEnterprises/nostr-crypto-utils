"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBunkerURI = parseBunkerURI;
exports.createBunkerURI = createBunkerURI;
exports.validateBunkerURI = validateBunkerURI;
exports.createSession = createSession;
exports.restoreSession = restoreSession;
exports.getSessionInfo = getSessionInfo;
exports.createRequest = createRequest;
exports.createResponse = createResponse;
exports.parsePayload = parsePayload;
exports.isRequest = isRequest;
exports.isResponse = isResponse;
exports.wrapEvent = wrapEvent;
exports.unwrapEvent = unwrapEvent;
exports.connectRequest = connectRequest;
exports.pingRequest = pingRequest;
exports.getPublicKeyRequest = getPublicKeyRequest;
exports.signEventRequest = signEventRequest;
exports.nip04EncryptRequest = nip04EncryptRequest;
exports.nip04DecryptRequest = nip04DecryptRequest;
exports.nip44EncryptRequest = nip44EncryptRequest;
exports.nip44DecryptRequest = nip44DecryptRequest;
exports.getRelaysRequest = getRelaysRequest;
exports.createResponseFilter = createResponseFilter;
exports.createRequestFilter = createRequestFilter;
exports.unwrapRequest = unwrapRequest;
exports.wrapResponse = wrapResponse;
exports.handleSignerRequest = handleSignerRequest;
const secp256k1_js_1 = require("@noble/curves/secp256k1.js");
const utils_js_1 = require("@noble/hashes/utils.js");
const sha2_js_1 = require("@noble/hashes/sha2.js");
const nip_44_1 = require("./nip-44");
const types_1 = require("../types");
// ─── 1. Bunker URI ─────────────────────────────────────────────────────────
/**
 * Parse a bunker:// URI into its components
 * @param uri - bunker://&lt;remote-pubkey&gt;?relay=...&secret=...
 * @returns Parsed BunkerURI or throws on invalid input
 */
function parseBunkerURI(uri) {
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
function createBunkerURI(remotePubkey, relays, secret) {
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
function validateBunkerURI(uri) {
    try {
        const parsed = parseBunkerURI(uri);
        return { isValid: true, uri: parsed };
    }
    catch (e) {
        return { isValid: false, error: e.message };
    }
}
// ─── 2. Session Management ─────────────────────────────────────────────────
/**
 * Create a new NIP-46 session with an ephemeral keypair
 * @param remotePubkey - Remote signer's public key (hex)
 * @returns Session containing ephemeral keys and NIP-44 conversation key
 */
function createSession(remotePubkey) {
    if (!/^[0-9a-f]{64}$/.test(remotePubkey)) {
        throw new Error('remotePubkey must be 64 hex characters');
    }
    const clientSecretKeyBytes = (0, utils_js_1.randomBytes)(32);
    const clientSecretKey = (0, utils_js_1.bytesToHex)(clientSecretKeyBytes);
    const clientPubkeyBytes = secp256k1_js_1.schnorr.getPublicKey(clientSecretKeyBytes);
    const clientPubkey = (0, utils_js_1.bytesToHex)(clientPubkeyBytes);
    const conversationKey = (0, nip_44_1.getConversationKey)(clientSecretKeyBytes, remotePubkey);
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
function restoreSession(clientSecretKey, remotePubkey) {
    const clientSecretKeyBytes = (0, utils_js_1.hexToBytes)(clientSecretKey);
    const clientPubkeyBytes = secp256k1_js_1.schnorr.getPublicKey(clientSecretKeyBytes);
    const clientPubkey = (0, utils_js_1.bytesToHex)(clientPubkeyBytes);
    const conversationKey = (0, nip_44_1.getConversationKey)(clientSecretKeyBytes, remotePubkey);
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
function getSessionInfo(session) {
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
function createRequest(method, params, id) {
    return {
        id: id || (0, utils_js_1.bytesToHex)((0, utils_js_1.randomBytes)(16)),
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
function createResponse(id, result, error) {
    const response = { id };
    if (result !== undefined)
        response.result = result;
    if (error !== undefined)
        response.error = error;
    return response;
}
/**
 * Parse a JSON string into a NIP-46 request or response
 * @param json - JSON string to parse
 * @returns Parsed request or response
 */
function parsePayload(json) {
    const obj = JSON.parse(json);
    if (typeof obj.id !== 'string') {
        throw new Error('invalid NIP-46 payload: missing id');
    }
    return obj;
}
/**
 * Check if a payload is a NIP-46 request
 */
function isRequest(payload) {
    return 'method' in payload && 'params' in payload;
}
/**
 * Check if a payload is a NIP-46 response
 */
function isResponse(payload) {
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
async function wrapEvent(payload, session, recipientPubkey) {
    const json = JSON.stringify(payload);
    const encrypted = (0, nip_44_1.encrypt)(json, session.conversationKey);
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
    const eventHash = (0, sha2_js_1.sha256)(new TextEncoder().encode(serialized));
    const privateKeyBytes = (0, utils_js_1.hexToBytes)(session.clientSecretKey);
    const signatureBytes = secp256k1_js_1.schnorr.sign(eventHash, privateKeyBytes);
    return {
        ...event,
        id: (0, utils_js_1.bytesToHex)(eventHash),
        sig: (0, utils_js_1.bytesToHex)(signatureBytes),
    };
}
/**
 * Decrypt and parse a kind 24133 event
 * @param event - Signed kind 24133 event
 * @param session - NIP-46 session
 * @returns Decrypted JSON-RPC request or response
 */
function unwrapEvent(event, session) {
    if (event.kind !== 24133) {
        throw new Error(`expected kind 24133, got ${event.kind}`);
    }
    const json = (0, nip_44_1.decrypt)(event.content, session.conversationKey);
    return parsePayload(json);
}
// ─── 5. Convenience Request Creators ────────────────────────────────────────
/**
 * Create a 'connect' request
 * @param remotePubkey - Remote signer's pubkey
 * @param secret - Optional connection secret from bunker URI
 * @param permissions - Optional comma-separated permission string
 */
function connectRequest(remotePubkey, secret, permissions) {
    const params = [remotePubkey];
    if (secret)
        params.push(secret);
    else if (permissions)
        params.push('');
    if (permissions)
        params.push(permissions);
    return createRequest(types_1.Nip46Method.CONNECT, params);
}
/** Create a 'ping' request */
function pingRequest() {
    return createRequest(types_1.Nip46Method.PING, []);
}
/** Create a 'get_public_key' request */
function getPublicKeyRequest() {
    return createRequest(types_1.Nip46Method.GET_PUBLIC_KEY, []);
}
/**
 * Create a 'sign_event' request
 * @param eventJson - JSON-stringified unsigned event
 */
function signEventRequest(eventJson) {
    return createRequest(types_1.Nip46Method.SIGN_EVENT, [eventJson]);
}
/**
 * Create a 'nip04_encrypt' request
 * @param thirdPartyPubkey - Public key of the message recipient
 * @param plaintext - Message to encrypt
 */
function nip04EncryptRequest(thirdPartyPubkey, plaintext) {
    return createRequest(types_1.Nip46Method.NIP04_ENCRYPT, [thirdPartyPubkey, plaintext]);
}
/**
 * Create a 'nip04_decrypt' request
 * @param thirdPartyPubkey - Public key of the message sender
 * @param ciphertext - Encrypted message to decrypt
 */
function nip04DecryptRequest(thirdPartyPubkey, ciphertext) {
    return createRequest(types_1.Nip46Method.NIP04_DECRYPT, [thirdPartyPubkey, ciphertext]);
}
/**
 * Create a 'nip44_encrypt' request
 * @param thirdPartyPubkey - Public key of the message recipient
 * @param plaintext - Message to encrypt
 */
function nip44EncryptRequest(thirdPartyPubkey, plaintext) {
    return createRequest(types_1.Nip46Method.NIP44_ENCRYPT, [thirdPartyPubkey, plaintext]);
}
/**
 * Create a 'nip44_decrypt' request
 * @param thirdPartyPubkey - Public key of the message sender
 * @param ciphertext - Encrypted message to decrypt
 */
function nip44DecryptRequest(thirdPartyPubkey, ciphertext) {
    return createRequest(types_1.Nip46Method.NIP44_DECRYPT, [thirdPartyPubkey, ciphertext]);
}
/** Create a 'get_relays' request */
function getRelaysRequest() {
    return createRequest(types_1.Nip46Method.GET_RELAYS, []);
}
// ─── 6. Filter Helpers ─────────────────────────────────────────────────────
/**
 * Create a Nostr filter for subscribing to NIP-46 response events
 * @param clientPubkey - Our ephemeral public key (hex)
 * @param since - Optional since timestamp
 * @returns Filter object for kind 24133 events tagged to us
 */
function createResponseFilter(clientPubkey, since) {
    const filter = {
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
function createRequestFilter(signerPubkey, since) {
    const filter = {
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
function unwrapRequest(event, signerSecretKey) {
    if (event.kind !== 24133) {
        throw new Error(`expected kind 24133, got ${event.kind}`);
    }
    const clientPubkey = event.pubkey;
    const signerSecretKeyBytes = (0, utils_js_1.hexToBytes)(signerSecretKey);
    const conversationKey = (0, nip_44_1.getConversationKey)(signerSecretKeyBytes, clientPubkey);
    const json = (0, nip_44_1.decrypt)(event.content, conversationKey);
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
async function wrapResponse(response, signerSecretKey, signerPubkey, clientPubkey, conversationKey) {
    const signerSecretKeyBytes = (0, utils_js_1.hexToBytes)(signerSecretKey);
    const convKey = conversationKey || (0, nip_44_1.getConversationKey)(signerSecretKeyBytes, clientPubkey);
    const json = JSON.stringify(response);
    const encrypted = (0, nip_44_1.encrypt)(json, convKey);
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
    const eventHash = (0, sha2_js_1.sha256)(new TextEncoder().encode(serialized));
    const signatureBytes = secp256k1_js_1.schnorr.sign(eventHash, signerSecretKeyBytes);
    return {
        ...event,
        id: (0, utils_js_1.bytesToHex)(eventHash),
        sig: (0, utils_js_1.bytesToHex)(signatureBytes),
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
async function handleSignerRequest(request, clientPubkey, handlers, opts) {
    const { method, params, id } = request;
    const authenticated = opts?.authenticatedClients;
    // connect is always allowed (it's the auth handshake)
    if (method === types_1.Nip46Method.CONNECT || method === 'connect') {
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
    if (method === types_1.Nip46Method.PING || method === 'ping') {
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
            case types_1.Nip46Method.GET_PUBLIC_KEY:
            case 'get_public_key': {
                const pubkey = await handlers.getPublicKey();
                return { response: createResponse(id, pubkey) };
            }
            case types_1.Nip46Method.SIGN_EVENT:
            case 'sign_event': {
                const signedEvent = await handlers.signEvent(params[0]);
                return { response: createResponse(id, signedEvent) };
            }
            case types_1.Nip46Method.NIP04_ENCRYPT:
            case 'nip04_encrypt': {
                if (!handlers.nip04Encrypt) {
                    return { response: createResponse(id, undefined, 'nip04_encrypt not supported') };
                }
                const result = await handlers.nip04Encrypt(params[0], params[1]);
                return { response: createResponse(id, result) };
            }
            case types_1.Nip46Method.NIP04_DECRYPT:
            case 'nip04_decrypt': {
                if (!handlers.nip04Decrypt) {
                    return { response: createResponse(id, undefined, 'nip04_decrypt not supported') };
                }
                const result = await handlers.nip04Decrypt(params[0], params[1]);
                return { response: createResponse(id, result) };
            }
            case types_1.Nip46Method.NIP44_ENCRYPT:
            case 'nip44_encrypt': {
                if (!handlers.nip44Encrypt) {
                    return { response: createResponse(id, undefined, 'nip44_encrypt not supported') };
                }
                const result = await handlers.nip44Encrypt(params[0], params[1]);
                return { response: createResponse(id, result) };
            }
            case types_1.Nip46Method.NIP44_DECRYPT:
            case 'nip44_decrypt': {
                if (!handlers.nip44Decrypt) {
                    return { response: createResponse(id, undefined, 'nip44_decrypt not supported') };
                }
                const result = await handlers.nip44Decrypt(params[0], params[1]);
                return { response: createResponse(id, result) };
            }
            case types_1.Nip46Method.GET_RELAYS:
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
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return {
            response: createResponse(id, undefined, message),
        };
    }
}
//# sourceMappingURL=nip-46.js.map