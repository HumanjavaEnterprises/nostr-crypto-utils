/**
 * @module test/nips/nip-98
 * @description Tests for NIP-98 HTTP Auth
 */

import { describe, it, expect } from 'vitest';
import { bytesToHex, randomBytes } from '@noble/hashes/utils.js';
import {
  createAuthEvent,
  validateAuthEvent,
  toAuthHeader,
  fromAuthHeader,
  hashPayload,
  KIND_HTTP_AUTH,
} from '../../nips/nip-98';

describe('NIP-98 HTTP Auth', () => {
  const priv = bytesToHex(randomBytes(32));
  const url = 'https://api.npub.bio/v1/names/availability?name=alice';

  it('creates a kind-27235 auth event with u and method tags', async () => {
    const ev = await createAuthEvent({ url, method: 'GET' }, priv);
    expect(ev.kind).toBe(KIND_HTTP_AUTH);
    expect(ev.content).toBe('');
    expect(ev.tags).toContainEqual(['u', url]);
    expect(ev.tags).toContainEqual(['method', 'GET']);
    expect(ev.sig).toBeTruthy();
  });

  it('validates a correct auth event', async () => {
    const ev = await createAuthEvent({ url, method: 'GET' }, priv);
    const res = await validateAuthEvent(ev, { url, method: 'GET' });
    expect(res.valid).toBe(true);
  });

  it('round-trips through the Authorization header', async () => {
    const ev = await createAuthEvent({ url, method: 'GET' }, priv);
    const header = toAuthHeader(ev);
    expect(header.startsWith('Nostr ')).toBe(true);
    const parsed = fromAuthHeader(header);
    expect(parsed.id).toBe(ev.id);
    expect(parsed.sig).toBe(ev.sig);
    const res = await validateAuthEvent(parsed, { url, method: 'GET' });
    expect(res.valid).toBe(true);
  });

  it('rejects a URL mismatch', async () => {
    const ev = await createAuthEvent({ url, method: 'GET' }, priv);
    const res = await validateAuthEvent(ev, { url: 'https://api.npub.bio/other', method: 'GET' });
    expect(res.valid).toBe(false);
    expect(res.reason).toMatch(/u tag/);
  });

  it('rejects a method mismatch', async () => {
    const ev = await createAuthEvent({ url, method: 'GET' }, priv);
    const res = await validateAuthEvent(ev, { url, method: 'POST' });
    expect(res.valid).toBe(false);
    expect(res.reason).toMatch(/method/);
  });

  it('rejects an expired event (outside the time window)', async () => {
    const now = Math.floor(Date.now() / 1000);
    const ev = await createAuthEvent({ url, method: 'GET', created_at: now - 120 }, priv);
    const res = await validateAuthEvent(ev, { url, method: 'GET', now, maxAgeSeconds: 60 });
    expect(res.valid).toBe(false);
    expect(res.reason).toMatch(/created_at/);
  });

  it('rejects a tampered signature', async () => {
    const ev = await createAuthEvent({ url, method: 'GET' }, priv);
    const tampered = { ...ev, content: 'tampered' };
    const res = await validateAuthEvent(tampered, { url, method: 'GET' });
    expect(res.valid).toBe(false);
  });

  it('validates a POST body against the payload tag', async () => {
    const body = JSON.stringify({ name: 'alice' });
    const ev = await createAuthEvent({ url, method: 'POST', payload: body }, priv);
    expect(ev.tags).toContainEqual(['payload', hashPayload(body)]);
    const ok = await validateAuthEvent(ev, { url, method: 'POST', body });
    expect(ok.valid).toBe(true);
    const bad = await validateAuthEvent(ev, { url, method: 'POST', body: '{"name":"mallory"}' });
    expect(bad.valid).toBe(false);
    expect(bad.reason).toMatch(/payload/);
  });
});
