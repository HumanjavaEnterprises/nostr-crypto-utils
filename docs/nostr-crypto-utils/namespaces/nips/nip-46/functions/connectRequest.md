[**nostr-crypto-utils v0.9.0**](../../../../../README.md)

***

[nostr-crypto-utils](../../../../../README.md) / [nips/nip-46](../README.md) / connectRequest

# Function: connectRequest()

> **connectRequest**(`remotePubkey`, `secret?`, `permissions?`): [`Nip46Request`](../../../../../interfaces/Nip46Request.md)

Defined in: [nips/nip-46.ts:288](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/nips/nip-46.ts#L288)

Create a 'connect' request

## Parameters

### remotePubkey

`string`

Remote signer's pubkey

### secret?

`string`

Optional connection secret from bunker URI

### permissions?

`string`

Optional comma-separated permission string

## Returns

[`Nip46Request`](../../../../../interfaces/Nip46Request.md)
