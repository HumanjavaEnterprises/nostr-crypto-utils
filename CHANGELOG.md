# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.10.0] - 2026-11-10

Fixes from the 2026-11-10 external review. The core crypto is unchanged and still
passes the official vectors (NIP-44 v2 122/122, NIP-01, NIP-19, NIP-04, NIP-49,
NIP-26). Minor bump because of the behaviour changes under **Breaking**.

### Breaking
- **NIP-46 `handleSignerRequest`: `connect` is fail-closed.** With no `secret` it
  used to authenticate ANY client. It now needs a matching `secret`, an
  `onConnect(clientPubkey, params)` callback that returns `true`, or the explicit
  opt-in `allowOpenConnect: true` (old behaviour; `allowUnauthenticated: true`
  also still implies it).
- **`validateSignedEvent` now verifies the id and signature** (it is the same as
  `validateEvent`). The old format-only check is `validateSignedEventFormat`.
- **Strict canonical hex.** `verifySignature` (root, `nip01`, `event/signing`),
  `validateEvent` / `validateSignedEvent` and `validateEventBase` (when
  `id`/`sig` are present) reject uppercase, padded or wrong-length `id` /
  `pubkey` / `sig`; `validateEventId` checks the `id`, `validateEventSignature`
  the `sig` and `pubkey` (it recomputes the hash and does not look at `id`).
  A space-padded `sig` used to pass `validateEvent`. `validateEvent` /
  `validateSignedEvent` also reject a non-string pubkey such as `{ hex }`.
- **Logging is silent by default.** Library logs are no longer written at
  `info`/`error` level; invalid input logs at `debug` only. Opt in with
  `setLogLevel(level)` or env `NOSTR_CRYPTO_UTILS_LOG_LEVEL` (read lazily). The
  generic `LOG_LEVEL` env var is no longer read.
- **NIP-49 `decrypt` caps `log_n` at 18 by default** (256 MiB of scrypt); pass
  `{ maxLogN }` to open stronger keys. `decrypt` also checks the payload is 91
  bytes; `encrypt` requires a 32-byte key and `0 <= logn <= 22`.
- **NIP-98 `validateAuthEvent`: `requirePayload` defaults to `true` when the body
  is non-empty.** Pass `requirePayload: false` for the old behaviour.
- **`signEvent`, `nip01.signEvent` and `finalizeEvent` throw when `event.pubkey`
  is not the signing key's pubkey** (they used to return an unverifiable event).
  `signEvent` / `nip01.signEvent` fill in a missing pubkey.
- **NIP-46 `unwrapRequest` / `unwrapEvent` throw on a non-canonical (e.g.
  uppercase) `event.pubkey`**, which could otherwise dodge the `seenIds` cache.
- **`nip01.validateEvent` is now a deprecated alias of
  `nip01.validateEventStructure`** (same structure-only check; it never verified
  the signature, unlike the root `validateEvent`).
- **NIP-26:** `created_at>` / `created_at<` are strict; repeated `kind=` clauses
  form a set (`conditions.kinds`); unknown or non-numeric clauses make
  `extractDelegation` return `null`.
- **NIP-19 decode:** nevent/nprofile without TLV 0 throws; a KIND TLV that is not
  4 bytes throws; non-ws(s) relay hints are skipped instead of throwing.
  Encoders reject kinds outside `0..2^32-1`.
- **Removed `customCrypto` / `CryptoSubtle`** and the global `Window`/`Global`
  type augmentation from `crypto.ts` (unused internally; never a root export).
- **`engines.node` is now `>=20`.**

### Fixed
- Importing the package is side-effect-free: no module-load WebCrypto probe, no
  `import('crypto')`, no unhandled rejection on Workers without `nodejs_compat`.
- Published `.d.ts` no longer retypes `window.crypto` (broke consumers with
  `skipLibCheck: false`).
- `naddrEncode` accepts an empty identifier (plain replaceable kinds).
- `createEvent` / `finalizeEvent` keep `created_at: 0` (used `||`).
- NIP-59 `unwrapEvent` checks the rumor id is its hash; gift-wrap timestamps use
  `randomBytes` instead of `Math.random`.
