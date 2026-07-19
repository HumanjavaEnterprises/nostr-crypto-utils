[**nostr-crypto-utils v0.9.0**](../README.md)

***

[nostr-crypto-utils](../README.md) / Nip46UnwrapResult

# Interface: Nip46UnwrapResult

Defined in: [types/nip46.ts:130](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/types/nip46.ts#L130)

Result of unwrapRequest()

## Properties

### clientPubkey

> **clientPubkey**: `string`

Defined in: [types/nip46.ts:134](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/types/nip46.ts#L134)

The client's pubkey (from event.pubkey)

***

### conversationKey

> **conversationKey**: `Uint8Array`

Defined in: [types/nip46.ts:136](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/types/nip46.ts#L136)

NIP-44 conversation key (reuse for wrapResponse)

***

### request

> **request**: [`Nip46Request`](Nip46Request.md)

Defined in: [types/nip46.ts:132](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/types/nip46.ts#L132)

The decrypted request
