[**nostr-crypto-utils v0.9.0**](../../../../../README.md)

***

[nostr-crypto-utils](../../../../../README.md) / [nips/nip-46](../README.md) / createRequest

# Function: createRequest()

> **createRequest**(`method`, `params`, `id?`): [`Nip46Request`](../../../../../interfaces/Nip46Request.md)

Defined in: [nips/nip-46.ts:166](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/nips/nip-46.ts#L166)

Create a NIP-46 JSON-RPC request

## Parameters

### method

`string`

RPC method name

### params

`string`[]

Array of string parameters

### id?

`string`

Optional request ID (random if not provided)

## Returns

[`Nip46Request`](../../../../../interfaces/Nip46Request.md)

JSON-RPC request object