- NIP-44 `decrypt` does the spec's pre-decode checks (`#` prefix, base64 length
  132..87472).
- `decode(undefined)` throws a clean `Error`.
- NIP-46 `handleSignerRequest` returns an `invalid params` error response
  instead of throwing a TypeError when `params` is missing or not an array.

### Added
- NIP-46: `secret` compared in constant time; `usedSecrets` + `consumedSecret` for
  one-time secrets; `signerPubkey` check on connect params; `unwrapRequest` /
  `unwrapEvent` accept `{ seenIds, maxAgeSeconds, now }` replay protection.
- NIP-98: `seenIds` replay guard.
- Root exports `setLogLevel`, `getLogLevel`, `validateSignedEventFormat`, type
  `Nip46UnwrapOptions`.
- Subpaths `./nip01`, `./nip04`, `./nip19`, `./nip26`, and `./package.json`;
  `workerd` and `browser` export conditions (ESM).

### Packaging / docs
- Tarball no longer ships source maps, `src/`, `examples/` or compiled test setup.
- Dev tooling: vitest / @vitest/coverage-v8 ^4.1.12, `overrides.minimatch ^11.0.6`; `npm audit` is clean.
- README, AGENTS.md, llms.txt, SKILL.md and examples rewritten to match the real
  exports (the old README imported nine functions that do not exist, and its
  `validateEvent` example never rejected anything).
- Not changed: the NIP-19 TLV encoder order. It matches nostr-tools 2.x
  byte-for-byte (shared KAT vectors), which the review's suggested order would break.

## [0.9.2] - 2026-07-21

### Fixed

- **NIP-04 shared-secret derivation intermittently threw "second arg must be
  public key" (~1.5% of keypairs).** `deriveSharedX` detected the 32-byte x-only
  pubkey form by its leading hex byte (`startsWith('02'/'03')`), but a raw
  x-coordinate can itself begin with `0x02`/`0x03`; those keys were misread as
  already-compressed 33-byte keys, so the `02` prefix was skipped and a 32-byte
  value reached `getSharedSecret`. Now detected by length (64 hex ⇒ x-only ⇒
  prepend `02`). NIP-04 encrypt/decrypt now succeeds for 100% of valid keypairs
  (verified over 5000 random round-trips + the full `02`/`03`-leading key class).
  NIP-44 was unaffected (it already always prepends `02`).

### Tests

- NIP-59 gift-wrap test no longer asserts a 2-char plaintext isn't a substring of
  base64 ciphertext (flaky ~40%); it now decrypts and checks the round-trip.

## [0.9.1] - 2026-07-19

Reconciliation release. Unifies the two parallel lines that diverged in 2026-07:
the crypto-correctness/security build published to npm as `0.8.0`, and the git
edge-native refactor (git `0.8.0`) plus NIP-98/59/17 and agent-native docs (git
`0.9.0`). Everything ships together here. Note: npm `0.8.0` and git `0.8.0` were
different artifacts that happened to share a version number; from `0.9.1` on there
is a single line carrying both. The crypto-correctness changes below were the npm
`0.8.0` security build. **BREAKING** — see below.

### Breaking
- **Canonical NIP-04 + branded key types.** There is now a single blessed NIP-04
  implementation with one argument convention:
  - `encryptMessage(message, senderPrivkey: PrivateKey, recipientPubkey: PublicKey): string`
  - `decryptMessage(ciphertext, recipientPrivkey: PrivateKey, senderPubkey: PublicKey): string`

  New branded types `PrivateKey`/`PublicKey` with validating constructors
  `asPrivateKey(hex)`/`asPublicKey(hex)` (64-char hex / 32-byte x-only) make an
  argument-order mistake a **compile error**. `encryptMessage`/`decryptMessage`
  are now **synchronous** (return `string`, not `Promise<string>`). The legacy
  top-level `encrypt`/`decrypt` wrappers — with the historical
  `(message, recipientPubKey, senderPrivKey)` order that was the root cause of
  downstream argument-swap bugs — have been **removed**. Use the canonical
  `encryptMessage`/`decryptMessage` (from the package root or the `nip04`
  namespace). The top-level exported `PublicKey` type is now the branded key type,
  not the former `{ hex; bytes? }` object interface.
