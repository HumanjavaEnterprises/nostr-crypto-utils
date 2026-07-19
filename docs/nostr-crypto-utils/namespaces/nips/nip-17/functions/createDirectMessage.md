[**nostr-crypto-utils v0.9.0**](../../../../../README.md)

***

[nostr-crypto-utils](../../../../../README.md) / [nips/nip-17](../README.md) / createDirectMessage

# Function: createDirectMessage()

> **createDirectMessage**(`senderPrivateKey`, `params`): `Promise`\<[`WrappedMessage`](../interfaces/WrappedMessage.md)[]\>

Defined in: nips/nip-17.ts:90

Create gift-wrapped direct messages: one wrap per recipient **plus** one
addressed to the sender (their own readable copy), per NIP-17. Publish each
`giftWrap` to the corresponding party's DM inbox relays (NIP-17 `kind 10050`).

## Parameters

### senderPrivateKey

`string` \| `Uint8Array`\<`ArrayBufferLike`\>

### params

[`DirectMessageParams`](../interfaces/DirectMessageParams.md)

## Returns

`Promise`\<[`WrappedMessage`](../interfaces/WrappedMessage.md)[]\>

## Example

```ts
import { createDirectMessage } from 'nostr-crypto-utils/nip17';

const wraps = await createDirectMessage(senderPrivkeyHex, {
  content: 'hey bob',
  recipients: [bobPubkeyHex],
  subject: 'dinner', // optional
});
for (const { recipient, giftWrap } of wraps) {
  // publish giftWrap to `recipient`'s DM inbox relays
}
```
