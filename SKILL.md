---
name: nostr-crypto-utils
description: Level-0 Nostr cryptography for agents — keys, event signing/verification, NIP-44 encryption, NIP-59 gift wrap, NIP-17 private DMs, NIP-98 HTTP auth, NIP-19 bech32, NIP-46 remote signing, NIP-49 ncryptsec. The edge-native JS/TS reference implementation; sibling Python packages (nostrkey, nostr-secure-enclave) speak the same wire format and the same npub.
trigger: when an agent needs its own Nostr identity — generate or verify keys, sign or verify an event, encrypt/decrypt, send or read a private DM, authenticate an HTTP request, or encode/decode npub/nsec/note/naddr
version: 0.9.1
---

# nostr-crypto-utils — sovereign crypto for agents

This is **Level 0**: the cryptographic floor that lets an agent own its identity —
its own keypair, its own signatures, its own encrypted memory. Not a shared API key.
Not a wrapper around a borrowed account. The library does the math and **nothing else**:
no network, no storage, no logging. You control custody and transport.

> For the full integration guide (Hermes plugin / OpenClaw skill templates, recipes),
> see [AGENTS.md](./AGENTS.md). For a machine-readable map, see [llms.txt](./llms.txt).

## What it provides

| Capability | NIP | Functions | Suggested tool name |
|---|---|---|---|
| Generate/verify identity | 01/19 | `generateKeyPair`, `getPublicKey`, `npubEncode` | `nostrcrypto_keygen` |
| Sign / verify an event | 01 | `finalizeEvent`, `signEvent`, `verifySignature` | `nostrcrypto_sign`, `nostrcrypto_verify` |
| Authenticate an HTTP request | 98 | `createAuthEvent`, `toAuthHeader`, `validateAuthEvent` | `nostrcrypto_auth_header` |
| Private DM (send/read) | 17/59 | `createDirectMessage`, `readDirectMessage` | `nostrcrypto_dm_send`, `nostrcrypto_dm_read` |
| Encrypted self-memory | 44/59 | `encrypt`/`decrypt`, `wrapEvent`/`unwrapEvent` | `nostrcrypto_seal`, `nostrcrypto_open` |
| Encode/decode identities | 19 | `npubEncode`, `decode`, … | `nostrcrypto_encode` |

## The protocol — apply every time

These are security-critical gates. Follow them on every dispatch that touches keys or trust.

1. **The nsec never enters the LLM context.** Private keys live in custody (an env var, a
   Nostr Secure Enclave, or a NIP-46 bunker). Tool inputs carry only the *data to sign or
   encrypt* — never the private key itself. This library never logs secrets and makes no
   network calls, so there is no exfiltration surface here by design.
2. **The npub is public; the nsec is not.** Display the npub freely. Never reveal an
   unmasked nsec or seed phrase without owner verification — if key material is involved,
   defer to the `nostrkey` disclosure protocol (env reveal-code + masking + purpose).
3. **Verify before you act.** Treat `verifySignature` and `validateAuthEvent` as gates,
   not decorations. Do not act on an event whose signature you have not checked.
4. **NIP-98 auth is short-lived.** `validateAuthEvent` enforces a `created_at` window
   (default 60s) and binds `u`/`method` (and optionally a `payload` hash). Do not widen
   the window without reason.
5. **Gift wraps prove authorship.** `unwrapEvent` rejects events where the seal author ≠
   the rumor author. You can trust who a private message is from.
6. **Encryption is NIP-44 v2.** Use it (and NIP-17 for DMs). Do not use the deprecated
   NIP-04 path for new work.

## Where this sits

```
nostr-crypto-utils   (Level 0 — keys, signing, encryption)   ← you are here
        ↓
nostr-secure-enclave (hardware-backed key custody)
        ↓
nostrkey / NostrKeep (identity + sovereign storage)
        ↓
relays               (the agent's public presence)
```

## Make it your own

Don't adopt a format — **teach yours to speak Nostr identity.** Map each capability above
to a tool in whatever shape your runtime uses (a tool schema, a plugin, a skill, an MCP
server, a bare call). **[AGENTS.md](./AGENTS.md)** has the capability→function→tool mapping
and reference integrations to learn from — including the Hermes plugin and OpenClaw skill
shapes (templates: [`nostrkey.app.HA-python.src`](https://github.com/HumanjavaEnterprises/nostrkey.app.HA-python.src) ·
[`nostrkey.app.OC-python.src`](https://github.com/HumanjavaEnterprises/nostrkey.app.OC-python.src);
docs: <https://loginwithnostr.com/hermes>, <https://loginwithnostr.com/openclaw>). Pick the
one closest to your world, or invent your own. Same npub, same events, any language.