- **NIP-46 signer dispatcher is now FAIL-CLOSED.** Privileged methods
  (`get_public_key`, `sign_event`, `nip04/nip44_*`, `get_relays`) are denied
  unless `authenticatedClients` is provided **and** contains the client's pubkey.
  Omitting the set no longer serves privileged methods; set the new
  `allowUnauthenticated: true` option to opt into the old no-gating behavior.
- **NIP-19 `naddr` TLV layout corrected** to the NIP-19 spec: `SPECIAL(0)` = UTF-8
  d-tag identifier, `AUTHOR(2)` = 32-byte pubkey, `KIND(3)` = uint32 BE,
  `RELAY(1)` = relays (no TLV type 4). Previous output put the pubkey in SPECIAL
  and the identifier in an undefined type-4, producing addresses no other client
  could read. Encode output is now byte-for-byte identical to nostr-tools; decode
  reads spec-compliant `naddr`s (which previously threw).

### Fixed
- **`validateEventBase` accepts legal `kind 0` and empty-string content.** Kind and
  content are validated with explicit type checks
  (`typeof kind === 'number' && Number.isInteger(kind) && kind >= 0`;
  `typeof content === 'string'`) instead of truthiness, so metadata (kind-0) events
  and events with empty content are no longer rejected. Non-integer kinds are now
  also rejected.
- **NIP-04 ECDH accepts real Nostr keys.** The canonical `encryptMessage`/
  `decryptMessage` accept 32-byte x-only pubkeys (prepends `02`) instead of passing
  a bare 32-byte value to `getSharedSecret` (which threw for every real pubkey).
- **Lint clean.** Removed a dead `asPublicKey` top-level import in `nips/nip-04.ts`
  (it is re-exported separately) and an unused `client` binding in the NIP-46
  round-trip test; `npm run lint` now reports 0 errors.
- **`kind 0` survives `finalizeEvent`/`createEvent`.** Replaced `event.kind || 1`
  with `event.kind ?? 1`, so metadata (kind-0) events are no longer silently
  emitted as kind-1 text notes.
- **`validateResponse` now verifies signatures.** `EVENT`/`AUTH` messages are
  validated with full `validateEvent` (recompute id + schnorr verify) instead of
  format-only length checks, so forged relay events are rejected.
- **NIP-26 `verifyDelegation` preserves the exact signed conditions string.**
  Delegations store the raw conditions string and hash it byte-for-byte rather
  than re-serializing parsed conditions in a fixed order, fixing verification of
  cross-implementation delegations with a different condition ordering.
- **`event/signing.ts` `verifySignature` recomputes the event id** before schnorr
  verification, rejecting events whose content/tags were swapped while keeping a
  valid `(id, sig)` pair.

### Added
- **Shared KAT vector spine.** `test/vectors/nostr-vectors.json` (mirrored into
  `src/__tests__/vectors/`) gains official known-answer vectors: NIP-44 v2
  (conversation key / fixed-nonce payloads / padding table, from
  nostr-protocol/nips), NIP-49 (ncryptsec reference decrypt), NIP-19 TLV
  (nprofile/nevent/naddr, cross-checked against nostr-tools), and a deterministic
  BIP-340 sign/verify KAT. Tests now assert against these vectors — not just
  self-round-trips — so a symmetric encode/decode bug can no longer pass CI.

## [0.9.0] - 2026-06-07

### Added
- **NIP-98 HTTP Auth** (`nostr-crypto-utils/nip98`): `createAuthEvent`,
  `validateAuthEvent`, `toAuthHeader`/`fromAuthHeader`, `hashPayload`. Builds and
  verifies the `kind 27235` event and the `Authorization: Nostr <base64>` header.
  **No HTTP is performed** — the caller issues the request (keeps the package
  edge-native).
- **NIP-59 Gift Wrap** (`nostr-crypto-utils/nip59`): `createRumor`, `createSeal`,
  `createGiftWrap`, `wrapEvent`, `unwrapEvent`. Rumor → seal (`kind 13`) → gift
  wrap (`kind 1059`, or ephemeral `kind 21059`) over NIP-44. Unwrap verifies the
  seal signature and enforces the seal-author = rumor-author binding.
