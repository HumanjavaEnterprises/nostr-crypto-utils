[**nostr-crypto-utils v0.9.0**](../README.md)

***

[nostr-crypto-utils](../README.md) / finalizeEvent

# Function: finalizeEvent()

> **finalizeEvent**(`event`, `privateKey`): `Promise`\<[`SignedNostrEvent`](../interfaces/SignedNostrEvent.md)\>

Defined in: [crypto.ts:274](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/crypto.ts#L274)

Creates, hashes, and signs a Nostr event in one step

## Parameters

### event

`Partial`\<[`NostrEvent`](../interfaces/NostrEvent.md)\>

Partial event (kind, content, tags required; pubkey derived if missing)

### privateKey

`string` \| `Uint8Array`\<`ArrayBufferLike`\>

Private key as hex string or Uint8Array

## Returns

`Promise`\<[`SignedNostrEvent`](../interfaces/SignedNostrEvent.md)\>

Fully signed event with id, pubkey, and sig
