/**
 * @module test/nips/nip-17
 * @description Tests for NIP-17 Private Direct Messages
 */

import { describe, it, expect } from 'vitest';
import { bytesToHex, randomBytes } from '@noble/hashes/utils.js';
import { schnorr } from '@noble/curves/secp256k1.js';
import { createDirectMessage, readDirectMessage, KIND_CHAT_MESSAGE } from '../../nips/nip-17';

describe('NIP-17 Private Direct Messages', () => {
  const alicePrivBytes = randomBytes(32);
  const alicePriv = bytesToHex(alicePrivBytes);
  const alicePub = bytesToHex(schnorr.getPublicKey(alicePrivBytes));
  const bobPrivBytes = randomBytes(32);
  const bobPriv = bytesToHex(bobPrivBytes);
  const bobPub = bytesToHex(schnorr.getPublicKey(bobPrivBytes));
  const carolPrivBytes = randomBytes(32);
  const carolPriv = bytesToHex(carolPrivBytes);
  const carolPub = bytesToHex(schnorr.getPublicKey(carolPrivBytes));

  it('wraps a DM for the recipient and a self-copy for the sender', async () => {
    const wraps = await createDirectMessage(alicePriv, { content: 'hi bob', recipients: [bobPub] });
    expect(wraps.length).toBe(2);
    expect(wraps.map((w) => w.recipient).sort()).toEqual([alicePub, bobPub].sort());
  });

  it('recipient can read the kind-14 chat message', async () => {
    const wraps = await createDirectMessage(alicePriv, { content: 'hi bob', recipients: [bobPub] });
    const forBob = wraps.find((w) => w.recipient === bobPub)!;
    const rumor = await readDirectMessage(forBob.giftWrap, bobPriv);
    expect(rumor.kind).toBe(KIND_CHAT_MESSAGE);
    expect(rumor.content).toBe('hi bob');
    expect(rumor.pubkey).toBe(alicePub);
    expect(rumor.tags).toContainEqual(['p', bobPub]);
  });

  it('sender can read their own copy', async () => {
    const wraps = await createDirectMessage(alicePriv, { content: 'hi bob', recipients: [bobPub] });
    const forAlice = wraps.find((w) => w.recipient === alicePub)!;
    const rumor = await readDirectMessage(forAlice.giftWrap, alicePriv);
    expect(rumor.content).toBe('hi bob');
  });

  it('carries subject and reply tags', async () => {
    const wraps = await createDirectMessage(alicePriv, {
      content: 'reply',
      recipients: [bobPub],
      subject: 'dinner',
      replyTo: 'a'.repeat(64),
    });
    const forBob = wraps.find((w) => w.recipient === bobPub)!;
    const rumor = await readDirectMessage(forBob.giftWrap, bobPriv);
    expect(rumor.tags).toContainEqual(['subject', 'dinner']);
    expect(rumor.tags).toContainEqual(['e', 'a'.repeat(64)]);
  });

  it('supports group rooms (wrap per recipient + sender)', async () => {
    const wraps = await createDirectMessage(alicePriv, {
      content: 'hey all',
      recipients: [bobPub, carolPub],
    });
    expect(wraps.length).toBe(3);
    const forCarol = wraps.find((w) => w.recipient === carolPub)!;
    const rumor = await readDirectMessage(forCarol.giftWrap, carolPriv);
    expect(rumor.content).toBe('hey all');
    expect(rumor.tags).toContainEqual(['p', bobPub]);
    expect(rumor.tags).toContainEqual(['p', carolPub]);
  });
});
