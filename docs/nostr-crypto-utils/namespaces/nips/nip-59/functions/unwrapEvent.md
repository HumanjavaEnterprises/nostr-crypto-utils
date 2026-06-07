[**nostr-crypto-utils v0.9.0**](../../../../../README.md)

***

[nostr-crypto-utils](../../../../../README.md) / [nips/nip-59](../README.md) / unwrapEvent

# Function: unwrapEvent()

> **unwrapEvent**(`giftWrap`, `recipientPrivateKey`): `Promise`\<[`Rumor`](../interfaces/Rumor.md)\>

Defined in: nips/nip-59.ts:141

Unwrap a gift wrap with the recipient's key, returning the inner rumor.
Verifies the seal signature and enforces that the seal author equals the
rumor author (anti-impersonation, per NIP-17/59).

## Parameters

### giftWrap

[`SignedNostrEvent`](../../../../../interfaces/SignedNostrEvent.md)

### recipientPrivateKey

`string` \| `Uint8Array`\<`ArrayBufferLike`\>

## Returns

`Promise`\<[`Rumor`](../interfaces/Rumor.md)\>

## Throws

if the seal is missing/invalid or the author binding fails.

## Example

```ts
import { unwrapEvent } from 'nostr-crypto-utils/nip59';

const rumor = await unwrapEvent(giftWrap, recipientPrivkeyHex);
// rumor.content / rumor.kind / rumor.pubkey (the verified author)
```
