/**
 * @module test/nips/nip-59
 * @description Tests for NIP-59 Gift Wrap
 */

import { describe, it, expect } from 'vitest';
import { bytesToHex, randomBytes } from '@noble/hashes/utils.js';
import { schnorr } from '@noble/curves/secp256k1.js';
import {
  createRumor,
  wrapEvent,
  unwrapEvent,
  KIND_GIFT_WRAP,
  KIND_GIFT_WRAP_EPHEMERAL,
} from '../../nips/nip-59';

describe('NIP-59 Gift Wrap', () => {
  const alicePrivBytes = randomBytes(32);
  const alicePriv = bytesToHex(alicePrivBytes);
  const alicePub = bytesToHex(schnorr.getPublicKey(alicePrivBytes));
  const bobPrivBytes = randomBytes(32);
  const bobPriv = bytesToHex(bobPrivBytes);
  const bobPub = bytesToHex(schnorr.getPublicKey(bobPrivBytes));

  it('round-trips a rumor through wrap → unwrap', async () => {
    const rumor = await createRumor({ kind: 1, content: 'are you going tonight?' }, alicePub);
    const wrap = await wrapEvent(rumor, alicePriv, bobPub);
    const out = await unwrapEvent(wrap, bobPriv);
    expect(out.content).toBe('are you going tonight?');
    expect(out.kind).toBe(1);
    expect(out.pubkey).toBe(alicePub);
  });

  it('produces a kind-1059 wrap signed by a one-time key, p-tagged to recipient', async () => {
    const rumor = await createRumor({ kind: 1, content: 'hi' }, alicePub);
    const wrap = await wrapEvent(rumor, alicePriv, bobPub);
    expect(wrap.kind).toBe(KIND_GIFT_WRAP);
    expect(wrap.pubkey).not.toBe(alicePub); // ephemeral signer
    expect(wrap.tags).toContainEqual(['p', bobPub]);
    expect(wrap.content).not.toContain('hi'); // encrypted
  });

  it('supports the ephemeral gift wrap kind (21059)', async () => {
    const rumor = await createRumor({ kind: 1, content: 'live' }, alicePub);
    const wrap = await wrapEvent(rumor, alicePriv, bobPub, { ephemeral: true });
    expect(wrap.kind).toBe(KIND_GIFT_WRAP_EPHEMERAL);
  });

  it('cannot be unwrapped by a non-recipient', async () => {
    const rumor = await createRumor({ kind: 1, content: 'secret' }, alicePub);
    const wrap = await wrapEvent(rumor, alicePriv, bobPub);
    // alice (the sender) is not the addressed recipient and cannot decrypt
    await expect(unwrapEvent(wrap, alicePriv)).rejects.toThrow();
  });

  it('adds a relay hint to the recipient p tag when provided', async () => {
    const rumor = await createRumor({ kind: 1, content: 'hi' }, alicePub);
    const wrap = await wrapEvent(rumor, alicePriv, bobPub, { relayUrl: 'wss://relay.example.com' });
    expect(wrap.tags).toContainEqual(['p', bobPub, 'wss://relay.example.com']);
  });
});
