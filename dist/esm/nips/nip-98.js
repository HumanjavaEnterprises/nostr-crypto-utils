/**
 * @module nips/nip-98
 * @description NIP-98 HTTP Auth — build and verify the ephemeral `kind 27235`
 * event used to authorize HTTP requests with a Nostr key.
 * @see https://github.com/nostr-protocol/nips/blob/master/98.md
 *
 * This module deliberately performs **no HTTP**. It builds and verifies the
 * auth event and the `Authorization: Nostr <base64>` header value; the caller
 * is responsible for actually issuing/receiving the request. This keeps the
 * package edge-native (no fetch, no transport).
 */
import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex } from '@noble/hashes/utils.js';
import { base64 } from '@scure/base';
import { finalizeEvent, verifySignature } from '../crypto.js';
/** NIP-98 event kind (RFC 7235 reference). */
export const KIND_HTTP_AUTH = 27235;
const utf8Encoder = new TextEncoder();
const utf8Decoder = new TextDecoder();
/** SHA-256 hex of a request body (for the optional `payload` tag). */
export function hashPayload(body) {
    const bytes = typeof body === 'string' ? utf8Encoder.encode(body) : body;
    return bytesToHex(sha256(bytes));
}
/**
 * Build and sign a NIP-98 `kind 27235` auth event.
 * @returns the signed event (encode it for transport with {@link toAuthHeader}).
 * @example
 * ```ts
 * import { createAuthEvent, toAuthHeader } from 'nostr-crypto-utils/nip98';
 *
 * const event = await createAuthEvent(
 *   { url: 'https://api.example.com/v1/me', method: 'GET' },
 *   privateKeyHex,
 * );
 * await fetch('https://api.example.com/v1/me', {
 *   headers: { Authorization: toAuthHeader(event) },
 * });
 * ```
 */
export async function createAuthEvent(params, privateKey) {
    const tags = [
        ['u', params.url],
        ['method', params.method.toUpperCase()],
    ];
    const hasBody = params.payload !== undefined &&
        params.payload !== null &&
        (typeof params.payload !== 'string' || params.payload.length > 0);
    if (hasBody)
        tags.push(['payload', hashPayload(params.payload)]);
    return finalizeEvent({ kind: KIND_HTTP_AUTH, content: '', tags, created_at: params.created_at }, privateKey);
}
/** Encode a signed 27235 event as an `Authorization: Nostr <base64>` header value. */
export function toAuthHeader(event) {
    return `Nostr ${base64.encode(utf8Encoder.encode(JSON.stringify(event)))}`;
}
/** Parse an `Authorization: Nostr <base64>` header value back into the event. */
export function fromAuthHeader(header) {
    const match = header.match(/^Nostr\s+(.+)$/i);
    if (!match)
        throw new Error('Invalid Nostr Authorization header');
    const json = utf8Decoder.decode(base64.decode(match[1].trim()));
    return JSON.parse(json);
}
function tagValue(event, name) {
    return event.tags?.find((t) => t[0] === name)?.[1];
}
/**
 * Validate a NIP-98 auth event against the request it claims to authorize.
 * Performs the spec's ordered checks (kind, created_at window, `u`, `method`,
 * optional `payload`) and finally verifies the signature.
 * @example
 * ```ts
 * import { fromAuthHeader, validateAuthEvent } from 'nostr-crypto-utils/nip98';
 *
 * // In a Cloudflare Worker handler:
 * const event = fromAuthHeader(request.headers.get('Authorization'));
 * const result = await validateAuthEvent(event, {
 *   url: request.url,
 *   method: request.method,
 *   body: await request.text(), // optional; checks the payload tag when present
 * });
 * if (!result.valid) return new Response(result.reason, { status: 401 });
 * const authedPubkey = event.pubkey;
 * ```
 */
export async function validateAuthEvent(event, params) {
    if (!event || event.kind !== KIND_HTTP_AUTH) {
        return { valid: false, reason: 'kind must be 27235' };
    }
    const now = params.now ?? Math.floor(Date.now() / 1000);
    const maxAge = params.maxAgeSeconds ?? 60;
    if (typeof event.created_at !== 'number' || Math.abs(now - event.created_at) > maxAge) {
        return { valid: false, reason: 'created_at outside allowed window' };
    }
    if (tagValue(event, 'u') !== params.url) {
        return { valid: false, reason: 'u tag does not match request URL' };
    }
    const method = tagValue(event, 'method');
    if (!method || method.toUpperCase() !== params.method.toUpperCase()) {
        return { valid: false, reason: 'method tag does not match request method' };
    }
    if (params.body !== undefined) {
        const payloadTag = tagValue(event, 'payload');
        if (payloadTag) {
            if (payloadTag !== hashPayload(params.body)) {
                return { valid: false, reason: 'payload hash does not match request body' };
            }
        }
        else if (params.requirePayload) {
            return { valid: false, reason: 'missing payload tag' };
        }
    }
    if (!(await verifySignature(event))) {
        return { valid: false, reason: 'invalid signature' };
    }
    return { valid: true };
}
//# sourceMappingURL=nip-98.js.map