- **NIP-17 Private Direct Messages** (`nostr-crypto-utils/nip17`):
  `createChatRumor`, `createDirectMessage` (wraps per recipient + a sender
  self-copy), `readDirectMessage`. Builds `kind 14` chat rumors on the 44+59 stack.
- Subpath exports `./nip59`, `./nip17`, `./nip98`; browser IIFE bundles for each.

### Changed
- **NIP-04** and **NIP-26** are marked `@deprecated` to match upstream
  (`unrecommended`). They remain functional for legacy compatibility; prefer
  NIP-17 (DMs) and NIP-46 (acting on behalf of a key) respectively.

### Notes
- 161 tests pass (was 143): +8 NIP-98, +5 NIP-59, +5 NIP-17, all round-trip
  and negative-path covered. Still 5 runtime deps, still edge-native.

## [0.8.0] - 2026-06-07

### Changed
- **Edge-native: zero non-crypto dependencies.** Runtime deps cut from 13 → 5
  (`@noble/ciphers`, `@noble/curves`, `@noble/hashes`, `@scure/base`, `bech32` —
  all audited, browser/Workers-native). The package now runs unmodified on
  Cloudflare Workers / Deno / browsers with no Node polyfills.
- **Logger no longer depends on `pino`/`pino-pretty`.** Replaced with a tiny
  zero-dependency, edge-safe logger. Public API is preserved for common usage:
  level gating via `LOG_LEVEL`, `logger.info('msg')` and `logger.error({ err }, 'msg')`
  call signatures, and `logger.child(bindings)`.
- **NIP-19 no longer uses the `buffer` polyfill.** All hex/utf8/uint32 conversions
  now use `@noble/hashes/utils` + `TextEncoder`/`TextDecoder` + `DataView`,
  completing the "no Buffer dependency" goal started in 0.6.0.

### Removed
- Dependencies: `pino`, `pino-pretty`, `buffer`, `assert`, `util`,
  `vm-browserify`, `stream-browserify`, `path-browserify`.

### Notes
- All 143 tests pass unchanged. NIP-19 round-trips (npub/nsec/note/nprofile/
  nevent/naddr/nrelay) verified, including `naddr` uint32 kind encoding.
- **Migration:** if you imported the `Logger` *type* from this package and relied
  on pino-specific methods, note it's now a local interface (trace/debug/info/
  warn/error/fatal/child). Standard logging calls are unaffected.

## [0.7.2] - 2026-07-16

### Fixed
- Ship valid dual ESM/CJS package — `type: module` + `dist/cjs/package.json` `{"type":"commonjs"}` shim + explicit `.js` import extensions in source; fixes native ESM named-export resolution for `tsx`/native-ESM consumers (bundlers previously masked the broken `exports` map). The `esm` build now uses `moduleResolution: NodeNext` to enforce explicit extensions at compile time.

## [0.7.0] - 2026-03-06

### Added
- **NIP-46 server-side signer primitives:**
  - `unwrapRequest()` — decrypt incoming kind 24133 event using signer's secret key
  - `wrapResponse()` — encrypt and sign a NIP-46 response from the signer's perspective
  - `handleSignerRequest()` — pure dispatch function routing NIP-46 methods to consumer-provided handlers
  - `createRequestFilter()` — Nostr filter for subscribing to incoming requests (server-side)
  - New types: `Nip46SignerHandlers`, `Nip46HandleOptions`, `Nip46HandleResult`, `Nip46UnwrapResult`
- NIP-46 now covers both client and server/signer perspectives

## [0.6.0] - 2026-03-04

### Changed
- **Noble 2.0 migration:** `@noble/curves` ^2.0.1, `@noble/hashes` ^2.0.1
- **Vitest 4:** Upgraded test framework from vitest 3.x
- **Pino 10:** Upgraded logger from pino 8.x (where applicable)
- **No Buffer dependency:** All crypto functions accept `Uint8Array` keys — browser-safe without polyfills
- **esbuild:** Replaced webpack with esbuild for browser bundling

