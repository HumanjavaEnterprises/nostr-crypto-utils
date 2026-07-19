[**nostr-crypto-utils v0.9.0**](../../../../../README.md)

***

[nostr-crypto-utils](../../../../../README.md) / [nips/nip-46](../README.md) / createResponseFilter

# Function: createResponseFilter()

> **createResponseFilter**(`clientPubkey`, `since?`): `object`

Defined in: [nips/nip-46.ts:363](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/nips/nip-46.ts#L363)

Create a Nostr filter for subscribing to NIP-46 response events

## Parameters

### clientPubkey

`string`

Our ephemeral public key (hex)

### since?

`number`

Optional since timestamp

## Returns

`object`

Filter object for kind 24133 events tagged to us

### #p

> **#p**: `string`[]

### kinds

> **kinds**: `number`[]

### since?

> `optional` **since?**: `number`
