[**nostr-crypto-utils v0.9.0**](../../../../../README.md)

***

[nostr-crypto-utils](../../../../../README.md) / [nips/nip-59](../README.md) / wrapEvent

# Function: wrapEvent()

> **wrapEvent**(`rumor`, `senderPrivateKey`, `recipientPublicKey`, `opts?`): `Promise`\<[`SignedNostrEvent`](../../../../../interfaces/SignedNostrEvent.md)\>

Defined in: nips/nip-59.ts:118

Full wrap for one recipient: rumor → seal → gift wrap.

## Parameters

### rumor

[`Rumor`](../interfaces/Rumor.md)

### senderPrivateKey

`string` \| `Uint8Array`\<`ArrayBufferLike`\>

### recipientPublicKey

`string`

### opts?

[`GiftWrapOptions`](../interfaces/GiftWrapOptions.md) = `{}`

## Returns

`Promise`\<[`SignedNostrEvent`](../../../../../interfaces/SignedNostrEvent.md)\>

## Example

```ts
import { createRumor, wrapEvent } from 'nostr-crypto-utils/nip59';

const rumor = await createRumor({ kind: 1, content: 'hello' }, senderPubkeyHex);
const giftWrap = await wrapEvent(rumor, senderPrivkeyHex, recipientPubkeyHex);
// giftWrap.kind === 1059, signed by a random one-time key, p-tagged to recipient
```
