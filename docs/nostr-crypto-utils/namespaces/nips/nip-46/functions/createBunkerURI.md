[**nostr-crypto-utils v0.9.0**](../../../../../README.md)

***

[nostr-crypto-utils](../../../../../README.md) / [nips/nip-46](../README.md) / createBunkerURI

# Function: createBunkerURI()

> **createBunkerURI**(`remotePubkey`, `relays`, `secret?`): `string`

Defined in: [nips/nip-46.ts:71](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/nips/nip-46.ts#L71)

Create a bunker:// URI string

## Parameters

### remotePubkey

`string`

Remote signer's public key (hex)

### relays

`string`[]

Relay URLs

### secret?

`string`

Optional connection secret

## Returns

`string`

bunker:// URI string
