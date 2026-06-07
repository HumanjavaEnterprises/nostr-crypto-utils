[**nostr-crypto-utils v0.9.0**](../../../../../README.md)

***

[nostr-crypto-utils](../../../../../README.md) / [nips/nip-01](../README.md) / signEvent

# Function: signEvent()

> **signEvent**(`event`, `privateKey`): `Promise`\<[`SignedNostrEvent`](../../../../../interfaces/SignedNostrEvent.md)\>

Defined in: [nips/nip-01.ts:80](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/nips/nip-01.ts#L80)

Signs a Nostr event with a private key (NIP-01)

## Parameters

### event

[`NostrEvent`](../../../../../interfaces/NostrEvent.md)

Event to sign

### privateKey

`string`

Private key in hex format

## Returns

`Promise`\<[`SignedNostrEvent`](../../../../../interfaces/SignedNostrEvent.md)\>

Signed event
