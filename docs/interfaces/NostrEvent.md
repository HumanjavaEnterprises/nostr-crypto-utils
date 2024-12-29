[**nostr-crypto-utils v0.4.1**](../README.md)

***

[nostr-crypto-utils](../README.md) / NostrEvent

# Interface: NostrEvent

Basic Nostr event interface

## See

https://github.com/nostr-protocol/nips/blob/master/01.md

## Extended by

- [`SignedNostrEvent`](SignedNostrEvent.md)

## Properties

### content

> **content**: `string`

Content of the event

#### Defined in

[types/base.ts:86](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/9c160331e9485dc52c520a832e977c4e54bbdc89/src/types/base.ts#L86)

***

### created\_at

> **created\_at**: `number`

Unix timestamp in seconds

#### Defined in

[types/base.ts:90](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/9c160331e9485dc52c520a832e977c4e54bbdc89/src/types/base.ts#L90)

***

### kind

> **kind**: [`NostrEventKind`](../enumerations/NostrEventKind.md)

Event kind as defined in NIPs

#### Defined in

[types/base.ts:84](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/9c160331e9485dc52c520a832e977c4e54bbdc89/src/types/base.ts#L84)

***

### pubkey

> **pubkey**: `string`

Public key of the event creator in hex format

#### Defined in

[types/base.ts:92](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/9c160331e9485dc52c520a832e977c4e54bbdc89/src/types/base.ts#L92)

***

### tags

> **tags**: `string`[][]

Array of tags associated with the event

#### Defined in

[types/base.ts:88](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/9c160331e9485dc52c520a832e977c4e54bbdc89/src/types/base.ts#L88)
