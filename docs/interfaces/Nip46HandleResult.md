[**nostr-crypto-utils v0.9.0**](../README.md)

***

[nostr-crypto-utils](../README.md) / Nip46HandleResult

# Interface: Nip46HandleResult

Defined in: [types/nip46.ts:120](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/types/nip46.ts#L120)

Result of handleSignerRequest()

## Properties

### newlyAuthenticated?

> `optional` **newlyAuthenticated?**: `string`

Defined in: [types/nip46.ts:124](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/types/nip46.ts#L124)

If the connect handshake succeeded, this is the client pubkey to add to authenticated set

***

### response

> **response**: [`Nip46Response`](Nip46Response.md)

Defined in: [types/nip46.ts:122](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/types/nip46.ts#L122)

The response to send back to the client
