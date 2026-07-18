/**
 * @module test/kat-vectors
 * @description Cross-implementation KNOWN-ANSWER-TEST assertions.
 *
 * These tests assert against the shared, language-neutral vector spine
 * (test/vectors/nostr-vectors.json — copied here from nostr-nsec-seedphrase),
 * NOT just self-consistent round-trips. A symmetric encode/decode bug (e.g. the
 * old naddr TLV layout, or a wrong HKDF info that both encrypt and decrypt share)
 * round-trips cleanly but FAILS these vectors, which come from an independent
 * source (nostr-protocol/nips, nostr-tools, BIP-340).
 */

import { describe, it, expect } from 'vitest';
import { hexToBytes, bytesToHex } from '@noble/hashes/utils.js';
import { schnorr } from '@noble/curves/secp256k1.js';
import vectors from './vectors/nostr-vectors.json';

import { getConversationKey, encrypt as nip44Encrypt, decrypt as nip44Decrypt, calcPaddedLen } from '../nips/nip-44';
import { decrypt as nip49Decrypt } from '../nips/nip-49';
import { naddrEncode, nprofileEncode, neventEncode, decode } from '../nips/nip-19';
import { encryptMessage, decryptMessage, asPrivateKey, asPublicKey } from '../nips/nip-04';

describe('KAT: NIP-44 v2 (official vectors)', () => {
  const v = vectors.nip44;

  it('get_conversation_key matches the official vectors', () => {
    for (const row of v.get_conversation_key) {
      const got = bytesToHex(getConversationKey(hexToBytes(row.sec1), row.pub2));
      expect(got).toBe(row.conversation_key);
    }
  });

  it('encrypt(plaintext, key, fixed-nonce) reproduces the exact official payload', () => {
    for (const row of v.encrypt_decrypt) {
      const ck = hexToBytes(row.conversation_key);
      const payload = nip44Encrypt(row.plaintext, ck, hexToBytes(row.nonce));
      expect(payload).toBe(row.payload);
    }
  });

  it('decrypt(payload, key) recovers the official plaintext', () => {
    for (const row of v.encrypt_decrypt) {
      const ck = hexToBytes(row.conversation_key);
      expect(nip44Decrypt(row.payload, ck)).toBe(row.plaintext);
    }
  });

  it('calc_padded_len matches the official padding table', () => {
    for (const [len, padded] of v.calc_padded_len) {
      expect(calcPaddedLen(len)).toBe(padded);
    }
  });
});

describe('KAT: NIP-49 (ncryptsec spec reference vector)', () => {
  it('decrypts the official ncryptsec to the expected secret key', () => {
    const v = vectors.nip49;
    const sk = bytesToHex(nip49Decrypt(v.ncryptsec, v.password));
    expect(sk).toBe(v.privateKey);
  });
});

describe('KAT: NIP-19 TLV (cross-checked vs nostr-tools)', () => {
  const v = vectors.nip19_tlv;

  it('naddr encodes to the canonical string (byte-for-byte)', () => {
    const n = v.naddr;
    expect(naddrEncode(n.pubkey, n.kind, n.identifier, n.relays)).toBe(n.encoded);
    const noRelays = v.naddr_no_relays;
    expect(naddrEncode(noRelays.pubkey, noRelays.kind, noRelays.identifier)).toBe(noRelays.encoded);
  });

  it('naddr decodes a real (nostr-tools) address to the right components', () => {
    const n = v.naddr;
    const d = decode(n.encoded);
    expect(d.type).toBe('naddr');
    expect(d.identifier).toBe(n.identifier);
    expect(d.author).toBe(n.pubkey);
    expect(d.kind).toBe(n.kind);
    expect(d.relays).toEqual(n.relays);
  });

  it('nprofile encodes and decodes to the canonical string', () => {
    const p = v.nprofile;
    expect(nprofileEncode(p.pubkey, p.relays)).toBe(p.encoded);
    const d = decode(p.encoded);
    expect(d.data).toBe(p.pubkey);
    expect(d.relays).toEqual(p.relays);
  });

  it('nevent encodes and decodes to the canonical string', () => {
    const e = v.nevent;
    expect(neventEncode(e.id, e.relays, e.author, e.kind)).toBe(e.encoded);
    const d = decode(e.encoded);
    expect(d.data).toBe(e.id);
    expect(d.author).toBe(e.author);
    expect(d.kind).toBe(e.kind);
    expect(d.relays).toEqual(e.relays);
  });
});

describe('KAT: BIP-340 schnorr (deterministic, aux = zeros)', () => {
  const v = vectors.bip340;

  it('derives the expected x-only pubkey', () => {
    expect(bytesToHex(schnorr.getPublicKey(hexToBytes(v.privateKey)))).toBe(v.xonlyPubkey);
  });

  it('signs to the exact official signature with zero aux', () => {
    const sig = schnorr.sign(hexToBytes(v.message), hexToBytes(v.privateKey), hexToBytes(v.auxRand));
    expect(bytesToHex(sig)).toBe(v.signature);
  });

  it('verifies the official signature', () => {
    expect(schnorr.verify(hexToBytes(v.signature), hexToBytes(v.message), hexToBytes(v.xonlyPubkey))).toBe(true);
  });
});

describe('KAT: canonical NIP-04 with a real x-only Nostr pubkey', () => {
  // These keypairs are the shared-spine BIP-340 keypairs (x-only pubkeys).
  const alicePriv = vectors.keypairs.alice.privateKey;
  const bobPriv = vectors.keypairs.bob.privateKey;
  const alicePub = vectors.keypairs.alice.xonlyPubkey;
  const bobPub = vectors.keypairs.bob.xonlyPubkey;

  it('encryptMessage/decryptMessage round-trip without throwing on x-only keys', () => {
    const msg = 'canonical NIP-04 with a real 32-byte x-only pubkey';
    const ct = encryptMessage(msg, asPrivateKey(alicePriv), asPublicKey(bobPub));
    const pt = decryptMessage(ct, asPrivateKey(bobPriv), asPublicKey(alicePub));
    expect(pt).toBe(msg);
  });
});
