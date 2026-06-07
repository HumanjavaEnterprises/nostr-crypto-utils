[**nostr-crypto-utils v0.9.0**](../../../../../README.md)

***

[nostr-crypto-utils](../../../../../README.md) / [nips/nip-17](../README.md) / createChatRumor

# Function: createChatRumor()

> **createChatRumor**(`senderPubkey`, `params`): `Promise`\<[`Rumor`](../../nip-59/interfaces/Rumor.md)\>

Defined in: nips/nip-17.ts:49

Build the unsigned `kind 14` (or 15) chat rumor for a room.
The room is defined by the sender + the set of recipient `p` tags.

## Parameters

### senderPubkey

`string`

### params

[`DirectMessageParams`](../interfaces/DirectMessageParams.md)

## Returns

`Promise`\<[`Rumor`](../../nip-59/interfaces/Rumor.md)\>
