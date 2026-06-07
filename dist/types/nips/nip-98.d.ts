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
import type { SignedNostrEvent } from '../types';
/** NIP-98 event kind (RFC 7235 reference). */
export declare const KIND_HTTP_AUTH = 27235;
/** SHA-256 hex of a request body (for the optional `payload` tag). */
export declare function hashPayload(body: string | Uint8Array): string;
/** Parameters for {@link createAuthEvent}. */
export interface CreateAuthEventParams {
    /** Absolute request URL, including query string. */
    url: string;
    /** HTTP method (GET, POST, …). */
    method: string;
    /** Request body, if any — hashed into a `payload` tag (POST/PUT/PATCH). */
    payload?: string | Uint8Array;
    /** Override created_at (unix seconds); defaults to now. */
    created_at?: number;
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
export declare function createAuthEvent(params: CreateAuthEventParams, privateKey: string | Uint8Array): Promise<SignedNostrEvent>;
/** Encode a signed 27235 event as an `Authorization: Nostr <base64>` header value. */
export declare function toAuthHeader(event: SignedNostrEvent): string;
/** Parse an `Authorization: Nostr <base64>` header value back into the event. */
export declare function fromAuthHeader(header: string): SignedNostrEvent;
/** Parameters for {@link validateAuthEvent}. */
export interface ValidateAuthParams {
    /** Absolute request URL the server actually received. */
    url: string;
    /** HTTP method the server actually received. */
    method: string;
    /** Request body, if any — validated against the `payload` tag when present. */
    body?: string | Uint8Array;
    /** Allowed clock skew in seconds (default 60, per the NIP suggestion). */
    maxAgeSeconds?: number;
    /** Require a matching `payload` tag whenever `body` is provided (default false). */
    requirePayload?: boolean;
    /** Override "now" (unix seconds) — for testing. */
    now?: number;
}
/** Result of {@link validateAuthEvent}. */
export interface AuthValidationResult {
    /** True if every check passed and the signature is valid. */
    valid: boolean;
    /** Human-readable reason for the first failed check (absent when valid). */
    reason?: string;
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
export declare function validateAuthEvent(event: SignedNostrEvent, params: ValidateAuthParams): Promise<AuthValidationResult>;
//# sourceMappingURL=nip-98.d.ts.map