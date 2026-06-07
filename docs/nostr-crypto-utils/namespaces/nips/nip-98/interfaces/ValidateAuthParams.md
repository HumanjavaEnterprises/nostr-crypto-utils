[**nostr-crypto-utils v0.9.0**](../../../../../README.md)

***

[nostr-crypto-utils](../../../../../README.md) / [nips/nip-98](../README.md) / ValidateAuthParams

# Interface: ValidateAuthParams

Defined in: nips/nip-98.ts:93

Parameters for [validateAuthEvent](../functions/validateAuthEvent.md).

## Properties

### body?

> `optional` **body?**: `string` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: nips/nip-98.ts:99

Request body, if any — validated against the `payload` tag when present.

***

### maxAgeSeconds?

> `optional` **maxAgeSeconds?**: `number`

Defined in: nips/nip-98.ts:101

Allowed clock skew in seconds (default 60, per the NIP suggestion).

***

### method

> **method**: `string`

Defined in: nips/nip-98.ts:97

HTTP method the server actually received.

***

### now?

> `optional` **now?**: `number`

Defined in: nips/nip-98.ts:105

Override "now" (unix seconds) — for testing.

***

### requirePayload?

> `optional` **requirePayload?**: `boolean`

Defined in: nips/nip-98.ts:103

Require a matching `payload` tag whenever `body` is provided (default false).

***

### url

> **url**: `string`

Defined in: nips/nip-98.ts:95

Absolute request URL the server actually received.
