[**nostr-crypto-utils v0.9.0**](../../../../../README.md)

***

[nostr-crypto-utils](../../../../../README.md) / [nips/nip-59](../README.md) / createGiftWrap

# Function: createGiftWrap()

> **createGiftWrap**(`seal`, `recipientPublicKey`, `opts?`): `Promise`\<[`SignedNostrEvent`](../../../../../interfaces/SignedNostrEvent.md)\>

Defined in: nips/nip-59.ts:85

Gift-wrap a seal (`kind 1059`/`21059`): NIP-44-encrypt the seal to the
recipient with a fresh one-time keypair, signed by that ephemeral key.

## Parameters

### seal

[`SignedNostrEvent`](../../../../../interfaces/SignedNostrEvent.md)

### recipientPublicKey

`string`

### opts?

[`GiftWrapOptions`](../interfaces/GiftWrapOptions.md) = `{}`

## Returns

`Promise`\<[`SignedNostrEvent`](../../../../../interfaces/SignedNostrEvent.md)\>
