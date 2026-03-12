# nostr-crypto-utils TODO

## Bugs

- [ ] **`finalizeEvent` treats kind 0 as falsy** — `src/crypto.ts:282` uses `event.kind || 1` which coerces kind `0` (SET_METADATA) to `1` (TEXT_NOTE). Fix: use `event.kind ?? 1` or `event.kind !== undefined ? event.kind : 1`. Same issue on line 279 with `created_at` (`event.created_at || ...` would treat timestamp `0` as falsy, though unlikely in practice). Found while building `@nse-dev/server` which signs kind 0 profile events.
