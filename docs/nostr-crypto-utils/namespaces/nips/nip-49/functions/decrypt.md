[**nostr-crypto-utils v0.9.0**](../../../../../README.md)

***

[nostr-crypto-utils](../../../../../README.md) / [nips/nip-49](../README.md) / decrypt

# Function: decrypt()

> **decrypt**(`ncryptsec`, `password`): `Uint8Array`

Defined in: [nips/nip-49.ts:55](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/nips/nip-49.ts#L55)

Decrypt an ncryptsec bech32 string back to the 32-byte secret key

## Parameters

### ncryptsec

`string`

bech32-encoded ncryptsec string

### password

`string`

Password used for encryption

## Returns

`Uint8Array`

32-byte secret key as Uint8Array
