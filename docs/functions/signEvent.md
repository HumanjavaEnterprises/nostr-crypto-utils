[**nostr-crypto-utils v0.3.0**](../README.md)

***

[nostr-crypto-utils](../globals.md) / signEvent

# Function: signEvent()

> **signEvent**(`event`, `privateKey`): `Promise`\<[`SignedNostrEvent`](../interfaces/SignedNostrEvent.md)\>

Signs a Nostr event with a private key (NIP-01)

## Parameters

### event

[`NostrEvent`](../interfaces/NostrEvent.md)

Event to sign

### privateKey

`string`

Private key in hex format

## Returns

`Promise`\<[`SignedNostrEvent`](../interfaces/SignedNostrEvent.md)\>

Signed event

## Defined in

event/signing.ts:19
