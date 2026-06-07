[**nostr-crypto-utils v0.9.0**](../../../../README.md)

***

[nostr-crypto-utils](../../../../README.md) / [nip19](../README.md) / neventEncode

# Function: neventEncode()

> **neventEncode**(`eventId`, `relays?`, `author?`, `kind?`): `string`

Defined in: [nips/nip-19.ts:103](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/nips/nip-19.ts#L103)

Encode event information

## Parameters

### eventId

`string`

Event ID in hex format

### relays?

`string`[]

Optional relay URLs

### author?

`string`

Optional author public key

### kind?

`number`

Optional event kind

## Returns

`string`

bech32-encoded nevent string

## Throws

If parameters are invalid
