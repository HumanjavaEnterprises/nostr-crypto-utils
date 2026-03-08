/**
 * @module test/nips/nip-46
 * @description Tests for NIP-46 (Nostr Connect / Remote Signing)
 */

import { describe, it, expect } from 'vitest';
import { bytesToHex, randomBytes } from '@noble/hashes/utils.js';
import { schnorr } from '@noble/curves/secp256k1.js';
import {
  parseBunkerURI,
  createBunkerURI,
  validateBunkerURI,
  createSession,
  restoreSession,
  getSessionInfo,
  createRequest,
  createResponse,
  parsePayload,
  isRequest,
  isResponse,
  wrapEvent,
  unwrapEvent,
  connectRequest,
  pingRequest,
  getPublicKeyRequest,
  signEventRequest,
  nip04EncryptRequest,
  nip04DecryptRequest,
  nip44EncryptRequest,
  nip44DecryptRequest,
  getRelaysRequest,
  createResponseFilter,
  createRequestFilter,
  handleSignerRequest,
  unwrapRequest,
  wrapResponse,
} from '../../nips/nip-46';
import { Nip46Method } from '../../types';
import type { Nip46SignerHandlers } from '../../types';

// Helper: generate a keypair
function generateTestKeypair(): { secretKey: string; pubkey: string } {
  const sk = randomBytes(32);
  const pk = schnorr.getPublicKey(sk);
  return { secretKey: bytesToHex(sk), pubkey: bytesToHex(pk) };
}

const signer = generateTestKeypair();
const relay1 = 'wss://relay.example.com';
const relay2 = 'wss://relay2.example.com';

