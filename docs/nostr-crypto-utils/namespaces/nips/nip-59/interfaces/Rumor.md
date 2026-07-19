[**nostr-crypto-utils v0.9.0**](../../../../../README.md)

***

[nostr-crypto-utils](../../../../../README.md) / [nips/nip-59](../README.md) / Rumor

# Interface: Rumor

Defined in: nips/nip-59.ts:25

A rumor: an unsigned event (no `sig`) carrying a computed `id`.

## Extends

- [`NostrEvent`](../../../../../interfaces/NostrEvent.md)

## Properties

### content

> **content**: `string`

Defined in: [types/index.ts:20](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/types/index.ts#L20)

#### Inherited from

[`NostrEvent`](../../../../../interfaces/NostrEvent.md).[`content`](../../../../../interfaces/NostrEvent.md#content)

***

### created\_at

> **created\_at**: `number`

Defined in: [types/index.ts:18](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/types/index.ts#L18)

#### Inherited from

[`NostrEvent`](../../../../../interfaces/NostrEvent.md).[`created_at`](../../../../../interfaces/NostrEvent.md#created_at)

***

### id

> **id**: `string`

Defined in: nips/nip-59.ts:27

Event id (sha256 of the serialized event) — present even though unsigned.

***

### kind

> **kind**: `number`

Defined in: [types/index.ts:17](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/types/index.ts#L17)

#### Inherited from

[`NostrEvent`](../../../../../interfaces/NostrEvent.md).[`kind`](../../../../../interfaces/NostrEvent.md#kind)

***

### pubkey

> **pubkey**: `string`

Defined in: [types/index.ts:21](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/types/index.ts#L21)

#### Inherited from

[`NostrEvent`](../../../../../interfaces/NostrEvent.md).[`pubkey`](../../../../../interfaces/NostrEvent.md#pubkey)

***

### tags

> **tags**: `string`[][]

Defined in: [types/index.ts:19](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/types/index.ts#L19)

#### Inherited from

[`NostrEvent`](../../../../../interfaces/NostrEvent.md).[`tags`](../../../../../interfaces/NostrEvent.md#tags)
