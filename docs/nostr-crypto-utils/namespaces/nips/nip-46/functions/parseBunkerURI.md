[**nostr-crypto-utils v0.9.0**](../../../../../README.md)

***

[nostr-crypto-utils](../../../../../README.md) / [nips/nip-46](../README.md) / parseBunkerURI

# Function: parseBunkerURI()

> **parseBunkerURI**(`uri`): [`BunkerURI`](../../../../../interfaces/BunkerURI.md)

Defined in: [nips/nip-46.ts:42](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/nips/nip-46.ts#L42)

Parse a bunker:// URI into its components

## Parameters

### uri

`string`

bunker://&lt;remote-pubkey&gt;?relay=...&secret=...

## Returns

[`BunkerURI`](../../../../../interfaces/BunkerURI.md)

Parsed BunkerURI or throws on invalid input
