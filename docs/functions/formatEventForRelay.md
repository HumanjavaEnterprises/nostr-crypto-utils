[**nostr-crypto-utils v0.4.1**](../README.md)

***

[nostr-crypto-utils](../README.md) / formatEventForRelay

# Function: formatEventForRelay()

> **formatEventForRelay**(`event`): [`string`, [`SignedNostrEvent`](../interfaces/SignedNostrEvent.md)]

Formats an event for relay transmission according to NIP-01

## Parameters

### event

[`SignedNostrEvent`](../interfaces/SignedNostrEvent.md)

The signed Nostr event to format

## Returns

[`string`, [`SignedNostrEvent`](../interfaces/SignedNostrEvent.md)]

A tuple of ['EVENT', event] ready for relay transmission

## Defined in

[protocol/index.ts:15](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/9c160331e9485dc52c520a832e977c4e54bbdc89/src/protocol/index.ts#L15)
