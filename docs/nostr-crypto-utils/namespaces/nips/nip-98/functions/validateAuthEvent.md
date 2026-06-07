[**nostr-crypto-utils v0.9.0**](../../../../../README.md)

***

[nostr-crypto-utils](../../../../../README.md) / [nips/nip-98](../README.md) / validateAuthEvent

# Function: validateAuthEvent()

> **validateAuthEvent**(`event`, `params`): `Promise`\<[`AuthValidationResult`](../interfaces/AuthValidationResult.md)\>

Defined in: nips/nip-98.ts:139

Validate a NIP-98 auth event against the request it claims to authorize.
Performs the spec's ordered checks (kind, created_at window, `u`, `method`,
optional `payload`) and finally verifies the signature.

## Parameters

### event

[`SignedNostrEvent`](../../../../../interfaces/SignedNostrEvent.md)

### params

[`ValidateAuthParams`](../interfaces/ValidateAuthParams.md)

## Returns

`Promise`\<[`AuthValidationResult`](../interfaces/AuthValidationResult.md)\>

## Example

```ts
import { fromAuthHeader, validateAuthEvent } from 'nostr-crypto-utils/nip98';

// In a Cloudflare Worker handler:
const event = fromAuthHeader(request.headers.get('Authorization'));
const result = await validateAuthEvent(event, {
  url: request.url,
  method: request.method,
  body: await request.text(), // optional; checks the payload tag when present
});
if (!result.valid) return new Response(result.reason, { status: 401 });
const authedPubkey = event.pubkey;
```