### Fixed
- Removed `Buffer` dependency from all crypto paths
- Memory zeroing for shared secrets and npub input rejection

## [0.5.1] - 2026-03-02

### Added
- **NIP-46 (Nostr Connect / Remote Signing):** Pure protocol layer for remote signing
  - Bunker URI parsing, creation, and validation
  - Session management with ephemeral keypairs and NIP-44 conversation keys
  - JSON-RPC request/response creation and parsing
  - Kind 24133 event wrapping (encrypt + sign) and unwrapping (decrypt + parse)
  - Convenience request creators for all NIP-46 methods
  - Response filter helper for relay subscriptions
  - Full TypeScript types: `Nip46Method`, `BunkerURI`, `Nip46Request`, `Nip46Response`, `Nip46Session`
- `getPublicKeySync()` — synchronous public key derivation from private key
- `finalizeEvent()` — one-step event creation + signing utility
- Subpath exports: `nostr-crypto-utils/nip44`, `nostr-crypto-utils/nip46`, `nostr-crypto-utils/nip49`

### Restored
- **NIP-44 (Versioned Encrypted Payloads):** Restored from published v0.5.0 (lost during security refactoring)
  - `getConversationKey()`, `encrypt()`, `decrypt()`, `calcPaddedLen()`, `v2` API object
- **NIP-49 (Private Key Encryption / ncryptsec):** Restored from published v0.5.0
  - `encrypt()` and `decrypt()` for ncryptsec bech32 strings

### Dependencies
- Added `@noble/ciphers` (chacha20, xchacha20poly1305 for NIP-44/49)
- Added `@scure/base` (base64 for NIP-44, bech32 for NIP-49)

## [Unreleased]

## [0.4.16] - 2025-02-19

### Changed
- Updated dependencies to latest within major versions

### Fixed
- Updated exports to include validation functions

## [0.4.15] - 2025-02-09

### Changed
- Bumped version for npm publish

### Fixed
- Fixed Vite security vulnerability

### Refactored
- Updated build configuration for better ESM/CJS compatibility

## [0.4.14] - 2025-01-15

### Added
- NIP-19 support and updated dependencies

### Changed
- Improved types and NIP support

## [0.4.13] - 2025-01-10

### Added
- Improved NIP-19 documentation and exports

## [0.4.12] - 2025-01-05

### Fixed
- Improved TypeScript type handling and browser compatibility
- Removed unused imports

## [0.4.11] - 2025-01-03

### Changed
- Updated dist files after build cleanup
- Fixed linting issues and removed unused imports

## [0.4.10] - 2025-01-02

### Fixed
- Corrected crypto module exports path for better ESM compatibility
- Fixed directory imports for Node.js ESM

## [0.4.9] - 2025-01-02

### Fixed
- Enhanced Node.js compatibility with proper CJS/ESM module support
- Improved module resolution for both CommonJS and ES Module environments
- Fixed package exports to ensure consistent behavior across different Node.js versions

## [0.4.5] - 2024-12-29

### Fixed
- Fixed NIP-19 function exports to ensure proper access from dependent packages
- Improved type exports for NIP-19 related types
- Updated documentation for NIP-19 functionality with clearer examples

## [0.4.4] - 2024-12-29

### Added
- Enhanced logging system with comprehensive error handling
- Development mode pretty printing with timestamps
- TypeScript type exports for logger
- Export utility functions: `encodeBytes` and `getPublicKeyHex`

### Changed
- Updated logger implementation to follow project-wide standards
- Improved error object formatting with stack traces
- Enhanced development mode output formatting

## [0.4.3] - 2024-12-29

### Added
- Enhanced logging system with comprehensive error handling
- Development mode pretty printing with timestamps
- TypeScript type exports for logger
- Export utility functions: `encodeBytes` and `getPublicKeyHex`

### Changed
- Updated logger implementation to follow project-wide standards
- Improved error object formatting with stack traces
- Enhanced development mode output formatting
- Removed unused code and variables

### Fixed
- Error object serialization in logs now includes stack traces
- Development mode logging now properly handles timestamps
- Resolved lint issues in nip-19, nip-26, and validation utilities

## [0.4.2] - Previous Release
... (previous entries)
