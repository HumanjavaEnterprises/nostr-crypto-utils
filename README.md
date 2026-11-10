# Nostr Crypto Utils

A comprehensive cryptographic utility library for Nostr protocol implementation, focusing on core security operations and cross-platform compatibility.

> **Edge-native (v0.8.0+):** runs unmodified on **Cloudflare Workers / Deno / browsers** — 5 audited crypto-only dependencies (`@noble/*`, `@scure/base`, `bech32`), no Node polyfills, no logging deps.
>
> **Building an agent?** This is Level 0 of a sovereign stack — give your AI its own
> cryptographic identity, not a shared API key. See **[AGENTS.md](./AGENTS.md)** for agent
> integration (Hermes / OpenClaw) and **[llms.txt](./llms.txt)** for a machine-readable map.

## Overview

This library provides essential cryptographic operations and utilities required for Nostr protocol implementation, with a focus on:

- Schnorr signatures for the Nostr protocol
- Key management and validation
- Event signing and verification
- HTTP Auth (NIP-98)
- Gift Wrap (NIP-59) and Private Direct Messages (NIP-17)
- Versioned encrypted payloads (NIP-44)
- Remote signing / Nostr Connect (NIP-46)
- Private key encryption / ncryptsec (NIP-49)
- Bech32-encoded entities (NIP-19)
- Authentication protocol (NIP-42)
- Encrypted direct messages (NIP-04 — _deprecated_, use NIP-17)
- Delegated event signing (NIP-26 — _deprecated_, use NIP-46)

## Core Features

### Cryptographic Operations
- Key generation and validation using Schnorr signatures
- Event signing and verification (NIP-01 compliant)
- NIP-04 encryption/decryption
- Shared secret computation
- Delegation token handling (NIP-26)
- Authentication protocol (NIP-42)

### Encoding Utilities
- Hex encoding/decoding
- Base64 encoding/decoding
- UTF-8 encoding/decoding
- Binary data handling
- Bech32 encoding/decoding (NIP-19)

### Protocol Support
- NIP-01: Basic protocol flow
- NIP-17: Private Direct Messages
- NIP-19: Bech32-Encoded Entities
- NIP-42: Authentication Protocol
- NIP-44: Versioned Encrypted Payloads
- NIP-46: Nostr Connect (Remote Signing)
- NIP-49: Private Key Encryption (ncryptsec)
- NIP-59: Gift Wrap
- NIP-98: HTTP Auth
- NIP-04: Encrypted Direct Messages _(deprecated → NIP-17)_
- NIP-26: Delegated Event Signing _(deprecated → NIP-46)_

## Project Structure

```
├── src/
│   ├── crypto.ts           # Core cryptographic operations
│   ├── encoding/           # Encoding utilities
│   │   ├── base64.ts
│   │   ├── hex.ts
│   │   └── index.ts
│   ├── types/             # Type definitions
│   │   ├── base.ts
│   │   ├── messages.ts
│   │   ├── protocol.ts
│   │   └── guards.ts
│   ├── nips/              # NIP implementations
│   └── utils/             # Utility functions
```

## Technical Requirements

- **Edge-native**: runs unmodified on Cloudflare Workers, Deno, browsers, and Node.js 20+ — no Node polyfills required, no side effects at import
- Supports both ESM and CJS formats, with per-NIP subpath exports (`nostr-crypto-utils/nip01`, `/nip04`, `/nip17`, `/nip19`, `/nip26`, `/nip44`, `/nip46`, `/nip49`, `/nip59`, `/nip98`) and `workerd` / `browser` export conditions
- TypeScript-first with full type definitions
- 5 runtime dependencies, all audited and crypto-only (`@noble/ciphers`, `@noble/curves`, `@noble/hashes`, `@scure/base`, `bech32`)

