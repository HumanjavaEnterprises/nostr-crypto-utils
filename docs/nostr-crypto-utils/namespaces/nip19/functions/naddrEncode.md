[**nostr-crypto-utils v0.9.0**](../../../../README.md)

***

[nostr-crypto-utils](../../../../README.md) / [nip19](../README.md) / naddrEncode

# Function: naddrEncode()

> **naddrEncode**(`pubkey`, `kind`, `identifier`, `relays?`): `string`

Defined in: [nips/nip-19.ts:139](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/nips/nip-19.ts#L139)

Encode an address (NIP-33)

## Parameters

### pubkey

`string`

Author's public key

### kind

`number`

Event kind

### identifier

`string`

String identifier

### relays?

`string`[]

Optional relay URLs

## Returns

`string`

bech32-encoded naddr string

## Throws

If parameters are invalid
