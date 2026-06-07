[**nostr-crypto-utils v0.9.0**](../../../../../README.md)

***

[nostr-crypto-utils](../../../../../README.md) / [nips/nip-98](../README.md) / CreateAuthEventParams

# Interface: CreateAuthEventParams

Defined in: nips/nip-98.ts:32

Parameters for [createAuthEvent](../functions/createAuthEvent.md).

## Properties

### created\_at?

> `optional` **created\_at?**: `number`

Defined in: nips/nip-98.ts:40

Override created_at (unix seconds); defaults to now.

***

### method

> **method**: `string`

Defined in: nips/nip-98.ts:36

HTTP method (GET, POST, …).

***

### payload?

> `optional` **payload?**: `string` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: nips/nip-98.ts:38

Request body, if any — hashed into a `payload` tag (POST/PUT/PATCH).

***

### url

> **url**: `string`

Defined in: nips/nip-98.ts:34

Absolute request URL, including query string.
