[**nostr-crypto-utils v0.9.0**](../../../../../README.md)

***

[nostr-crypto-utils](../../../../../README.md) / [nips/nip-46](../README.md) / wrapEvent

# Function: wrapEvent()

> **wrapEvent**(`payload`, `session`, `recipientPubkey`): `Promise`\<[`SignedNostrEvent`](../../../../../interfaces/SignedNostrEvent.md)\>

Defined in: [nips/nip-46.ts:224](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/nips/nip-46.ts#L224)

Encrypt and wrap a NIP-46 payload into a kind 24133 signed event

## Parameters

### payload

[`Nip46Request`](../../../../../interfaces/Nip46Request.md) \| [`Nip46Response`](../../../../../interfaces/Nip46Response.md)

JSON-RPC request or response to encrypt

### session

[`Nip46Session`](../../../../../interfaces/Nip46Session.md)

NIP-46 session

### recipientPubkey

`string`

The recipient's pubkey (hex)

## Returns

`Promise`\<[`SignedNostrEvent`](../../../../../interfaces/SignedNostrEvent.md)\>

Signed kind 24133 event
