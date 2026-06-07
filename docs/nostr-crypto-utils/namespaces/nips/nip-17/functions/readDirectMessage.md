[**nostr-crypto-utils v0.9.0**](../../../../../README.md)

***

[nostr-crypto-utils](../../../../../README.md) / [nips/nip-17](../README.md) / readDirectMessage

# Function: readDirectMessage()

> **readDirectMessage**(`giftWrap`, `recipientPrivateKey`): `Promise`\<[`Rumor`](../../nip-59/interfaces/Rumor.md)\>

Defined in: nips/nip-17.ts:120

Unwrap a received `kind 1059` gift wrap into its `kind 14` chat rumor.
Verifies the seal signature and author binding (via NIP-59).

## Parameters

### giftWrap

[`SignedNostrEvent`](../../../../../interfaces/SignedNostrEvent.md)

### recipientPrivateKey

`string` \| `Uint8Array`\<`ArrayBufferLike`\>

## Returns

`Promise`\<[`Rumor`](../../nip-59/interfaces/Rumor.md)\>

## Example

```ts
import { readDirectMessage } from 'nostr-crypto-utils/nip17';

const message = await readDirectMessage(receivedGiftWrap, recipientPrivkeyHex);
// message.kind === 14, message.content, message.pubkey (verified sender)
```
