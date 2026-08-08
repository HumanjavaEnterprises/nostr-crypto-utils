/**
 * @module test/entropy
 * @description Entropy-assurance tests for the crypto kernel.
 *
 * Purpose: prove that private-key material is sourced from the platform CSPRNG
 * (`crypto.getRandomValues`, via `@noble/hashes`' `randomBytes`) and from nowhere
 * else, and that key generation fails closed if that CSPRNG is unavailable.
 *
 * These tests guard against a specific failure shape: a symbol collision or build
 * error silently binding key generation to a deterministic fallback. There must be
 * exactly ONE reachable `randomBytes` implementation in the package, and it must be
 * the fail-closed noble one.
 *
 * NOTE ON SCOPE: the statistical checks below catch a *catastrophic* downgrade
 * (a counter, a stuck/constant source, a linear-congruential generator) — they do
 * NOT and cannot prove cryptographic randomness. Passing them is necessary, not
 * sufficient. (This is 808bits' point: statistics can reject a broken RNG but never
 * certify a good one.)
 */

import { describe, it, expect, afterEach } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateKeyPair } from '../index';

const HEX64 = /^[0-9a-f]{64}$/;

/** Temporarily remove `crypto.getRandomValues` so noble's fail-closed guard fires. */
function withoutGetRandomValues<T>(fn: () => Promise<T>): Promise<T> {
  const owned = Object.getOwnPropertyDescriptor(globalThis.crypto, 'getRandomValues');
  Object.defineProperty(globalThis.crypto, 'getRandomValues', {
    value: undefined,
    configurable: true,
    writable: true,
  });
  const restore = () => {
    if (owned) {
      Object.defineProperty(globalThis.crypto, 'getRandomValues', owned);
    } else {
      // Was inherited from the prototype; drop our shadowing own-prop.
      delete (globalThis.crypto as unknown as Record<string, unknown>).getRandomValues;
    }
  };
  return fn().finally(restore);
}

describe('entropy assurance', () => {
  afterEach(() => {
    // Any spy installed in a test is restored by the test itself; nothing global here.
  });

  it('draws 32 bytes from crypto.getRandomValues and returns a 64-hex private key', async () => {
    const original = globalThis.crypto.getRandomValues.bind(globalThis.crypto);
    const draws: number[] = [];
    // Pass-through spy: record every draw length, keep real entropy flowing.
    globalThis.crypto.getRandomValues = ((arr: ArrayBufferView) => {
      draws.push(arr.byteLength);
      return original(arr as never);
    }) as typeof globalThis.crypto.getRandomValues;

    try {
      const keyPair = await generateKeyPair();
      expect(keyPair.privateKey).toMatch(HEX64);
      // getRandomValues was actually consulted, and at least one draw was 32 bytes.
      expect(draws.length).toBeGreaterThan(0);
      expect(draws).toContain(32);
    } finally {
      globalThis.crypto.getRandomValues = original;
    }
  });

  it('fails closed: rejects when crypto.getRandomValues is unavailable', async () => {
    await expect(
      withoutGetRandomValues(() => generateKeyPair()),
    ).rejects.toThrow(/getRandomValues/);

    // And recovers immediately once the CSPRNG is restored.
    const after = await generateKeyPair();
    expect(after.privateKey).toMatch(HEX64);
  });

  it('statistical smoke over 1000 keys: distinct, no constant byte position, non-degenerate histogram', async () => {
    const N = 1000;
    const keys: string[] = [];
    const rows: Uint8Array[] = [];
    for (let i = 0; i < N; i++) {
      const { privateKey } = await generateKeyPair();
      expect(privateKey).toMatch(HEX64);
      keys.push(privateKey);
      const bytes = new Uint8Array(32);
      for (let b = 0; b < 32; b++) {
        bytes[b] = parseInt(privateKey.slice(b * 2, b * 2 + 2), 16);
      }
      rows.push(bytes);
    }

    // (1) All keys distinct — a counter that repeats or a stuck source collapses this.
    expect(new Set(keys).size).toBe(N);

    // (2) No byte position is constant across the sample — catches stuck/high-byte-zero
    //     counters and LCG tails where most positions never move.
    for (let pos = 0; pos < 32; pos++) {
      const distinctAtPos = new Set(rows.map((r) => r[pos])).size;
      expect(distinctAtPos).toBeGreaterThan(1);
    }

    // (3) Histogram not degenerate: across 32*N = 32000 bytes we expect nearly the
    //     full 0..255 alphabet. A degenerate source paints far fewer symbols.
    const seen = new Set<number>();
    for (const r of rows) for (const v of r) seen.add(v);
    expect(seen.size).toBeGreaterThanOrEqual(200);
  });

  it('meta-guard: no second `export function randomBytes` exists anywhere in src/', () => {
    // Anti-regression for the name collision itself. The only reachable randomBytes
    // must be @noble/hashes' (in node_modules); src/ must define zero.
    const srcRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
    const pattern = /export\s+function\s+randomBytes\b/;
    const offenders: string[] = [];

    const walk = (dir: string): void => {
      for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) {
          if (entry === 'node_modules') continue;
          walk(full);
          continue;
        }
        if (!/\.(ts|tsx|js|mjs|cjs)$/.test(entry)) continue;
        if (full === fileURLToPath(import.meta.url)) continue; // never flag this file
        if (pattern.test(readFileSync(full, 'utf8'))) offenders.push(full);
      }
    };

    walk(srcRoot);
    expect(offenders).toEqual([]);
  });
});
