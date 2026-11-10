/**
 * Regression tests for the 2026-11-10 external review (crypto lane).
 * Each block names the finding it pins. Keys are generated at runtime.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { bytesToHex, randomBytes, concatBytes } from '@noble/hashes/utils.js';
import { schnorr } from '@noble/curves/secp256k1.js';
import { bech32 as scureBech32 } from '@scure/base';

import * as root from '../index';
import {
  finalizeEvent,
  createEvent,
  signEvent,
  verifySignature,
  validateEvent,
  validateEventSignature,
  validateSignedEvent,
  decryptMessage,
} from '../index';
import { validateSignedEventFormat } from '../validation/index';
import * as nip01 from '../nips/nip-01';
import { verifySignature as signingVerify } from '../event/signing';
import { handleSignerRequest, connectRequest, unwrapRequest, createSession, wrapEvent as nip46Wrap } from '../nips/nip-46';
import { decode, neventEncode, naddrEncode } from '../nips/nip-19';
import * as nip49 from '../nips/nip-49';
import { createAuthEvent, validateAuthEvent } from '../nips/nip-98';
import { createDelegation, checkDelegationConditions, extractDelegation, addDelegationTag } from '../nips/nip-26';
import { createRumor, createSeal, createGiftWrap, unwrapEvent as giftUnwrap } from '../nips/nip-59';
import { getConversationKey, encrypt as nip44Encrypt, decrypt as nip44Decrypt } from '../nips/nip-44';
import type { Nip46SignerHandlers } from '../types';

function kp(): { sk: string; pk: string } {
  const sk = randomBytes(32);
  return { sk: bytesToHex(sk), pk: bytesToHex(schnorr.getPublicKey(sk)) };
}

async function signedNote(sk: string): Promise<root.SignedNostrEvent> {
  return finalizeEvent({ kind: 1, content: 'hello', tags: [] }, sk);
}

function spyConsole(): Array<ReturnType<typeof vi.spyOn>> {
  return (['log', 'info', 'warn', 'error', 'debug'] as const).map((m) =>
    vi.spyOn(console, m).mockImplementation(() => {}),
  );
}

afterEach(() => {
  vi.restoreAllMocks();
  root.setLogLevel(undefined);
});

// ─── Finding 1: NIP-46 open connect ───────────────────────────────────────
describe('review#1 NIP-46 connect is fail-closed', () => {
  const signer = kp();
  const client = kp();
  const handlers: Nip46SignerHandlers = {
    getPublicKey: () => signer.pk,
    signEvent: (e: string) => e,
  };

  it('refuses connect with no secret, no approval callback, no opt-in', async () => {
    const r = await handleSignerRequest(connectRequest(signer.pk), client.pk, handlers, {
      authenticatedClients: new Set(),
    });
    expect(r.newlyAuthenticated).toBeUndefined();
    expect(r.response.error).toMatch(/unauthorized/);
  });

  it('allowOpenConnect: true restores the old open behaviour', async () => {
    const r = await handleSignerRequest(connectRequest(signer.pk), client.pk, handlers, { allowOpenConnect: true });
    expect(r.response.result).toBe('ack');
    expect(r.newlyAuthenticated).toBe(client.pk);
  });

  it('onConnect approval callback decides', async () => {
    const yes = await handleSignerRequest(connectRequest(signer.pk), client.pk, handlers, {
      onConnect: (pk) => pk === client.pk,
    });
    expect(yes.newlyAuthenticated).toBe(client.pk);
    const no = await handleSignerRequest(connectRequest(signer.pk), client.pk, handlers, {
      onConnect: async () => false,
    });
    expect(no.newlyAuthenticated).toBeUndefined();
  });

  it('one-time secrets: a used secret is refused and a fresh one is reported as consumed', async () => {
    const ok = await handleSignerRequest(connectRequest(signer.pk, 's1'), client.pk, handlers, {
      secret: 's1',
      usedSecrets: new Set(),
    });
    expect(ok.response.result).toBe('ack');
    expect(ok.consumedSecret).toBe('s1');
    const replay = await handleSignerRequest(connectRequest(signer.pk, 's1'), client.pk, handlers, {
      secret: 's1',
      usedSecrets: new Set(['s1']),
    });
    expect(replay.newlyAuthenticated).toBeUndefined();
  });

  it('rejects a connect addressed to another signer when signerPubkey is set', async () => {
    const other = kp();
    const r = await handleSignerRequest(connectRequest(other.pk, 's'), client.pk, handlers, {
      secret: 's',
      signerPubkey: signer.pk,
    });
    expect(r.newlyAuthenticated).toBeUndefined();
  });

  it('unwrapRequest rejects a replayed request when seenIds is supplied', async () => {
    const session = createSession(signer.pk);
    const ev = await nip46Wrap(connectRequest(signer.pk, 's'), session, signer.pk);
    const seen = new Set<string>();
    unwrapRequest(ev, signer.sk, { seenIds: seen });
    expect(() => unwrapRequest(ev, signer.sk, { seenIds: seen })).toThrow(/replay/);
  });

  it('unwrapRequest maxAgeSeconds rejects stale requests', async () => {
    const session = createSession(signer.pk);
    const ev = await nip46Wrap(connectRequest(signer.pk, 's'), session, signer.pk);
    expect(() => unwrapRequest(ev, signer.sk, { maxAgeSeconds: 30, now: ev.created_at + 120 })).toThrow(/window/);
    expect(unwrapRequest(ev, signer.sk, { maxAgeSeconds: 30, now: ev.created_at + 5 }).request.method).toBe('connect');
  });
});

// ─── Finding 2: non-canonical sig accepted by validateEvent ────────────────
describe('review#2 strict lowercase hex in validators', () => {
  it('rejects a sig with a space-padded hex pair', async () => {
    const { sk } = kp();
    const ev = await signedNote(sk);
    // find a "0X" pair and replace it by " X" — parseInt(" X",16) === parseInt("0X",16)
    let idx = -1;
    for (let i = 0; i < ev.sig.length; i += 2) if (ev.sig[i] === '0') { idx = i; break; }
    if (idx === -1) return; // astronomically unlikely
    const bad = { ...ev, sig: ev.sig.slice(0, idx) + ' ' + ev.sig.slice(idx + 1) };
    expect(validateEvent(bad).isValid).toBe(false);
    expect(validateEventSignature(bad).isValid).toBe(false);
  });

  it('rejects an uppercase sig / id', async () => {
    const { sk } = kp();
    const ev = await signedNote(sk);
    expect(validateEvent({ ...ev, sig: ev.sig.toUpperCase() }).isValid).toBe(false);
    expect(validateEvent({ ...ev, id: ev.id.toUpperCase() }).isValid).toBe(false);
    expect(validateEvent(ev).isValid).toBe(true);
  });
});

// ─── Finding 3: validateSignedEvent must verify ────────────────────────────
describe('review#3 validateSignedEvent verifies the signature', () => {
  it('rejects a well-formed but forged sig; the format-only check is explicit', async () => {
    const { sk } = kp();
    const ev = await signedNote(sk);
    const forged = { ...ev, sig: 'f'.repeat(128) };
    expect(validateSignedEvent(forged).isValid).toBe(false);
    expect(validateSignedEvent(ev).isValid).toBe(true);
    expect(validateSignedEventFormat(forged).isValid).toBe(true);
  });
});

// ─── Findings 5 + 6: no import-time crypto probe, no global type augmentation ─
describe('review#5/#6 no module-load crypto probe, no global Window retype', () => {
  function walk(dir: string): string[] {
    return readdirSync(dir).flatMap((f) => {
      const p = join(dir, f);
      if (f === '__tests__') return [];
      return statSync(p).isDirectory() ? walk(p) : [p];
    });
  }
  const srcFiles = walk(join(__dirname, '..')).filter((f) => f.endsWith('.ts'));

  it('no source file dynamically imports a node builtin or declares globals', () => {
    for (const f of srcFiles) {
      const s = readFileSync(f, 'utf8');
      expect(s, f).not.toMatch(/import\(\s*['"](node:)?crypto['"]\s*\)/);
      expect(s, f).not.toMatch(/declare\s+global/);
    }
  });

  it('customCrypto is gone', async () => {
    const mod = await import('../crypto');
    expect('customCrypto' in mod).toBe(false);
  });
});

// ─── Finding 7: NIP-19 edge cases ─────────────────────────────────────────
describe('review#7 NIP-19 edge cases', () => {
  it('nevent/nprofile without TLV 0 is rejected', () => {
    expect(() => decode('nevent1qy28wumn8ghj7un9d3shjtnyv9kh2uewd9hs3jr8mv')).toThrow();
  });

  it('naddr accepts an empty identifier and round-trips', () => {
    const { pk } = kp();
    const s = naddrEncode(pk, 10002, '');
    const d = decode(s);
    expect(d.type).toBe('naddr');
    expect(d.identifier).toBe('');
    expect(d.kind).toBe(10002);
    expect(d.author).toBe(pk);
  });

  it('kind must be a uint32', () => {
    const { pk } = kp();
    expect(() => neventEncode(pk, undefined, undefined, -1)).toThrow();
    expect(() => neventEncode(pk, undefined, undefined, 2 ** 32)).toThrow();
    expect(() => naddrEncode(pk, -1, 'x')).toThrow();
    expect(() => naddrEncode(pk, 2 ** 32, 'x')).toThrow();
  });

  it('KIND TLV of the wrong length throws a clean error', () => {
    const { pk } = kp();
    const bytes = [0, 32, ...Buffer.from(pk, 'hex'), 3, 2, 0, 1];
    const s = scureBech32.encode('nevent', scureBech32.toWords(Uint8Array.from(bytes)), 1000);
    expect(() => decode(s)).toThrow(/kind/i);
  });

  it('non-ws relay hints are skipped, not fatal', () => {
    const { pk } = kp();
    const relay = Buffer.from('https://example.com');
    const bytes = [0, 32, ...Buffer.from(pk, 'hex'), 1, relay.length, ...relay];
    const s = scureBech32.encode('nprofile', scureBech32.toWords(Uint8Array.from(bytes)), 1000);
    const d = decode(s);
    expect(d.data).toBe(pk);
    expect(d.relays).toEqual([]);
  });

  it('decode(non-string) throws a clean Error', () => {
    expect(() => decode(undefined as unknown as string)).toThrow('Invalid bech32 string');
  });
});

// ─── Finding 8: NIP-49 log_n cap + lengths ─────────────────────────────────
describe('review#8 NIP-49 bounds', () => {
  function ncryptsecWithLogN(logn: number): string {
    const payload = concatBytes(
      Uint8Array.from([0x02, logn]),
      new Uint8Array(16),
      new Uint8Array(24),
      Uint8Array.from([0x02]),
      new Uint8Array(48),
    );
    return scureBech32.encode('ncryptsec', scureBech32.toWords(payload), 200);
  }

  it('refuses a log_n above the default cap before running scrypt', () => {
    const t = Date.now();
    expect(() => nip49.decrypt(ncryptsecWithLogN(19), 'pw')).toThrow(/log_n/);
    expect(Date.now() - t).toBeLessThan(500);
  });

  it('maxLogN option is honoured', () => {
    expect(() => nip49.decrypt(ncryptsecWithLogN(12), 'pw', { maxLogN: 10 })).toThrow(/log_n/);
  });

  it('rejects a payload of the wrong length', () => {
    const payload = Uint8Array.from([0x02, 1, ...new Uint8Array(60)]);
    const s = scureBech32.encode('ncryptsec', scureBech32.toWords(payload), 200);
    expect(() => nip49.decrypt(s, 'pw')).toThrow(/length/);
  });

  it('encrypt requires a 32-byte key and a sane log_n', () => {
    expect(() => nip49.encrypt(new Uint8Array(31), 'pw', 1)).toThrow(/32/);
    expect(() => nip49.encrypt(new Uint8Array(32), 'pw', 64)).toThrow(/log_n/);
  });
});

// ─── Finding 9 + consumer report: silent by default, strict verifySignature ─
describe('review#9 logging is silent by default; verifySignature is strict', () => {
  // Spy on console FIRST, then load a fresh copy of the module graph, so a logger
  // that captures console methods at import time is still observed.
  async function freshRoot(): Promise<typeof root> {
    vi.resetModules();
    return (await import('../index')) as typeof root;
  }

  it('verifySignature on an id mismatch returns false and prints nothing', async () => {
    const spies = spyConsole();
    const m = await freshRoot();
    const { sk } = kp();
    const ev = await m.finalizeEvent({ kind: 1, content: 'hello', tags: [] }, sk);
    expect(await m.verifySignature({ ...ev, content: 'tampered' })).toBe(false);
    expect(await m.verifySignature({ ...ev, sig: 'zz' })).toBe(false);
    for (const s of spies) expect(s).not.toHaveBeenCalled();
  });

  it('verifySignature rejects uppercase hex (all three verifiers)', async () => {
    const { sk } = kp();
    const ev = await signedNote(sk);
    const up = { ...ev, sig: ev.sig.toUpperCase() };
    expect(await verifySignature(up)).toBe(false);
    expect(nip01.verifySignature(up)).toBe(false);
    expect(signingVerify(up)).toBe(false);
    const upPk = { ...ev, pubkey: ev.pubkey.toUpperCase() };
    expect(await verifySignature(upPk)).toBe(false);
    expect(await verifySignature(ev)).toBe(true);
  });

  it('invalid ciphertext does not log by default', async () => {
    const spies = spyConsole();
    const m = await freshRoot();
    const a = kp();
    const b = kp();
    expect(() => m.decryptMessage('garbage', a.sk as never, b.pk as never)).toThrow();
    for (const s of spies) expect(s).not.toHaveBeenCalled();
  });

  it('setLogLevel opts in to output', async () => {
    const spies = spyConsole();
    root.setLogLevel('debug');
    expect(root.getLogLevel()).toBe('debug');
    const a = kp();
    const b = kp();
    expect(() => decryptMessage('garbage', a.sk as never, b.pk as never)).toThrow();
    expect(spies.some((s) => s.mock.calls.length > 0)).toBe(true);
  });
});

// ─── Finding 10: NIP-98 payload + replay ──────────────────────────────────
describe('review#10 NIP-98 requires payload when a body is present', () => {
  const url = 'https://api.example.com/x';
  it('a token without payload tag does not authorize a non-empty body by default', async () => {
    const { sk } = kp();
    const ev = await createAuthEvent({ url, method: 'POST' }, sk);
    expect((await validateAuthEvent(ev, { url, method: 'POST', body: '{"a":1}' })).valid).toBe(false);
    expect((await validateAuthEvent(ev, { url, method: 'POST', body: '{"a":1}', requirePayload: false })).valid).toBe(true);
    expect((await validateAuthEvent(ev, { url, method: 'POST', body: '' })).valid).toBe(true);
  });

  it('seenIds rejects a replayed token', async () => {
    const { sk } = kp();
    const ev = await createAuthEvent({ url, method: 'GET' }, sk);
    const seen = new Set<string>();
    expect((await validateAuthEvent(ev, { url, method: 'GET', seenIds: seen })).valid).toBe(true);
    const again = await validateAuthEvent(ev, { url, method: 'GET', seenIds: seen });
    expect(again.valid).toBe(false);
    expect(again.reason).toMatch(/replay/);
  });
});

// ─── Finding 11: NIP-26 strictness ────────────────────────────────────────
describe('review#11 NIP-26 conditions', () => {
  const base = { pubkey: 'a'.repeat(64), tags: [], content: '' };
  it('created_at bounds are strict', () => {
    expect(checkDelegationConditions({ ...base, kind: 1, created_at: 100 }, { since: 100 })).toBe(false);
    expect(checkDelegationConditions({ ...base, kind: 1, created_at: 101 }, { since: 100 })).toBe(true);
    expect(checkDelegationConditions({ ...base, kind: 1, created_at: 200 }, { until: 200 })).toBe(false);
  });

  it('multiple kind= conditions form a set; unknown conditions fail closed', async () => {
    const delegator = kp();
    const delegatee = kp();
    const ev = { ...base, pubkey: delegatee.pk, kind: 1, created_at: 150 };
    const multi = addDelegationTag(ev, {
      delegator: delegator.pk, delegatee: delegatee.pk, conditions: {}, token: '0'.repeat(128),
      conditionsString: 'kind=1&kind=7&created_at>100',
    });
    const d = extractDelegation(multi)!;
    expect(checkDelegationConditions(ev, d.conditions)).toBe(true);
    expect(checkDelegationConditions({ ...ev, kind: 7 }, d.conditions)).toBe(true);
    expect(checkDelegationConditions({ ...ev, kind: 3 }, d.conditions)).toBe(false);

    const junk = addDelegationTag(ev, {
      delegator: delegator.pk, delegatee: delegatee.pk, conditions: {}, token: '0'.repeat(128),
      conditionsString: 'kind=1&foo=bar',
    });
    expect(extractDelegation(junk)).toBeNull();
    const nan = addDelegationTag(ev, {
      delegator: delegator.pk, delegatee: delegatee.pk, conditions: {}, token: '0'.repeat(128),
      conditionsString: 'kind=abc',
    });
    expect(extractDelegation(nan)).toBeNull();
    // createDelegation still round-trips
    const del = createDelegation(delegator.sk, delegatee.pk, { kind: 1, since: 100, until: 300 });
    expect(del.conditionsString).toBe('kind=1&created_at>100&created_at<300');
  });
});

// ─── Finding 12: minor correctness ────────────────────────────────────────
describe('review#12 minor correctness', () => {
  it('created_at: 0 is preserved', async () => {
    const { sk } = kp();
    expect(createEvent({ created_at: 0 }).created_at).toBe(0);
    expect((await finalizeEvent({ kind: 1, content: '', created_at: 0 }, sk)).created_at).toBe(0);
  });

  it('signEvent refuses a pubkey that does not match the key', async () => {
    const a = kp();
    const b = kp();
    await expect(
      signEvent({ kind: 1, content: '', tags: [], created_at: 1, pubkey: b.pk }, a.sk),
    ).rejects.toThrow(/pubkey/);
  });

  it('NIP-59 unwrap rejects a rumor whose id is not its hash', async () => {
    const sender = kp();
    const recipient = kp();
    const rumor = await createRumor({ kind: 14, content: 'hi' }, sender.pk);
    const forged = { ...rumor, id: '0'.repeat(64) };
    const wrap = await createGiftWrap(await createSeal(forged, sender.sk, recipient.pk), recipient.pk);
    await expect(giftUnwrap(wrap, recipient.sk)).rejects.toThrow(/id/);
    const good = await createGiftWrap(await createSeal(rumor, sender.sk, recipient.pk), recipient.pk);
    expect((await giftUnwrap(good, recipient.sk)).content).toBe('hi');
  });

  it('NIP-44 decrypt rejects the # prefix and out-of-range base64 lengths up front', () => {
    const a = kp();
    const b = kp();
    const ck = getConversationKey(Buffer.from(a.sk, 'hex'), b.pk);
    const ct = nip44Encrypt('x', ck);
    expect(nip44Decrypt(ct, ck)).toBe('x');
    expect(() => nip44Decrypt('#' + ct.slice(1), ck)).toThrow(/version/);
    expect(() => nip44Decrypt('A'.repeat(100), ck)).toThrow(/payload/);
  });
});

// ─── Finding 13: documented API exists ─────────────────────────────────────
describe('review#13 docs-facing API', () => {
  it('logging controls are exported from the root', () => {
    expect(typeof root.setLogLevel).toBe('function');
    expect(typeof root.getLogLevel).toBe('function');
  });
});

// ─── Checker follow-ups (2026-11-10) ──────────────────────────────────────
describe('checker#1 NIP-46 unwrap rejects non-canonical pubkey (replay-cache dodge)', () => {
  it('uppercased event.pubkey cannot slip past seenIds', async () => {
    const signer = kp();
    const session = createSession(signer.pk);
    const ev = await nip46Wrap(connectRequest(signer.pk, 's'), session, signer.pk);
    const seen = new Set<string>();
    unwrapRequest(ev, signer.sk, { seenIds: seen });
    expect(() => unwrapRequest({ ...ev, pubkey: ev.pubkey.toUpperCase() }, signer.sk, { seenIds: seen })).toThrow(/pubkey/);
    expect(() => unwrapRequest({ ...ev, pubkey: ev.pubkey.toUpperCase() }, signer.sk)).toThrow(/pubkey/);
  });
});

describe('checker#2 nip01.signEvent enforces the pubkey/key binding', () => {
  it('throws on mismatch, fills when missing', async () => {
    const a = kp();
    const b = kp();
    const base = { kind: 1, content: '', tags: [] as string[][], created_at: 1 };
    await expect(nip01.signEvent({ ...base, pubkey: b.pk }, a.sk)).rejects.toThrow(/pubkey/);
    const filled = await nip01.signEvent({ ...base, pubkey: '' }, a.sk);
    expect(filled.pubkey).toBe(a.pk);
    expect(nip01.verifySignature(filled)).toBe(true);
  });
});

describe('checker#3 validators require a strict hex string pubkey', () => {
  it('rejects pubkey given as { hex } object', async () => {
    const { sk } = kp();
    const ev = await signedNote(sk);
    const obj = { ...ev, pubkey: { hex: ev.pubkey } } as unknown as root.SignedNostrEvent;
    expect(validateEvent(obj).isValid).toBe(false);
    expect(validateSignedEvent(obj).isValid).toBe(false);
  });
});

describe('checker#4 nip01 structure-only validator has an honest name', () => {
  it('validateEventStructure exists and is the same check as nip01.validateEvent', () => {
    expect(typeof (nip01 as Record<string, unknown>).validateEventStructure).toBe('function');
    expect((nip01 as Record<string, unknown>).validateEventStructure).toBe(nip01.validateEvent);
  });
});

describe('checker#5 handleSignerRequest tolerates malformed params', () => {
  const signer = kp();
  const handlers: Nip46SignerHandlers = { getPublicKey: () => signer.pk, signEvent: (e: string) => e };
  for (const params of [null, undefined, 'abc', 5, {}]) {
    it(`params=${JSON.stringify(params)} gives an error response, not a throw`, async () => {
      const req = { id: 'x', method: 'connect', params } as unknown as Parameters<typeof handleSignerRequest>[0];
      const r = await handleSignerRequest(req, signer.pk, handlers, { allowOpenConnect: true });
      expect(r.response.error).toMatch(/invalid params/);
      expect(r.newlyAuthenticated).toBeUndefined();
    });
  }
});
