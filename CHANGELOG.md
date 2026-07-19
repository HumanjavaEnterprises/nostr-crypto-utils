# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.8.0] - 2026-07-17

Crypto-correctness release addressing the 2026-07-17 release audit. **BREAKING** — see below.

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
