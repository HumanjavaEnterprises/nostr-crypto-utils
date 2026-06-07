# Agent Integration Guide

> **Give your AI its own cryptographic identity** — not a shared API key, but its own
> keypair, its own signature, its own verifiable presence on an open protocol. An agent
> should be **a first-class participant on any relay, not a wrapper around a borrowed
> account.**

`nostr-crypto-utils` is **Level 0** of a sovereign stack — the cryptographic floor an
agent stands on. It does the math (keys, signatures, encryption, encoding) and **nothing
else**: no network calls, no storage, no logging deps, no Node polyfills. That makes it
safe to drop into an edge runtime *and* into an agent's tool belt without dragging in a
supply chain you didn't choose. Built in by design, not bolted on after.

This guide is written for **agents and agent platforms** (e.g. Hermes Agent, OpenClaw)
that want to integrate these primitives natively. For the human-facing overview, see
[README.md](./README.md); for a machine-readable map, see [llms.txt](./llms.txt).

---

## Why an agent wants its own keys

A shared API key makes your agent a tenant of someone else's account. A Nostr keypair
makes it a **sovereign participant**: it can sign its own events, prove authorship,
authenticate to services, hold its own encrypted memory, and talk privately to other
agents and humans — all verifiable by anyone, owned by no platform.

`nostr-crypto-utils` gives the agent:

| The agent gets… | via | functions |
|---|---|---|
| **An identity** | NIP-01 / NIP-19 | `generateKeyPair`, `getPublicKey`, `npubEncode` |
| **A signature** (authorship) | NIP-01 | `finalizeEvent`, `signEvent`, `verifySignature` |
| **A way to authenticate to HTTP services** | NIP-98 | `createAuthEvent`, `toAuthHeader`, `validateAuthEvent` |
| **Private messages** (to humans/agents) | NIP-17 + NIP-59 | `createDirectMessage`, `readDirectMessage` |
| **Its own encrypted memory** | NIP-44 / NIP-59 | `encrypt`/`decrypt`, `wrapEvent`/`unwrapEvent` |
| **Delegated/remote signing** (keys stay in custody) | NIP-46 | `parseBunkerURI`, `createSession`, … |
| **Encrypted key-at-rest** | NIP-49 | `encrypt`/`decrypt` (`ncryptsec`) |

## Install

```bash
npm i nostr-crypto-utils
```

ESM + CJS, types included, per-NIP subpath exports. No network, no Node-only APIs — runs
on Cloudflare Workers, Deno, browsers, and Node 18+.

---

## Recipes

### 1. Mint the agent's identity

```ts
import { generateKeyPair } from 'nostr-crypto-utils';
import { npubEncode } from 'nostr-crypto-utils/nip19';

const kp = await generateKeyPair();
const npub = npubEncode(kp.publicKey.hex);
// Store kp.privateKey in custody (see "Custody" below). Publish npub as the agent's face.
```

### 2. Authenticate an HTTP request (NIP-98)

The agent proves it made a request by signing a short-lived event — no shared secret, no
bearer token. Ideal for calling Nostr-native services (e.g. `npub.bio`, your own APIs).

```ts
import { createAuthEvent, toAuthHeader } from 'nostr-crypto-utils/nip98';

const event = await createAuthEvent(
  { url: 'https://api.npub.bio/v1/me', method: 'GET' },
  agentPrivateKeyHex,
);
const res = await fetch('https://api.npub.bio/v1/me', {
  headers: { Authorization: toAuthHeader(event) },
});
```

Server side (e.g. a Worker): `fromAuthHeader()` → `validateAuthEvent()` → trust `event.pubkey`.

### 3. Private message to a human or another agent (NIP-17)

```ts
import { createDirectMessage, readDirectMessage } from 'nostr-crypto-utils/nip17';

const wraps = await createDirectMessage(agentPrivateKeyHex, {
  content: 'task complete — ledger updated',
  recipients: [ownerPubkeyHex],
});
// publish each wraps[i].giftWrap to the recipient's DM inbox relays (NIP-17 kind 10050)

// on the receiving side:
const msg = await readDirectMessage(receivedGiftWrap, recipientPrivateKeyHex);
```

### 4. The agent's own encrypted memory

The agent writes notes **to itself, encrypted to its own key** — nobody else can read
them. Gift-wrap a rumor addressed to the agent's own pubkey:

```ts
import { createRumor, wrapEvent, unwrapEvent } from 'nostr-crypto-utils/nip59';

const self = agentPubkeyHex;
const note = await createRumor({ kind: 30078, content: JSON.stringify(state) }, self);
const sealed = await wrapEvent(note, agentPrivateKeyHex, self); // to self
// later:
const recovered = await unwrapEvent(sealed, agentPrivateKeyHex);
```

---

## Integrate identity into your own format

