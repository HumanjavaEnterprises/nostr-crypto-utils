[**nostr-crypto-utils v0.9.0**](../../../../../README.md)

***

[nostr-crypto-utils](../../../../../README.md) / [nips/nip-59](../README.md) / createRumor

# Function: createRumor()

> **createRumor**(`event`, `senderPubkey`): `Promise`\<[`Rumor`](../interfaces/Rumor.md)\>

Defined in: nips/nip-59.ts:47

Build a rumor (unsigned event with a computed `id`) authored by `senderPubkey`.

## Parameters

### event

`Partial`\<[`NostrEvent`](../../../../../interfaces/NostrEvent.md)\>

### senderPubkey

`string`

## Returns

`Promise`\<[`Rumor`](../interfaces/Rumor.md)\>
