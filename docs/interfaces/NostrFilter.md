[**nostr-crypto-utils v0.4.1**](../README.md)

***

[nostr-crypto-utils](../README.md) / NostrFilter

# Interface: NostrFilter

Filter for Nostr events

## See

https://github.com/nostr-protocol/nips/blob/master/01.md

## Indexable

 \[`key`: \`#$\{string\}\`\]: `undefined` \| `string`[]

## Properties

### #e?

> `optional` **#e**: `string`[]

Filter by event references

#### Defined in

[types/base.ts:134](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/9c160331e9485dc52c520a832e977c4e54bbdc89/src/types/base.ts#L134)

***

### #p?

> `optional` **#p**: `string`[]

Filter by pubkey references

#### Defined in

[types/base.ts:136](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/9c160331e9485dc52c520a832e977c4e54bbdc89/src/types/base.ts#L136)

***

### authors?

> `optional` **authors**: `string`[]

Filter by author public keys

#### Defined in

[types/base.ts:124](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/9c160331e9485dc52c520a832e977c4e54bbdc89/src/types/base.ts#L124)

***

### ids?

> `optional` **ids**: `string`[]

Filter by event IDs

#### Defined in

[types/base.ts:122](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/9c160331e9485dc52c520a832e977c4e54bbdc89/src/types/base.ts#L122)

***

### kinds?

> `optional` **kinds**: [`NostrEventKind`](../enumerations/NostrEventKind.md)[]

Filter by event kinds

#### Defined in

[types/base.ts:126](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/9c160331e9485dc52c520a832e977c4e54bbdc89/src/types/base.ts#L126)

***

### limit?

> `optional` **limit**: `number`

Limit number of results

#### Defined in

[types/base.ts:132](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/9c160331e9485dc52c520a832e977c4e54bbdc89/src/types/base.ts#L132)

***

### search?

> `optional` **search**: `string`

Full-text search query

#### Defined in

[types/base.ts:140](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/9c160331e9485dc52c520a832e977c4e54bbdc89/src/types/base.ts#L140)

***

### since?

> `optional` **since**: `number`

Filter by start timestamp

#### Defined in

[types/base.ts:128](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/9c160331e9485dc52c520a832e977c4e54bbdc89/src/types/base.ts#L128)

***

### until?

> `optional` **until**: `number`

Filter by end timestamp

#### Defined in

[types/base.ts:130](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/9c160331e9485dc52c520a832e977c4e54bbdc89/src/types/base.ts#L130)