[![npm version](https://badge.fury.io/js/nostr-crypto-utils.svg)](https://www.npmjs.com/package/nostr-crypto-utils)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/main/LICENSE)
[![Documentation](https://img.shields.io/badge/docs-TypeDoc-blue.svg)](https://humanjavaenterprises.github.io/nostr-crypto-utils/)
[![Build Status](https://img.shields.io/github/workflow/status/HumanjavaEnterprises/nostr-crypto-utils/CI)](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/actions)
[![Coverage Status](https://coveralls.io/repos/github/HumanjavaEnterprises/nostr-crypto-utils/badge.svg?branch=main)](https://coveralls.io/github/HumanjavaEnterprises/nostr-crypto-utils?branch=main)
[![Known Vulnerabilities](https://snyk.io/test/github/HumanjavaEnterprises/nostr-crypto-utils/badge.svg)](https://snyk.io/test/github/HumanjavaEnterprises/nostr-crypto-utils)

> **Release note — v0.8.0 (staged, pending publish).** This is the kernel of a
> coordinated 2026-07 correctness pass across the Nostr library family. Every fix
> in this release is verified against a shared known-answer vector set (NIP-44 v2 /
> NIP-49 / NIP-19 TLV / BIP-340 deterministic-sign) so symmetric encode/decode bugs
> can no longer hide in self-round-trip tests. The family dogfoods only its own
> libraries — there is no upstream `nostr-tools` dependency. See
> [CHANGELOG.md](CHANGELOG.md) for the full (breaking) details.

## Security Notice

⚠️ **Important**: This library handles cryptographic keys and operations that are critical for securing your Nostr identity and data. All cryptographic operations, including key generation, signing, and encryption, must be handled with appropriate security measures.

If you discover a security vulnerability, please follow our [Security Policy](SECURITY.md) and report it through [GitHub's Security Advisory feature](https://github.com/humanjavaenterprises/nostr-crypto-utils/security/advisories/new).

### Dependency Vulnerability Status

We actively monitor and address security vulnerabilities in this codebase. **`npm audit --omit=dev` reports zero vulnerabilities** for this package — there are no known security issues in production dependencies.

Any remaining `npm audit` findings are in development-only tooling (eslint, typescript-eslint, vitest, etc.) and stem from transitive dependencies with no upstream fix available. These are devDependencies that are never included in the published package and pose no risk to consumers of this library. We monitor upstream fixes and update promptly when they become available.

## Why Choose nostr-crypto-utils?

- **Edge-native**: zero Node polyfills — deploys as-is to Cloudflare Workers, Deno, and browsers
- **Lean, audited dependencies**: only 5 crypto-only runtime deps (`@noble/*`, `@scure/base`, `bech32`) — small attack surface, easy to audit
- **Type-First**: Built from the ground up with TypeScript for maximum type safety
- **Modular Design**: Per-NIP subpath exports — import only what you need
- **Complementary**: Works seamlessly with nostr-nsec-seedphrase for complete key management
- **Security Focused**: Strict validation, official NIP test vectors, silent-by-default logging

## Features

- **Complete NIP Compliance**: Implements all required cryptographic operations according to Nostr Implementation Possibilities (NIPs)
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Event Handling**: Create, sign, and validate Nostr events
- **Message Formatting**: Protocol-compliant message formatting for relay communication
- **Encryption**: Versioned NIP-44 encryption, NIP-59 gift wrap, NIP-17 private DMs
- **HTTP Auth**: NIP-98 signed-request auth (event + header build/verify, no transport)
- **Validation**: Comprehensive validation for events, filters, and subscriptions
- **Edge-Native**: Cloudflare Workers / Deno / browser / Node.js — no polyfills
- **Lean Dependencies**: 5 audited crypto-only runtime dependencies

## Supported NIPs

This library implements the following Nostr Implementation Possibilities (NIPs):

| NIP | Title | Description | Status |
|-----|-------|-------------|---------|
| [NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md) | Basic Protocol Flow Description | Core protocol functionality including event creation, signing, and verification | ✅ Complete |
| [NIP-17](https://github.com/nostr-protocol/nips/blob/master/17.md) | Private Direct Messages | Encrypted chat (`kind 14`) over NIP-44 + NIP-59 gift wrap | ✅ Complete |
| [NIP-19](https://github.com/nostr-protocol/nips/blob/master/19.md) | bech32-encoded Entities | Human-readable encoding for keys, events, and other entities | ✅ Complete |
| [NIP-42](https://github.com/nostr-protocol/nips/blob/master/42.md) | Authentication | Client-relay authentication protocol | ✅ Complete |
| [NIP-44](https://github.com/nostr-protocol/nips/blob/master/44.md) | Versioned Encrypted Payloads | Modern encryption (v2: ChaCha20 + HKDF + HMAC) | ✅ Complete |
| [NIP-46](https://github.com/nostr-protocol/nips/blob/master/46.md) | Nostr Connect (Remote Signing) | Protocol layer for remote signing via bunker | ✅ Complete |
| [NIP-49](https://github.com/nostr-protocol/nips/blob/master/49.md) | Private Key Encryption | ncryptsec password-encrypted key storage | ✅ Complete |
| [NIP-59](https://github.com/nostr-protocol/nips/blob/master/59.md) | Gift Wrap | Rumor → seal (`kind 13`) → gift wrap (`kind 1059`/`21059`) over NIP-44 | ✅ Complete |
| [NIP-98](https://github.com/nostr-protocol/nips/blob/master/98.md) | HTTP Auth | Build/verify `kind 27235` events + `Authorization: Nostr` header (no HTTP performed) | ✅ Complete |
| [NIP-04](https://github.com/nostr-protocol/nips/blob/master/04.md) | Encrypted Direct Messages | Legacy DMs — **deprecated** upstream, prefer NIP-17 | ⚠️ Deprecated |
| [NIP-26](https://github.com/nostr-protocol/nips/blob/master/26.md) | Delegated Event Signing | **Deprecated** upstream, prefer NIP-46 for acting on behalf of a key | ⚠️ Deprecated |

### NIP-01 Features
- Event creation and serialization
- Event signing and verification
- Event ID calculation
- Basic protocol validation

### NIP-04 Features
- End-to-end encrypted direct messages
- Secure key exchange
- Message encryption/decryption

### NIP-19 Features
- Bech32 encoding/decoding for:
  - Public keys (`npub`)
  - Private keys (`nsec`)
  - Note IDs (`note`)
  - Profile references (`nprofile`)
  - Event references (`nevent`)
  - Addressable entities (`naddr`)
  - Relay URLs (`nrelay`)
- Comprehensive validation and error handling
- Support for multiple relay URLs
- TLV (Type-Length-Value) encoding for complex entities
- Improved type exports and function accessibility (v0.4.5+)
- Enhanced error messages and validation
- Cross-platform compatibility guaranteed

### NIP-19 Usage Examples

The encoders live in the `nip19` namespace (root) or the `nostr-crypto-utils/nip19` subpath.

```typescript
import {
  npubEncode,
  nsecEncode,
  noteEncode,
  nprofileEncode,
  neventEncode,
  naddrEncode,
  decode,
} from 'nostr-crypto-utils/nip19';
// or: import { nip19 } from 'nostr-crypto-utils'; nip19.npubEncode(...)

const pubkey = '7f3b6c2444c526fc7b3a48b0a1e38fb6a5a4062d4a097c9e96feb3c1df2f36d0';

const npub = npubEncode(pubkey);   // 'npub1...'
const note = noteEncode(pubkey);   // any 32-byte hex id → 'note1...'

// Profile with relay hints
const nprofile = nprofileEncode(pubkey, ['wss://relay1.example.com', 'wss://relay2.example.com']);

// Event with relay, author and kind (kind must be an integer in 0..2^32-1)
const nevent = neventEncode(pubkey, ['wss://relay.example.com'], pubkey, 1);

// Addressable entity; the d-tag identifier may be '' for plain replaceable kinds
const naddr = naddrEncode(pubkey, 30023, 'my-article', ['wss://relay.example.com']);

// Decode any bech32-encoded entity
const decoded = decode(nprofile);
// { type: 'nprofile', data: '7f3b…36d0', relays: ['wss://relay1.example.com', 'wss://relay2.example.com'] }

// Inputs are validated
try {
  npubEncode('invalid-hex');
} catch (error) {
  // Error: Invalid hex string
}
```

### NIP-44 Usage (Encrypted Payloads)

```typescript
import { nip44 } from 'nostr-crypto-utils';
// Or via subpath: import * as nip44 from 'nostr-crypto-utils/nip44';

// Derive a conversation key from ECDH
const conversationKey = nip44.getConversationKey(myPrivKeyBytes, theirPubkeyHex);

// Encrypt
const encrypted = nip44.encrypt('Hello!', conversationKey);

// Decrypt
const plaintext = nip44.decrypt(encrypted, conversationKey);
```

### NIP-46 Usage (Remote Signing)

```typescript
import { nip46 } from 'nostr-crypto-utils';
// Or via subpath: import * as nip46 from 'nostr-crypto-utils/nip46';

// Parse a bunker:// URI
const bunker = nip46.parseBunkerURI('bunker://pubkey...?relay=wss://relay.example.com&secret=abc');

// Create a session (ephemeral keypair + NIP-44 conversation key)
const session = nip46.createSession(bunker.remotePubkey);

// Build a request
const req = nip46.connectRequest(bunker.remotePubkey, bunker.secret);

// Wrap into a kind 24133 encrypted event (ready to publish to relay)
const event = await nip46.wrapEvent(req, session, bunker.remotePubkey);

// On receiving a response event, unwrap it
const response = nip46.unwrapEvent(responseEvent, session);

// Create a filter for subscribing to responses
const filter = nip46.createResponseFilter(session.clientPubkey);
```

Signer (bunker) side — `connect` is **fail-closed**: it succeeds only with a matching
secret (compared in constant time), an approving `onConnect` callback, or an explicit
`allowOpenConnect: true`.

```typescript
import { nip46 } from 'nostr-crypto-utils';

const authenticated = new Set<string>();
const usedSecrets = new Set<string>();
const seen = new Set<string>(); // replay cache: bound it yourself

const { request, clientPubkey, conversationKey } = nip46.unwrapRequest(incomingEvent, signerSecretKeyHex, {
  seenIds: seen,       // a repeated request throws
  maxAgeSeconds: 120,  // also verifies the event signature
});
const result = await nip46.handleSignerRequest(request, clientPubkey, handlers, {
  secret: bunkerSecret,      // from your bunker:// URI
  usedSecrets,               // one-time secrets
  signerPubkey: signerPubkeyHex,
  authenticatedClients: authenticated,
});
if (result.newlyAuthenticated) authenticated.add(result.newlyAuthenticated);
if (result.consumedSecret) usedSecrets.add(result.consumedSecret);
const reply = await nip46.wrapResponse(result.response, signerSecretKeyHex, signerPubkeyHex, clientPubkey, conversationKey);
```

### NIP-49 Usage (ncryptsec Key Encryption)

```typescript
import { nip49 } from 'nostr-crypto-utils';
// Or via subpath: import * as nip49 from 'nostr-crypto-utils/nip49';

// Encrypt a private key with a password
const ncryptsec = nip49.encrypt(secretKeyBytes, 'my-password');
// Returns: 'ncryptsec1...'

// Decrypt it back
const secretKey = nip49.decrypt(ncryptsec, 'my-password');

// log_n in a received ncryptsec is attacker-controlled (scrypt memory = 128 * 8 * 2^log_n).
// decrypt refuses log_n > 18 (256 MiB) by default; raise it explicitly if you must:
const strongKey = nip49.decrypt(otherNcryptsec, 'my-password', { maxLogN: 20 });
```

### NIP-98 Usage (HTTP Auth)

Builds and verifies the `kind 27235` auth event and the `Authorization: Nostr <base64>`
header. **No HTTP request is made** — you issue the request yourself, which keeps the
package edge-native. Ideal for authenticating requests to Nostr-native HTTP services.

```typescript
import { nip98 } from 'nostr-crypto-utils';
// Or via subpath: import * as nip98 from 'nostr-crypto-utils/nip98';

// --- client side ---
const event = await nip98.createAuthEvent(
  { url: 'https://api.example.com/v1/me', method: 'GET' },
  privateKeyHex,
);
const res = await fetch('https://api.example.com/v1/me', {
  headers: { Authorization: nip98.toAuthHeader(event) },
});

// POST with a body — the body is hashed into a `payload` tag
const body = JSON.stringify({ name: 'alice' });
const postAuth = await nip98.createAuthEvent(
  { url: 'https://api.example.com/v1/register', method: 'POST', payload: body },
  privateKeyHex,
);

// --- server side (e.g. a Cloudflare Worker) ---
const incoming = nip98.fromAuthHeader(request.headers.get('Authorization'));
const result = await nip98.validateAuthEvent(incoming, {
  url: request.url,
  method: request.method,
  body: await request.text(), // a non-empty body requires a matching payload tag
  seenIds: recentAuthIds,      // optional replay guard (a Set you bound yourself)
});
if (!result.valid) return new Response(result.reason, { status: 401 });
const authedPubkey = incoming.pubkey;
```

Since 0.10.0 a token **without** a `payload` tag no longer authorizes a non-empty body
(`requirePayload` defaults to true); pass `requirePayload: false` to accept such tokens.

### NIP-59 Usage (Gift Wrap)

Encapsulates any event: a rumor (unsigned) is sealed (`kind 13`) and gift-wrapped
(`kind 1059`, or ephemeral `kind 21059`) using NIP-44 encryption. Unwrapping verifies
the seal signature and enforces that the seal author equals the rumor author.

```typescript
import { nip59 } from 'nostr-crypto-utils';
// Or via subpath: import * as nip59 from 'nostr-crypto-utils/nip59';

// Build a rumor and gift-wrap it to a recipient
const rumor = await nip59.createRumor({ kind: 1, content: 'hello' }, senderPubkeyHex);
const giftWrap = await nip59.wrapEvent(rumor, senderPrivkeyHex, recipientPubkeyHex);
// giftWrap.kind === 1059, signed by a random one-time key, p-tagged to the recipient

// Recipient unwraps it back to the rumor
const recovered = await nip59.unwrapEvent(giftWrap, recipientPrivkeyHex);
// recovered.content === 'hello', recovered.pubkey === sender
```

### NIP-17 Usage (Private Direct Messages)

Encrypted chat built on NIP-44 + NIP-59. `createDirectMessage` returns one gift wrap
per recipient **plus** a copy addressed to the sender; publish each to the matching
party's DM inbox relays (NIP-17 `kind 10050`).

```typescript
import { nip17 } from 'nostr-crypto-utils';
// Or via subpath: import * as nip17 from 'nostr-crypto-utils/nip17';

// Send a DM (also works for group rooms via multiple recipients)
const wraps = await nip17.createDirectMessage(senderPrivkeyHex, {
  content: 'hey bob',
  recipients: [bobPubkeyHex],
  subject: 'dinner',          // optional
});
for (const { recipient, giftWrap } of wraps) {
  // publish giftWrap to `recipient`'s DM relays
}

// Read a received gift wrap into the kind-14 chat message
const message = await nip17.readDirectMessage(receivedGiftWrap, recipientPrivkeyHex);
// message.kind === 14, message.content === 'hey bob'
```

### Type System

#### Event Types
The library provides a comprehensive type system for Nostr events:

```typescript
// Create an unsigned event
const unsignedEvent: UnsignedNostrEvent = {
  kind: NostrEventKind.TEXT_NOTE,
  content: "Hello Nostr!",
  tags: [],
  created_at: Math.floor(Date.now() / 1000)
};

// Sign the event
const signedEvent = await signEvent(unsignedEvent, privateKey);
```

#### Authentication (NIP-42)
Support for NIP-42 authentication:

```typescript
// Create an auth event
const authEvent: UnsignedNostrEvent = {
  kind: NostrEventKind.AUTH,
  content: "challenge-response",
  tags: [["challenge", challenge]],
  created_at: Math.floor(Date.now() / 1000)
};

// Sign and send the auth event
const signedAuthEvent = await signEvent(authEvent, privateKey);
```

#### Custom Tags (NIP-12)
Support for arbitrary tags:

```typescript
// Create a filter with custom tags
const filter: NostrFilter = {
  kinds: [NostrEventKind.TEXT_NOTE],
  "#t": ["nostr", "crypto"],  // Filter by custom tag
  limit: 10
};
```

### Quick Start

### Installation
```bash
npm install nostr-crypto-utils
```

### Basic Usage

#### Key Generation and Event Signing
```typescript
import { generateKeyPair, finalizeEvent, verifySignature } from 'nostr-crypto-utils';
import { npubEncode } from 'nostr-crypto-utils/nip19';

// Generate a new key pair (async). privateKey is hex; publicKey is { hex, bytes }.
const keyPair = await generateKeyPair();
const npub = npubEncode(keyPair.publicKey.hex);

// Create, hash and sign an event in one step (pubkey is derived from the key)
const signedEvent = await finalizeEvent({ kind: 1, content: 'Hello Nostr!', tags: [] }, keyPair.privateKey);

// Verify: returns false (silently) for any invalid or non-canonical event
const ok = await verifySignature(signedEvent); // true
```

`createEvent(partial)` + `signEvent(event, privateKey)` are the two-step form. `signEvent`
throws if `event.pubkey` is set to a key other than the signing key (and fills it in when
it is missing), so it can never produce an unverifiable event.

### Encrypted Direct Messages (NIP-04)

> ⚠️ **Deprecated.** NIP-04 is `unrecommended` upstream (it leaks metadata). For new
> work use **[NIP-17 Private Direct Messages](#nip-17-usage-private-direct-messages)**
> (NIP-44 encryption + NIP-59 gift wrap). NIP-04 remains only for legacy compatibility.
>
> **Breaking change in 0.8.0.** When you do use NIP-04, it now has a single canonical,
> **synchronous** API with **branded key types**. The argument order is fixed, and passing
> keys in the wrong order (or as plain strings) is a **compile error**:
>
> - `encryptMessage(message, senderPrivkey: PrivateKey, recipientPubkey: PublicKey): string`
> - `decryptMessage(ciphertext, recipientPrivkey: PrivateKey, senderPubkey: PublicKey): string`
>
> Build the branded keys with `asPrivateKey(hex)` / `asPublicKey(hex)` (64-char hex /
> 32-byte x-only). Real x-only Nostr pubkeys are accepted (no more "Point of length 32
> was invalid"). The legacy `encrypt`/`decrypt` remain as deprecated back-compat wrappers.

The library provides robust support for encrypted direct messages following the NIP-04 specification:

```typescript
import { encryptMessage, decryptMessage, asPrivateKey, asPublicKey } from 'nostr-crypto-utils';

// Encrypting a direct message: (message, senderPrivkey, recipientPubkey)
function createEncryptedDM(
  content: string,
  recipientPubkey: string,
  senderPrivkey: string
) {
  const encryptedContent = encryptMessage(
    content,
    asPrivateKey(senderPrivkey),
    asPublicKey(recipientPubkey),
  );

  return {
    kind: 4, // NIP-04 Encrypted Direct Message
    content: encryptedContent,
    tags: [['p', recipientPubkey]],
  };
}

// Decrypting a received message: (ciphertext, recipientPrivkey, senderPubkey)
function decryptDM(
  encryptedContent: string,
  senderPubkey: string,
  recipientPrivkey: string
) {
  return decryptMessage(
    encryptedContent,
    asPrivateKey(recipientPrivkey),
    asPublicKey(senderPubkey),
  );
}
```

### Event Validation and Signature Verification

The library provides utilities for validating Nostr events and verifying signatures:

```typescript
import { validateEvent } from 'nostr-crypto-utils';
import type { SignedNostrEvent } from 'nostr-crypto-utils';

function isAuthentic(event: SignedNostrEvent): boolean {
  // validateEvent returns a ValidationResult object — check .isValid.
  // It checks structure, canonical lowercase hex id/pubkey/sig, id = hash(event),
  // and the schnorr signature.
  const result = validateEvent(event);
  if (!result.isValid) {
    console.debug('Rejected event:', result.error);
    return false;
  }
  return true;
}
```

`validateSignedEvent` is the same full check. `validateSignedEventFormat` checks only the
shape and hex format (no signature verification) — never use it to decide trust.

Note the `nip01` namespace / `nostr-crypto-utils/nip01` subpath: its
`validateEventStructure` (and the deprecated alias `nip01.validateEvent`) returns a plain
boolean for **field shape only** — no id, hex or signature check. For trust, use the root
`validateEvent` (above) or `verifySignature`.

These examples demonstrate real-world usage patterns from production Nostr applications, showcasing both the security features and ease of use of the library.

### NIP-26 Features
- Create delegation tokens
- Sign events with delegation
- Validate delegated events
- Conditional delegations with:
  - Time constraints
  - Event kind restrictions
  - Tag restrictions

## Features and Capabilities

| Feature                    | Status | Description                                           |
|---------------------------|--------|-------------------------------------------------------|
| Key Management            | ✅     | Generate, validate, and manage Nostr keypairs         |
| Event Creation            | ✅     | Create and validate Nostr events                      |
| Event Signing             | ✅     | Sign events with schnorr signatures                   |
| Event Verification        | ✅     | Verify event signatures and validate event structure  |
| Direct Messages (NIP-04)  | ✅     | Encrypt and decrypt direct messages                   |
| Message Formatting        | ✅     | Format messages for relay communication               |
| Type Safety              | ✅     | Full TypeScript support with strict typing           |
| Browser Support          | ✅     | Works in modern browsers with Web Crypto API         |
| Node.js Support         | ✅     | Full support for Node.js environments               |

## Integration with nostr-nsec-seedphrase

This library is designed to work seamlessly with [nostr-nsec-seedphrase](https://github.com/HumanjavaEnterprises/nostr-nsec-seedphrase) to provide a complete solution for Nostr key management and cryptographic operations:

```typescript
import { finalizeEvent } from 'nostr-crypto-utils';

// privateKeyHex: a 64-char hex key derived from a seed phrase with nostr-nsec-seedphrase
const signedEvent = await finalizeEvent({ kind: 1, content: 'Hello Nostr!', tags: [] }, privateKeyHex);
```

Together, these libraries provide:
- Secure key generation and recovery through seed phrases
- Type-safe cryptographic operations
- Comprehensive event handling
- Minimal bundle size and dependencies

## Delegate Token Creation (NIP-26)

> ⚠️ **Deprecated.** NIP-26 is `unrecommended` upstream ("adds unnecessary burden for
> little gain") and cannot revoke without time-bounding. For acting on behalf of a key,
> prefer **NIP-46 remote signing**. The following remains for legacy compatibility.

You can use this library to create delegate tokens for use on web servers or other applications. This implements [NIP-26](https://github.com/nostr-protocol/nips/blob/master/26.md) for delegation of signing authority.

### Basic Delegation Example

```typescript
import { generateKeyPair, finalizeEvent } from 'nostr-crypto-utils';
import {
  createDelegation,
  verifyDelegation,
  addDelegationTag,
  extractDelegation,
  checkDelegationConditions,
} from 'nostr-crypto-utils/nip26';

const delegator = await generateKeyPair();
const delegatee = await generateKeyPair();
const now = Math.floor(Date.now() / 1000);

// Delegator signs a token: kind 1 only, valid for 30 days.
// Serialized as 'kind=1&created_at>…&created_at<…' (strict comparisons per NIP-26).
const delegation = createDelegation(delegator.privateKey, delegatee.publicKey.hex, {
  kind: 1,
  since: now - 60,
  until: now + 30 * 24 * 60 * 60,
});

// Delegatee attaches the delegation tag and signs with its own key
const unsigned = addDelegationTag(
  { kind: 1, content: 'Posted via delegation', tags: [], created_at: now, pubkey: delegatee.publicKey.hex },
  delegation,
);
const event = await finalizeEvent(unsigned, delegatee.privateKey);

// Verifier: token signature + conditions
const found = extractDelegation(event); // null if missing or the conditions string is malformed
const ok = !!found && (await verifyDelegation(found)) && checkDelegationConditions(event, found.conditions);
```

Several `kind=` clauses in one conditions string form a set of allowed kinds
(`{ kinds: [1, 6] }` serializes to `kind=1&kind=6`). Unknown clauses make
`extractDelegation` return `null` (fail closed). Tag restrictions are not supported.

### Security Considerations

When working with delegated tokens:

1. **Store Securely**: Always store delegation tokens and private keys securely
2. **Check Expiration**: Validate the delegation's time constraints before using
3. **Validate Conditions**: Check all conditions before signing or accepting delegated events
4. **Limit Scope**: Only delegate the minimum required permissions
5. **Monitor Usage**: Keep track of how delegated tokens are being used

For more details on delegation, see the [NIP-26 specification](https://github.com/nostr-protocol/nips/blob/master/26.md).

## Type System Improvements

### Enhanced Type System

- **Consolidated Type Definitions**: Improved consistency and safety through unified type definitions
- **Better Type Inference**: Enhanced type inference for easier development and better code completion
- **Stricter Type Checks**: Improved type safety with stricter checks for better error prevention

### Improved Type Documentation

- **Better JSDoc Comments**: Improved documentation with clear and concise JSDoc comments
- **NIP References**: Added references to relevant NIPs for better understanding of the underlying protocol

## Logging

The library is **silent by default** — invalid input never writes to the console. Opt in:

```typescript
import { setLogLevel, getLogLevel } from 'nostr-crypto-utils';

setLogLevel('debug');   // 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'silent'
getLogLevel();          // 'debug'
setLogLevel(undefined); // back to the default
```

Or set the env var `NOSTR_CRYPTO_UTILS_LOG_LEVEL=debug` (read lazily on first log call,
never at import time; the generic `LOG_LEVEL` is ignored).

### Common Error Messages

| Error Message | Likely Cause | Solution |
|--------------|--------------|----------|
| "Invalid delegation token" | Token expired or malformed | Check token expiration and format |
| "Signature verification failed" | Wrong key format or corrupted signature | Verify key formats and conversion |
| "Condition check failed" | Event doesn't match delegation conditions | Check event kind and other conditions |
| "Invalid pubkey format" | Using bech32 instead of hex | Convert pubkey to correct format |
| "Token expired" | Delegation token past expiration | Create new delegation with future expiration |

### Validation Checks

When troubleshooting, verify these common points:

#### Key Formats
- Private keys should be in hex format
- Public keys should be in hex format (not bech32)
- Signatures should be 64 bytes in hex format

#### Time Constraints
- Token expiration should be in the future
- Check system clock synchronization
- Use UTC timestamps consistently

#### Permission Scope
- Verify event kinds match delegation conditions
- Check any tag restrictions
- Confirm time window restrictions

#### Network Issues
- Verify relay connections
- Check for rate limiting
- Confirm proper websocket handling

For more help, join our [Discord community](https://discord.gg/nostr) or [open an issue](https://github.com/humanjavaenterprises/nostr-crypto-utils/issues).

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes.

## Support

- [Documentation](https://humanjavaenterprises.github.io/nostr-crypto-utils/)
- [Issue Tracker](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/issues)
- [Discussions](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/discussions)

## Related Projects

- [nostr-nsec-seedphrase](https://github.com/HumanjavaEnterprises/nostr-nsec-seedphrase) - Generate and manage Nostr private keys using BIP-39 seed phrases
