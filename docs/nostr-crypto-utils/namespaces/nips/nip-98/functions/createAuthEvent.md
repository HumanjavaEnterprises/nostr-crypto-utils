[**nostr-crypto-utils v0.9.0**](../../../../../README.md)

***

[nostr-crypto-utils](../../../../../README.md) / [nips/nip-98](../README.md) / createAuthEvent

# Function: createAuthEvent()

> **createAuthEvent**(`params`, `privateKey`): `Promise`\<[`SignedNostrEvent`](../../../../../interfaces/SignedNostrEvent.md)\>

Defined in: nips/nip-98.ts:59

Build and sign a NIP-98 `kind 27235` auth event.

## Parameters

### params

[`CreateAuthEventParams`](../interfaces/CreateAuthEventParams.md)

### privateKey

`string` \| `Uint8Array`\<`ArrayBufferLike`\>

## Returns

`Promise`\<[`SignedNostrEvent`](../../../../../interfaces/SignedNostrEvent.md)\>

the signed event (encode it for transport with [toAuthHeader](toAuthHeader.md)).

## Example

```ts
import { createAuthEvent, toAuthHeader } from 'nostr-crypto-utils/nip98';

const event = await createAuthEvent(
  { url: 'https://api.example.com/v1/me', method: 'GET' },
  privateKeyHex,
);
await fetch('https://api.example.com/v1/me', {
  headers: { Authorization: toAuthHeader(event) },
});
```
