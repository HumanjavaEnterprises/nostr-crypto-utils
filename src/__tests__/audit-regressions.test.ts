/**
 * @module test/audit-regressions
 * @description Regression tests for the 2026-07-17 release-audit findings that
 * are behavioral (not covered by the shared KAT vectors).
 */

import { describe, it, expect } from 'vitest';
import { schnorr } from '@noble/curves/secp256k1.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils.js';

import { createEvent, finalizeEvent, getPublicKeySync, signEvent, encrypt, decrypt } from '../crypto';
import { verifySignature } from '../event/signing';
import { validateResponse } from '../validation/index';
import { createDelegation, verifyDelegation, addDelegationTag, extractDelegation, type Delegation } from '../nips/nip-26';
import type { SignedNostrEvent } from '../types/index';

const alicePriv = '0000000000000000000000000000000000000000000000000000000000000001';
const alicePub = getPublicKeySync(alicePriv); // x-only
const bobPriv = '0000000000000000000000000000000000000000000000000000000000000002';
const bobPub = getPublicKeySync(bobPriv);

describe('finding: kind 0 coerced to kind 1 via `|| 1`', () => {
  it('createEvent preserves kind 0', () => {
    const ev = createEvent({ kind: 0, content: '{"name":"alice"}', pubkey: alicePub });
    expect(ev.kind).toBe(0);
  });

  it('finalizeEvent preserves kind 0 and hashes over kind 0', async () => {
    const signed = await finalizeEvent({ kind: 0, content: '{"name":"alice"}', created_at: 1700000000 }, alicePriv);
    expect(signed.kind).toBe(0);
    // Recompute the id over the emitted event and confirm it hashes over kind 0.
    const serialized = JSON.stringify([0, signed.pubkey, signed.created_at, signed.kind, signed.tags, signed.content]);
    expect(bytesToHex(sha256(new TextEncoder().encode(serialized)))).toBe(signed.id);
  });

  it('finalizeEvent still defaults undefined kind to 1', async () => {
    const signed = await finalizeEvent({ content: 'hi' }, alicePriv);
    expect(signed.kind).toBe(1);
  });
});

describe('finding: top-level NIP-04 encrypt/decrypt throw on x-only pubkeys', () => {
  it('back-compat encrypt/decrypt round-trip with a real 64-hex x-only pubkey', async () => {
    const msg = 'no more Point of length 32 was invalid';
    // legacy arg order: (message, recipientPubKey, senderPrivKey)
    const ct = await encrypt(msg, bobPub, alicePriv);
    const pt = await decrypt(ct, alicePub, bobPriv);
    expect(pt).toBe(msg);
  });
});

describe('finding: validateResponse accepts forged EVENT/AUTH', () => {
  async function realSigned(): Promise<SignedNostrEvent> {
    return signEvent(
      { kind: 1, content: 'authentic', created_at: 1700000000, tags: [], pubkey: alicePub },
      alicePriv
    );
  }

  it('accepts a genuinely signed EVENT', async () => {
    const ev = await realSigned();
    expect(validateResponse(['EVENT', ev]).isValid).toBe(true);
  });

  it('rejects an EVENT with correct field lengths but a forged id/sig', () => {
    const forged: SignedNostrEvent = {
      kind: 1,
      content: 'forged',
      created_at: 1700000000,
      tags: [],
      pubkey: alicePub,
      id: 'a'.repeat(64),
      sig: 'b'.repeat(128),
    };
    expect(validateResponse(['EVENT', forged]).isValid).toBe(false);
  });

  it('rejects an EVENT whose content was tampered after signing', async () => {
    const ev = await realSigned();
    const tampered = { ...ev, content: 'tampered' };
    expect(validateResponse(['EVENT', tampered]).isValid).toBe(false);
  });

  it('rejects a forged AUTH event', () => {
    const forged: SignedNostrEvent = {
      kind: 22242,
      content: '',
      created_at: 1700000000,
      tags: [],
      pubkey: alicePub,
      id: 'a'.repeat(64),
      sig: 'b'.repeat(128),
    };
    expect(validateResponse(['AUTH', forged]).isValid).toBe(false);
  });
});

describe('finding: event/signing verifySignature does not recompute id', () => {
  it('rejects an event whose content was swapped but id/sig kept', async () => {
    const ev = await signEvent(
      { kind: 1, content: 'original', created_at: 1700000000, tags: [], pubkey: alicePub },
      alicePriv
    );
    expect(verifySignature(ev)).toBe(true);
    const swapped: SignedNostrEvent = { ...ev, content: 'swapped-content' };
    expect(verifySignature(swapped)).toBe(false);
  });
});

describe('finding: verifyDelegation re-serializes conditions in fixed order', () => {
  it('verifies a delegation created by this lib (default ordering)', async () => {
    const del = createDelegation(alicePriv, bobPub, { kind: 1, since: 1000, until: 2000 });
    expect(del.delegator).toBe(alicePub);
    expect(await verifyDelegation(del)).toBe(true);
  });

  it('verifies a cross-impl delegation whose conditions are in a NON-default order', async () => {
    const delegatee = bobPub;
    // A different client serialized conditions as: created_at<Y & kind & created_at>X
    const conditionsString = 'created_at<2000&kind=1&created_at>1000';
    const msgHash = sha256(new TextEncoder().encode(`nostr:delegation:${delegatee}:${conditionsString}`));
    const token = bytesToHex(schnorr.sign(msgHash, hexToBytes(alicePriv)));

    const del: Delegation = {
      delegator: alicePub,
      delegatee,
      conditions: { kind: 1, since: 1000, until: 2000 },
      token,
      conditionsString,
    };

    // With the fix (hash the raw string) this verifies; the old code re-serialized
    // to the default order and would fail.
    expect(await verifyDelegation(del)).toBe(true);

    // And it survives a tag round-trip (addDelegationTag preserves the raw string).
    const tagged = addDelegationTag({ kind: 1, content: '', created_at: 1500, tags: [], pubkey: bobPub }, del);
    const extracted = extractDelegation(tagged);
    expect(extracted).not.toBeNull();
    expect(extracted!.conditionsString).toBe(conditionsString);
    expect(await verifyDelegation(extracted!)).toBe(true);
  });
});
