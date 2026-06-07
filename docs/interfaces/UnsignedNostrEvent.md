[**nostr-crypto-utils v0.9.0**](../README.md)

***

[nostr-crypto-utils](../README.md) / UnsignedNostrEvent

# Interface: UnsignedNostrEvent

Defined in: [types/base.ts:65](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/types/base.ts#L65)

Interface for events that haven't been signed yet

## Extends

- `BaseNostrEvent`

## Properties

### content

> **content**: `string`

Defined in: [types/base.ts:57](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/types/base.ts#L57)

Content of the event

#### Inherited from

`BaseNostrEvent.content`

***

### created\_at

> **created\_at**: `number`

Defined in: [types/base.ts:61](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/types/base.ts#L61)

Unix timestamp in seconds

#### Inherited from

`BaseNostrEvent.created_at`

***

### kind

> **kind**: `number`

Defined in: [types/base.ts:55](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/types/base.ts#L55)

Event kind as defined in NIPs

#### Inherited from

`BaseNostrEvent.kind`

***

### pubkey?

> `optional` **pubkey?**: `string`

Defined in: [types/base.ts:67](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/types/base.ts#L67)

Optional public key

***

### tags

> **tags**: `string`[][]

Defined in: [types/base.ts:59](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/types/base.ts#L59)

Array of tags

#### Inherited from

`BaseNostrEvent.tags`
