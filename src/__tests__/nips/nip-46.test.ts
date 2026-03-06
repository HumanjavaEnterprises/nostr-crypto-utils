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
} from '../../nips/nip-46';
import { Nip46Method } from '../../types';

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

  // ─── Filter Helper ──────────────────────────────────────────────────

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
});