describe('NIP-46', () => {
  // ─── Bunker URI ─────────────────────────────────────────────────────

  describe('parseBunkerURI', () => {
    it('should parse a valid bunker URI with one relay', () => {
      const uri = `bunker://${signer.pubkey}?relay=${encodeURIComponent(relay1)}`;
      const parsed = parseBunkerURI(uri);
      expect(parsed.remotePubkey).toBe(signer.pubkey);
      expect(parsed.relays).toEqual([relay1]);
      expect(parsed.secret).toBeUndefined();
    });

    it('should parse a bunker URI with multiple relays and a secret', () => {
      const uri = `bunker://${signer.pubkey}?relay=${encodeURIComponent(relay1)}&relay=${encodeURIComponent(relay2)}&secret=mysecret`;
      const parsed = parseBunkerURI(uri);
      expect(parsed.remotePubkey).toBe(signer.pubkey);
      expect(parsed.relays).toEqual([relay1, relay2]);
      expect(parsed.secret).toBe('mysecret');
    });

    it('should reject invalid prefix', () => {
      expect(() => parseBunkerURI('nostr://abc')).toThrow('must start with bunker://');
    });

    it('should reject invalid pubkey', () => {
      expect(() => parseBunkerURI(`bunker://shortpubkey?relay=${relay1}`)).toThrow('64 hex characters');
    });

    it('should reject missing relay', () => {
      expect(() => parseBunkerURI(`bunker://${signer.pubkey}`)).toThrow('at least one relay');
    });
  });

  describe('createBunkerURI', () => {
    it('should create a valid bunker URI', () => {
      const uri = createBunkerURI(signer.pubkey, [relay1]);
      expect(uri).toContain('bunker://');
      expect(uri).toContain(signer.pubkey);
      expect(uri).toContain(encodeURIComponent(relay1));
    });

    it('should round-trip through parse', () => {
      const uri = createBunkerURI(signer.pubkey, [relay1, relay2], 'secret123');
      const parsed = parseBunkerURI(uri);
      expect(parsed.remotePubkey).toBe(signer.pubkey);
      expect(parsed.relays).toEqual([relay1, relay2]);
      expect(parsed.secret).toBe('secret123');
    });

    it('should reject empty relays', () => {
      expect(() => createBunkerURI(signer.pubkey, [])).toThrow('at least one relay');
    });
  });

  describe('validateBunkerURI', () => {
    it('should return isValid=true for valid URI', () => {
      const uri = `bunker://${signer.pubkey}?relay=${encodeURIComponent(relay1)}`;
      const result = validateBunkerURI(uri);
      expect(result.isValid).toBe(true);
      expect(result.uri).toBeDefined();
      expect(result.uri!.remotePubkey).toBe(signer.pubkey);
    });

    it('should return isValid=false for invalid URI', () => {
      const result = validateBunkerURI('not-a-bunker-uri');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  // ─── Session Management ─────────────────────────────────────────────

  describe('createSession', () => {
    it('should create a session with an ephemeral keypair', () => {
      const session = createSession(signer.pubkey);
      expect(session.clientSecretKey).toMatch(/^[0-9a-f]{64}$/);
      expect(session.clientPubkey).toMatch(/^[0-9a-f]{64}$/);
      expect(session.remotePubkey).toBe(signer.pubkey);
      expect(session.conversationKey).toBeInstanceOf(Uint8Array);
      expect(session.conversationKey.length).toBe(32);
    });

    it('should generate different keys each time', () => {
      const s1 = createSession(signer.pubkey);
      const s2 = createSession(signer.pubkey);
      expect(s1.clientSecretKey).not.toBe(s2.clientSecretKey);
    });
  });

  describe('restoreSession', () => {
    it('should restore a session from a saved key', () => {
      const original = createSession(signer.pubkey);
      const restored = restoreSession(original.clientSecretKey, signer.pubkey);
      expect(restored.clientPubkey).toBe(original.clientPubkey);
      expect(bytesToHex(restored.conversationKey)).toBe(bytesToHex(original.conversationKey));
    });
  });

  describe('getSessionInfo', () => {
    it('should return public info only', () => {
      const session = createSession(signer.pubkey);
      const info = getSessionInfo(session);
      expect(info.clientPubkey).toBe(session.clientPubkey);
      expect(info.remotePubkey).toBe(session.remotePubkey);
      expect((info as Record<string, unknown>).clientSecretKey).toBeUndefined();
      expect((info as Record<string, unknown>).conversationKey).toBeUndefined();
    });
  });

  // ─── JSON-RPC Messages ──────────────────────────────────────────────

  describe('createRequest', () => {
    it('should create a request with a random id', () => {
      const req = createRequest(Nip46Method.PING, []);
      expect(req.id).toMatch(/^[0-9a-f]+$/);
      expect(req.method).toBe('ping');
      expect(req.params).toEqual([]);
    });

    it('should use a provided id', () => {
      const req = createRequest(Nip46Method.SIGN_EVENT, ['{}'], 'custom-id');
      expect(req.id).toBe('custom-id');
    });
  });

  describe('createResponse', () => {
    it('should create a success response', () => {
      const res = createResponse('req-1', 'pong');
      expect(res.id).toBe('req-1');
      expect(res.result).toBe('pong');
      expect(res.error).toBeUndefined();
    });

    it('should create an error response', () => {
      const res = createResponse('req-1', undefined, 'something went wrong');
      expect(res.id).toBe('req-1');
      expect(res.result).toBeUndefined();
      expect(res.error).toBe('something went wrong');
    });
  });

  describe('parsePayload / isRequest / isResponse', () => {
    it('should parse and identify a request', () => {
      const req = createRequest(Nip46Method.GET_PUBLIC_KEY, []);
      const json = JSON.stringify(req);
      const parsed = parsePayload(json);
      expect(isRequest(parsed)).toBe(true);
      expect(isResponse(parsed)).toBe(false);
    });

    it('should parse and identify a response', () => {
      const res = createResponse('id-1', 'result-value');
      const json = JSON.stringify(res);
      const parsed = parsePayload(json);
      expect(isResponse(parsed)).toBe(true);
    });

    it('should reject invalid JSON-RPC', () => {
      expect(() => parsePayload('{}')).toThrow('missing id');
    });
  });

  // ─── Event Wrapping ─────────────────────────────────────────────────

  describe('wrapEvent / unwrapEvent', () => {
    it('should encrypt and sign a request into kind 24133, then decrypt', async () => {
      const session = createSession(signer.pubkey);
      const req = pingRequest();

      const wrapped = await wrapEvent(req, session, signer.pubkey);

      expect(wrapped.kind).toBe(24133);
      expect(wrapped.pubkey).toBe(session.clientPubkey);
      expect(wrapped.tags).toEqual([['p', signer.pubkey]]);
      expect(wrapped.id).toMatch(/^[0-9a-f]{64}$/);
      expect(wrapped.sig).toMatch(/^[0-9a-f]{128}$/);

      // Signer-side: create a session from the signer's perspective
      // The conversation key is the same (ECDH is commutative)
      const { getConversationKey } = await import('../../nips/nip-44');
      const { hexToBytes } = await import('@noble/hashes/utils.js');
      const signerConvKey = getConversationKey(hexToBytes(signer.secretKey), session.clientPubkey);
      const signerSession = {
        clientSecretKey: signer.secretKey,
        clientPubkey: signer.pubkey,
        remotePubkey: session.clientPubkey,
        conversationKey: signerConvKey,
      };

      const unwrapped = unwrapEvent(wrapped, signerSession);
      expect(isRequest(unwrapped)).toBe(true);
      expect((unwrapped as { method: string }).method).toBe('ping');
    });

    it('should reject non-24133 events', () => {
      const session = createSession(signer.pubkey);
      const fakeEvent = {
        id: '00'.repeat(32),
        sig: '00'.repeat(64),
        kind: 1,
        created_at: 0,
        tags: [],
        content: '',
        pubkey: '00'.repeat(32),
      };
      expect(() => unwrapEvent(fakeEvent, session)).toThrow('expected kind 24133');
    });
  });

  // ─── Convenience Request Creators ───────────────────────────────────

  describe('convenience requests', () => {
    it('connectRequest with secret and permissions', () => {
      const req = connectRequest(signer.pubkey, 'secret', 'sign_event,nip04_encrypt');
      expect(req.method).toBe('connect');
      expect(req.params[0]).toBe(signer.pubkey);
      expect(req.params[1]).toBe('secret');
      expect(req.params[2]).toBe('sign_event,nip04_encrypt');
    });

    it('connectRequest without secret but with permissions', () => {
      const req = connectRequest(signer.pubkey, undefined, 'sign_event');
      expect(req.params[0]).toBe(signer.pubkey);
      expect(req.params[1]).toBe('');
      expect(req.params[2]).toBe('sign_event');
    });

    it('pingRequest', () => {
      const req = pingRequest();
      expect(req.method).toBe('ping');
      expect(req.params).toEqual([]);
    });

    it('getPublicKeyRequest', () => {
      const req = getPublicKeyRequest();
      expect(req.method).toBe('get_public_key');
    });

    it('signEventRequest', () => {
      const event = JSON.stringify({ kind: 1, content: 'test' });
      const req = signEventRequest(event);
      expect(req.method).toBe('sign_event');
      expect(req.params[0]).toBe(event);
    });

    it('nip04EncryptRequest', () => {
      const req = nip04EncryptRequest(signer.pubkey, 'hello');
      expect(req.method).toBe('nip04_encrypt');
      expect(req.params).toEqual([signer.pubkey, 'hello']);
    });

    it('nip04DecryptRequest', () => {
      const req = nip04DecryptRequest(signer.pubkey, 'cipher');
      expect(req.method).toBe('nip04_decrypt');
      expect(req.params).toEqual([signer.pubkey, 'cipher']);
    });

    it('nip44EncryptRequest', () => {
      const req = nip44EncryptRequest(signer.pubkey, 'hello');
      expect(req.method).toBe('nip44_encrypt');
      expect(req.params).toEqual([signer.pubkey, 'hello']);
    });

    it('nip44DecryptRequest', () => {
      const req = nip44DecryptRequest(signer.pubkey, 'cipher');
      expect(req.method).toBe('nip44_decrypt');
      expect(req.params).toEqual([signer.pubkey, 'cipher']);
    });

    it('getRelaysRequest', () => {
      const req = getRelaysRequest();
      expect(req.method).toBe('get_relays');
      expect(req.params).toEqual([]);
    });
  });

  // ─── Filter Helpers ─────────────────────────────────────────────────

  describe('createResponseFilter', () => {
    it('should create a filter for kind 24133 with #p tag', () => {
      const filter = createResponseFilter(signer.pubkey);
      expect(filter.kinds).toEqual([24133]);
      expect(filter['#p']).toEqual([signer.pubkey]);
      expect(filter.since).toBeUndefined();
    });

    it('should include since when provided', () => {
      const now = Math.floor(Date.now() / 1000);
      const filter = createResponseFilter(signer.pubkey, now);
      expect(filter.since).toBe(now);
    });
  });

  describe('createRequestFilter', () => {
    it('should create a filter for kind 24133 with #p tag', () => {
      const filter = createRequestFilter(signer.pubkey);
      expect(filter.kinds).toEqual([24133]);
      expect(filter['#p']).toEqual([signer.pubkey]);
      expect(filter.since).toBeUndefined();
    });

    it('should include since when provided', () => {
      const now = Math.floor(Date.now() / 1000);
      const filter = createRequestFilter(signer.pubkey, now);
      expect(filter.since).toBe(now);
    });
  });

  // ─── Signer / Server Helpers ──────────────────────────────────────

  describe('handleSignerRequest', () => {
    const testHandlers: Nip46SignerHandlers = {
      getPublicKey: () => signer.pubkey,
      signEvent: (eventJson: string) => {
        const parsed = JSON.parse(eventJson);
        return JSON.stringify({ ...parsed, id: '00'.repeat(32), sig: '00'.repeat(64) });
      },
      nip04Encrypt: (_pubkey: string, plaintext: string) => `encrypted:${plaintext}`,
      nip04Decrypt: (_pubkey: string, ciphertext: string) => ciphertext.replace('encrypted:', ''),
      nip44Encrypt: (_pubkey: string, plaintext: string) => `nip44:${plaintext}`,
      nip44Decrypt: (_pubkey: string, ciphertext: string) => ciphertext.replace('nip44:', ''),
      getRelays: () => JSON.stringify({ 'wss://relay.example.com': { read: true, write: true } }),
    };
    const client = generateTestKeypair();

    it('should accept connect with valid secret', async () => {
      const req = connectRequest(signer.pubkey, 'mysecret');
      const result = await handleSignerRequest(req, client.pubkey, testHandlers, { secret: 'mysecret' });
      expect(result.response.result).toBe('ack');
      expect(result.newlyAuthenticated).toBe(client.pubkey);
    });

    it('should reject connect with invalid secret', async () => {
      const req = connectRequest(signer.pubkey, 'wrong');
      const result = await handleSignerRequest(req, client.pubkey, testHandlers, { secret: 'mysecret' });
      expect(result.response.error).toBe('invalid secret');
      expect(result.newlyAuthenticated).toBeUndefined();
    });

    it('should accept connect with no secret required', async () => {
      const req = connectRequest(signer.pubkey);
      const result = await handleSignerRequest(req, client.pubkey, testHandlers);
      expect(result.response.result).toBe('ack');
      expect(result.newlyAuthenticated).toBe(client.pubkey);
    });

    it('should respond to ping without authentication', async () => {
      const req = pingRequest();
      const authenticated = new Set<string>(); // empty — client not authenticated
      const result = await handleSignerRequest(req, client.pubkey, testHandlers, { authenticatedClients: authenticated });
      expect(result.response.result).toBe('pong');
    });

    it('should reject unauthenticated get_public_key', async () => {
      const req = getPublicKeyRequest();
      const authenticated = new Set<string>(); // empty
      const result = await handleSignerRequest(req, client.pubkey, testHandlers, { authenticatedClients: authenticated });
      expect(result.response.error).toBe('unauthorized: call connect first');
    });

    it('should dispatch get_public_key when authenticated', async () => {
      const req = getPublicKeyRequest();
      const authenticated = new Set([client.pubkey]);
      const result = await handleSignerRequest(req, client.pubkey, testHandlers, { authenticatedClients: authenticated });
      expect(result.response.result).toBe(signer.pubkey);
    });

    it('should dispatch sign_event', async () => {
      const eventJson = JSON.stringify({ kind: 1, content: 'test' });
      const req = signEventRequest(eventJson);
      const authenticated = new Set([client.pubkey]);
      const result = await handleSignerRequest(req, client.pubkey, testHandlers, { authenticatedClients: authenticated });
      expect(result.response.result).toBeDefined();
      const signed = JSON.parse(result.response.result!);
      expect(signed.content).toBe('test');
      expect(signed.id).toBeDefined();
      expect(signed.sig).toBeDefined();
    });

    it('should dispatch nip04_encrypt', async () => {
      const req = nip04EncryptRequest(signer.pubkey, 'hello');
      const authenticated = new Set([client.pubkey]);
      const result = await handleSignerRequest(req, client.pubkey, testHandlers, { authenticatedClients: authenticated });
      expect(result.response.result).toBe('encrypted:hello');
    });

    it('should dispatch nip04_decrypt', async () => {
      const req = nip04DecryptRequest(signer.pubkey, 'encrypted:hello');
      const authenticated = new Set([client.pubkey]);
      const result = await handleSignerRequest(req, client.pubkey, testHandlers, { authenticatedClients: authenticated });
      expect(result.response.result).toBe('hello');
    });

    it('should dispatch nip44_encrypt', async () => {
      const req = nip44EncryptRequest(signer.pubkey, 'hello');
      const authenticated = new Set([client.pubkey]);
      const result = await handleSignerRequest(req, client.pubkey, testHandlers, { authenticatedClients: authenticated });
      expect(result.response.result).toBe('nip44:hello');
    });

    it('should dispatch nip44_decrypt', async () => {
      const req = nip44DecryptRequest(signer.pubkey, 'nip44:hello');
      const authenticated = new Set([client.pubkey]);
      const result = await handleSignerRequest(req, client.pubkey, testHandlers, { authenticatedClients: authenticated });
      expect(result.response.result).toBe('hello');
    });

    it('should dispatch get_relays', async () => {
      const req = getRelaysRequest();
      const authenticated = new Set([client.pubkey]);
      const result = await handleSignerRequest(req, client.pubkey, testHandlers, { authenticatedClients: authenticated });
      expect(result.response.result).toContain('relay.example.com');
    });

    it('should return error for unsupported method', async () => {
      const req = createRequest('unknown_method', []);
      const authenticated = new Set([client.pubkey]);
      const result = await handleSignerRequest(req, client.pubkey, testHandlers, { authenticatedClients: authenticated });
      expect(result.response.error).toBe('unsupported method: unknown_method');
    });

    it('should return error for missing optional handler', async () => {
      const minimalHandlers: Nip46SignerHandlers = {
        getPublicKey: () => signer.pubkey,
        signEvent: () => '{}',
      };
      const req = nip04EncryptRequest(signer.pubkey, 'hello');
      const authenticated = new Set([client.pubkey]);
      const result = await handleSignerRequest(req, client.pubkey, minimalHandlers, { authenticatedClients: authenticated });
      expect(result.response.error).toBe('nip04_encrypt not supported');
    });

    it('should catch handler errors and return them as response errors', async () => {
      const failingHandlers: Nip46SignerHandlers = {
        getPublicKey: () => { throw new Error('key store locked'); },
        signEvent: () => '{}',
      };
      const req = getPublicKeyRequest();
      const authenticated = new Set([client.pubkey]);
      const result = await handleSignerRequest(req, client.pubkey, failingHandlers, { authenticatedClients: authenticated });
      expect(result.response.error).toBe('key store locked');
    });

    it('should allow all methods when no authenticatedClients set is provided', async () => {
      const req = getPublicKeyRequest();
      // No opts at all — no auth gating
      const result = await handleSignerRequest(req, client.pubkey, testHandlers);
      expect(result.response.result).toBe(signer.pubkey);
    });
  });

  // ─── unwrapRequest / wrapResponse ─────────────────────────────────

  describe('unwrapRequest / wrapResponse', () => {
    it('should unwrap a client request and wrap a signer response', async () => {
      // Client side: create session and wrap a request
      const clientSession = createSession(signer.pubkey);
      const req = getPublicKeyRequest();
      const wrappedReq = await wrapEvent(req, clientSession, signer.pubkey);

      // Signer side: unwrap the request
      const unwrapped = unwrapRequest(wrappedReq, signer.secretKey);
      expect(unwrapped.clientPubkey).toBe(clientSession.clientPubkey);
      expect(unwrapped.request.method).toBe('get_public_key');
      expect(unwrapped.conversationKey).toBeInstanceOf(Uint8Array);

      // Signer side: create and wrap a response
      const resp = createResponse(unwrapped.request.id, signer.pubkey);
      const wrappedResp = await wrapResponse(
        resp,
        signer.secretKey,
        signer.pubkey,
        unwrapped.clientPubkey,
        unwrapped.conversationKey
      );

      expect(wrappedResp.kind).toBe(24133);
      expect(wrappedResp.pubkey).toBe(signer.pubkey);
      expect(wrappedResp.tags).toEqual([['p', clientSession.clientPubkey]]);

      // Client side: unwrap the response
      const decrypted = unwrapEvent(wrappedResp, clientSession);
      expect(isResponse(decrypted)).toBe(true);
      expect((decrypted as { result?: string }).result).toBe(signer.pubkey);
    });

    it('should reject non-24133 events in unwrapRequest', () => {
      const fakeEvent = {
        id: '00'.repeat(32),
        sig: '00'.repeat(64),
        kind: 1,
        created_at: 0,
        tags: [],
        content: '',
        pubkey: '00'.repeat(32),
      };
      expect(() => unwrapRequest(fakeEvent, signer.secretKey)).toThrow('expected kind 24133');
    });
  });

  // ─── Full Client ↔ Server Round-Trip ──────────────────────────────

  describe('full client ↔ server round-trip', () => {
    it('should complete connect → get_public_key → sign_event flow', async () => {
      const client = generateTestKeypair();
      const secret = 'test-secret-42';

      // Signer-side handlers
      const handlers: Nip46SignerHandlers = {
        getPublicKey: () => signer.pubkey,
        signEvent: (eventJson: string) => {
          const ev = JSON.parse(eventJson);
          return JSON.stringify({ ...ev, id: '11'.repeat(32), sig: '22'.repeat(64), pubkey: signer.pubkey });
        },
      };

      // Client creates session
      const clientSession = createSession(signer.pubkey);

      // ─── Step 1: connect ───
      const connectReq = connectRequest(signer.pubkey, secret);
      const wrappedConnect = await wrapEvent(connectReq, clientSession, signer.pubkey);

      // Signer unwraps
      const unwrappedConnect = unwrapRequest(wrappedConnect, signer.secretKey);
      expect(unwrappedConnect.request.method).toBe('connect');

      // Signer handles
      const authenticatedClients = new Set<string>();
      const connectResult = await handleSignerRequest(
        unwrappedConnect.request,
        unwrappedConnect.clientPubkey,
        handlers,
        { secret, authenticatedClients }
      );
      expect(connectResult.response.result).toBe('ack');
      expect(connectResult.newlyAuthenticated).toBe(clientSession.clientPubkey);

      // Consumer updates auth set
      authenticatedClients.add(connectResult.newlyAuthenticated!);

      // Signer wraps response
      const wrappedConnectResp = await wrapResponse(
        connectResult.response,
        signer.secretKey,
        signer.pubkey,
        unwrappedConnect.clientPubkey,
        unwrappedConnect.conversationKey
      );

      // Client unwraps response
      const connectResp = unwrapEvent(wrappedConnectResp, clientSession);
      expect(isResponse(connectResp)).toBe(true);
      expect((connectResp as { result?: string }).result).toBe('ack');

      // ─── Step 2: get_public_key ───
      const gpkReq = getPublicKeyRequest();
      const wrappedGpk = await wrapEvent(gpkReq, clientSession, signer.pubkey);
      const unwrappedGpk = unwrapRequest(wrappedGpk, signer.secretKey);
      const gpkResult = await handleSignerRequest(
        unwrappedGpk.request,
        unwrappedGpk.clientPubkey,
        handlers,
        { authenticatedClients }
      );
      expect(gpkResult.response.result).toBe(signer.pubkey);

      const wrappedGpkResp = await wrapResponse(
        gpkResult.response,
        signer.secretKey,
        signer.pubkey,
        unwrappedGpk.clientPubkey,
        unwrappedGpk.conversationKey
      );
      const gpkResp = unwrapEvent(wrappedGpkResp, clientSession);
      expect((gpkResp as { result?: string }).result).toBe(signer.pubkey);

      // ─── Step 3: sign_event ───
      const eventJson = JSON.stringify({ kind: 1, content: 'hello nostr', created_at: 0, tags: [] });
      const signReq = signEventRequest(eventJson);
      const wrappedSign = await wrapEvent(signReq, clientSession, signer.pubkey);
      const unwrappedSign = unwrapRequest(wrappedSign, signer.secretKey);
      const signResult = await handleSignerRequest(
        unwrappedSign.request,
        unwrappedSign.clientPubkey,
        handlers,
        { authenticatedClients }
      );
      expect(signResult.response.result).toBeDefined();
      const signedEvent = JSON.parse(signResult.response.result!);
      expect(signedEvent.content).toBe('hello nostr');
      expect(signedEvent.pubkey).toBe(signer.pubkey);

      const wrappedSignResp = await wrapResponse(
        signResult.response,
        signer.secretKey,
        signer.pubkey,
        unwrappedSign.clientPubkey,
        unwrappedSign.conversationKey
      );
      const signResp = unwrapEvent(wrappedSignResp, clientSession);
      expect(isResponse(signResp)).toBe(true);
      const clientSigned = JSON.parse((signResp as { result: string }).result);
      expect(clientSigned.content).toBe('hello nostr');
    });
  });
});
