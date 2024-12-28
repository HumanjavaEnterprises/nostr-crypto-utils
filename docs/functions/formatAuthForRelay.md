[**nostr-crypto-utils v0.3.0**](../README.md)

***

[nostr-crypto-utils](../globals.md) / formatAuthForRelay

# Function: formatAuthForRelay()

> **formatAuthForRelay**(`event`): [`string`, `SignedNostrEvent`]

Formats an auth request for relay transmission according to NIP-42

## Parameters

### event

`SignedNostrEvent`

The signed authentication event

## Returns

[`string`, `SignedNostrEvent`]

A tuple of ['AUTH', event] ready for relay transmission

## See

[https://github.com/nostr-protocol/nips/blob/master/42.md](https://github.com/nostr-protocol/nips/blob/master/42.md)

## Defined in

[integration.ts:62](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/0f31137ec103ea3e26d2a80b02d4d406d5a6e0d6/src/integration.ts#L62)
