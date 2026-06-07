[**nostr-crypto-utils v0.9.0**](../../../../../README.md)

***

[nostr-crypto-utils](../../../../../README.md) / [nips/nip-17](../README.md) / DirectMessageParams

# Interface: DirectMessageParams

Defined in: nips/nip-17.ts:20

Parameters for [createDirectMessage](../functions/createDirectMessage.md) / [createChatRumor](../functions/createChatRumor.md).

## Properties

### content

> **content**: `string`

Defined in: nips/nip-17.ts:22

Plain-text message body.

***

### created\_at?

> `optional` **created\_at?**: `number`

Defined in: nips/nip-17.ts:34

Override created_at (unix seconds) on the rumor; defaults to now.

***

### kind?

> `optional` **kind?**: `number`

Defined in: nips/nip-17.ts:32

Rumor kind (default 14; use 15 for file messages).

***

### recipients

> **recipients**: `string`[]

Defined in: nips/nip-17.ts:24

Recipient pubkeys (hex). One for a 1:1 chat; more for a group room.

***

### relayUrl?

> `optional` **relayUrl?**: `string`

Defined in: nips/nip-17.ts:26

Optional relay URL hint placed on `p` tags.

***

### replyTo?

> `optional` **replyTo?**: `string`

Defined in: nips/nip-17.ts:28

Event id this message replies to (adds an `e` tag).

***

### subject?

> `optional` **subject?**: `string`

Defined in: nips/nip-17.ts:30

Conversation subject/topic (adds a `subject` tag).