This package is the **primitive, not a prescription**. The goal isn't to make you adopt a
specific plugin shape — it's to give you the pieces so you can **express Nostr identity in
whatever format your runtime already uses**: a tool schema, a plugin, a skill, an MCP
server, a bare function call. Learn the mapping once, then bring it into your world.

**The mapping is always the same** — a capability, the function that does it, and a tool in
*your* format:

| Capability | Function | What your tool exposes |
|---|---|---|
| keygen | `generateKeyPair` → `npubEncode` | returns the agent's npub; stores sk in custody |
| sign | `finalizeEvent(partial, sk)` | signs an event the agent authored |
| verify | `verifySignature(event)` | a gate before acting on an event |
| http auth | `createAuthEvent(...)` → `toAuthHeader` | an `Authorization` header for a request |
| dm send/read | `createDirectMessage` / `readDirectMessage` | private messages |
| seal/open | `wrapEvent` / `unwrapEvent` | the agent's own encrypted memory |

Keys come from custody (env / enclave / bunker), never from tool input.

### Reference integrations — learn from one, map to yours

- **Generic tool schema** (any LLM/agent framework):
  ```jsonc
  {
    "name": "nostr_http_auth_header",
    "description": "Prove this agent made an HTTP request (NIP-98). No request is sent.",
    "input_schema": { "type": "object",
      "properties": { "url": {"type":"string"}, "method": {"type":"string"}, "body": {"type":"string"} },
      "required": ["url", "method"] }
  }
  ```
  ```ts
  async function handler({ url, method, body }) {
    const event = await createAuthEvent({ url, method, payload: body }, getAgentKey());
    return { header: toAuthHeader(event) }; // key from custody, never from input
  }
  ```
- **Direct import** (JS/TS runtimes, edge functions): just `import` and call — see the recipes above.
- **Hermes Agent plugin** (Python): `plugin.yaml` (`provides_tools: [nostrcrypto_*]`) +
  `__init__.py` (`register(ctx)` → `ctx.register_tool(name, toolset, schema, handler, emoji)`) +
  `tools.py` (`handle_<tool>(args, **kw)` returning `tool_result(...)`/`tool_error(...)`) + a
  `SKILL.md` behavioral protocol. Template:
  [`nostrkey.app.HA-python.src`](https://github.com/HumanjavaEnterprises/nostrkey.app.HA-python.src) ·
  docs: <https://loginwithnostr.com/hermes>
- **OpenClaw skill** (Python): the `*.OC-python` skill shape, installed via clawhub/PyPI. Template:
  [`nostrkey.app.OC-python.src`](https://github.com/HumanjavaEnterprises/nostrkey.app.OC-python.src) ·
  docs: <https://loginwithnostr.com/openclaw>
- **MCP server**: expose the functions as MCP tools so any MCP-capable agent can call them.

> **Cross-language note.** This package is JS/TS. For Python agent stacks, the sibling
> packages (`nostrkey`, `nostr-secure-enclave`) speak the same wire format and the same
> npub — or treat this library's source + [SKILL.md](./SKILL.md) as the spec and port the
> few functions you need. Same npub, same events, any language.

**The point: you don't adopt our format — you teach yours to speak Nostr identity.**

---

## Custody: where the agent's key lives

This package never persists or transmits keys — that's deliberate. **You** decide custody,
and the choice is a ladder:

1. **Encrypted at rest** — store the key as `ncryptsec` (NIP-49) and decrypt only to sign.
2. **Hardware-backed** — keep the key in a Nostr Secure Enclave (`nostr-secure-enclave`):
   unlock → decrypt → sign → zero.
3. **Never leaves custody** — use a NIP-46 bunker; the agent requests signatures, the key
   stays put.

`nostr-crypto-utils` is the layer below all three. The composition:

```
nostr-crypto-utils   (Level 0 — keys, signing, encryption)
        ↓
nostr-secure-enclave (hardware-backed key custody)
        ↓
nostrkey / NostrKeep (identity + sovereign storage)
        ↓
relays               (the agent's public presence)
```

## Security notes for agents

- **Never put a private key in tool input or logs.** Keys come from custody; tool inputs
  carry only the data to sign/encrypt. This package has no logging of secrets and emits no
  network traffic — there is no exfiltration surface here by design.
- **NIP-98 is short-lived.** `validateAuthEvent` enforces a `created_at` window (default
  60s) and binds `u`/`method` (and optionally a `payload` hash). Don't widen the window
  without reason.
- **Gift wraps verify authorship.** `unwrapEvent` checks the seal signature and rejects
  events where the seal author ≠ rumor author — an agent can trust who a message is from.
- **Encryption is NIP-44 v2.** Don't use the deprecated NIP-04 path for new work.
- **Verify before you act.** Treat `verifySignature` / `validateAuthEvent` as gates, not
  decorations.

## Reference

- Machine-readable map: [llms.txt](./llms.txt)
- Full API: [TypeDoc reference](https://humanjavaenterprises.github.io/nostr-crypto-utils/)
- NIP specs: https://github.com/nostr-protocol/nips
