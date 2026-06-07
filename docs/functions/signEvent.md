[**nostr-crypto-utils v0.9.0**](../README.md)

***

[nostr-crypto-utils](../README.md) / signEvent

# Function: signEvent()

> **signEvent**(`event`, `privateKey`): `Promise`\<[`SignedNostrEvent`](../interfaces/SignedNostrEvent.md)\>

Defined in: [crypto.ts:222](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/crypto.ts#L222)

Signs an event

## Parameters

### event

[`NostrEvent`](../interfaces/NostrEvent.md)

Event to sign

### privateKey

`string` \| `Uint8Array`\<`ArrayBufferLike`\>

Private key as hex string or Uint8Array

## Returns

`Promise`\<[`SignedNostrEvent`](../interfaces/SignedNostrEvent.md)\>
