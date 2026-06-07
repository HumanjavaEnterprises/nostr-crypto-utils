[**nostr-crypto-utils v0.9.0**](../../../../../README.md)

***

[nostr-crypto-utils](../../../../../README.md) / [nips/nip-46](../README.md) / unwrapEvent

# Function: unwrapEvent()

> **unwrapEvent**(`event`, `session`): [`Nip46Request`](../../../../../interfaces/Nip46Request.md) \| [`Nip46Response`](../../../../../interfaces/Nip46Response.md)

Defined in: [nips/nip-46.ts:268](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/nips/nip-46.ts#L268)

Decrypt and parse a kind 24133 event

## Parameters

### event

[`SignedNostrEvent`](../../../../../interfaces/SignedNostrEvent.md)

Signed kind 24133 event

### session

[`Nip46Session`](../../../../../interfaces/Nip46Session.md)

NIP-46 session

## Returns

[`Nip46Request`](../../../../../interfaces/Nip46Request.md) \| [`Nip46Response`](../../../../../interfaces/Nip46Response.md)

Decrypted JSON-RPC request or response
