[**nostr-crypto-utils v0.9.0**](../../../../../README.md)

***

[nostr-crypto-utils](../../../../../README.md) / [nips/nip-46](../README.md) / createResponse

# Function: createResponse()

> **createResponse**(`id`, `result?`, `error?`): [`Nip46Response`](../../../../../interfaces/Nip46Response.md)

Defined in: [nips/nip-46.ts:181](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/nips/nip-46.ts#L181)

Create a NIP-46 JSON-RPC response

## Parameters

### id

`string`

Request ID being responded to

### result?

`string`

Result string (on success)

### error?

`string`

Error string (on failure)

## Returns

[`Nip46Response`](../../../../../interfaces/Nip46Response.md)

JSON-RPC response object
