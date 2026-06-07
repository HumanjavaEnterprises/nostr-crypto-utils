[**nostr-crypto-utils v0.9.0**](../../../../../README.md)

***

[nostr-crypto-utils](../../../../../README.md) / [nips/nip-46](../README.md) / createRequestFilter

# Function: createRequestFilter()

> **createRequestFilter**(`signerPubkey`, `since?`): `object`

Defined in: [nips/nip-46.ts:383](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/nips/nip-46.ts#L383)

Create a Nostr filter for subscribing to NIP-46 request events (server-side)

## Parameters

### signerPubkey

`string`

The signer's public key (hex)

### since?

`number`

Optional since timestamp

## Returns

`object`

Filter object for kind 24133 events tagged to the signer

### #p

> **#p**: `string`[]

### kinds

> **kinds**: `number`[]

### since?

> `optional` **since?**: `number`
