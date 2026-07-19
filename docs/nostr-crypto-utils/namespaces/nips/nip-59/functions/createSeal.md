[**nostr-crypto-utils v0.9.0**](../../../../../README.md)

***

[nostr-crypto-utils](../../../../../README.md) / [nips/nip-59](../README.md) / createSeal

# Function: createSeal()

> **createSeal**(`rumor`, `senderPrivateKey`, `recipientPublicKey`): `Promise`\<[`SignedNostrEvent`](../../../../../interfaces/SignedNostrEvent.md)\>

Defined in: nips/nip-59.ts:66

Seal a rumor (`kind 13`): NIP-44-encrypt the rumor to the recipient and sign
with the sender's real key. Tags are always empty; no `p` tag is added.

## Parameters

### rumor

[`Rumor`](../interfaces/Rumor.md)

### senderPrivateKey

`string` \| `Uint8Array`\<`ArrayBufferLike`\>

### recipientPublicKey

`string`

## Returns

`Promise`\<[`SignedNostrEvent`](../../../../../interfaces/SignedNostrEvent.md)\>
