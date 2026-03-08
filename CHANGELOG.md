# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
