[**nostr-crypto-utils v0.4.1**](../README.md)

***

[nostr-crypto-utils](../README.md) / SignedNostrEvent

# Interface: SignedNostrEvent

Signed Nostr event interface, extends NostrEvent with signature

## See

https://github.com/nostr-protocol/nips/blob/master/01.md

## Extends

- [`NostrEvent`](NostrEvent.md)

## Properties

### content

> **content**: `string`

Content of the event

#### Inherited from

[`NostrEvent`](NostrEvent.md).[`content`](NostrEvent.md#content)

#### Defined in

[types/base.ts:86](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/9c160331e9485dc52c520a832e977c4e54bbdc89/src/types/base.ts#L86)

***

### created\_at

> **created\_at**: `number`

Unix timestamp in seconds

#### Inherited from

[`NostrEvent`](NostrEvent.md).[`created_at`](NostrEvent.md#created_at)

#### Defined in

[types/base.ts:90](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/9c160331e9485dc52c520a832e977c4e54bbdc89/src/types/base.ts#L90)

***

### id

> **id**: `string`

Event ID (32-bytes sha256 of the serialized event data)

#### Defined in

[types/base.ts:101](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/9c160331e9485dc52c520a832e977c4e54bbdc89/src/types/base.ts#L101)

***

### kind

> **kind**: [`NostrEventKind`](../enumerations/NostrEventKind.md)

Event kind as defined in NIPs

#### Inherited from

[`NostrEvent`](NostrEvent.md).[`kind`](NostrEvent.md#kind)

#### Defined in

[types/base.ts:84](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/9c160331e9485dc52c520a832e977c4e54bbdc89/src/types/base.ts#L84)

***

### pubkey

> **pubkey**: `string`

Public key of the event creator in hex format

#### Inherited from

[`NostrEvent`](NostrEvent.md).[`pubkey`](NostrEvent.md#pubkey)

#### Defined in

[types/base.ts:92](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/9c160331e9485dc52c520a832e977c4e54bbdc89/src/types/base.ts#L92)

***

### sig

> **sig**: `string`

Schnorr signature of the event ID

#### Defined in

[types/base.ts:103](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/9c160331e9485dc52c520a832e977c4e54bbdc89/src/types/base.ts#L103)

***

### tags

> **tags**: `string`[][]

Array of tags associated with the event

#### Inherited from

[`NostrEvent`](NostrEvent.md).[`tags`](NostrEvent.md#tags)

#### Defined in

[types/base.ts:88](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/9c160331e9485dc52c520a832e977c4e54bbdc89/src/types/base.ts#L88)
