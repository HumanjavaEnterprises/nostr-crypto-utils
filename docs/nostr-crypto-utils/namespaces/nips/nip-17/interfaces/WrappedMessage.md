[**nostr-crypto-utils v0.9.0**](../../../../../README.md)

***

[nostr-crypto-utils](../../../../../README.md) / [nips/nip-17](../README.md) / WrappedMessage

# Interface: WrappedMessage

Defined in: nips/nip-17.ts:38

A gift-wrapped copy addressed to a single party (returned by [createDirectMessage](../functions/createDirectMessage.md)).

## Properties

### giftWrap

> **giftWrap**: [`SignedNostrEvent`](../../../../../interfaces/SignedNostrEvent.md)

Defined in: nips/nip-17.ts:42

The `kind 1059` gift wrap event, ready to publish.

***

### recipient

> **recipient**: `string`

Defined in: nips/nip-17.ts:40

The pubkey this gift wrap is addressed to.
