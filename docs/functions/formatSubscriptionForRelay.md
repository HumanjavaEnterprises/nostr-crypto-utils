[**nostr-crypto-utils v0.4.1**](../README.md)

***

[nostr-crypto-utils](../README.md) / formatSubscriptionForRelay

# Function: formatSubscriptionForRelay()

> **formatSubscriptionForRelay**(`subscription`): [`string`, `string`, `...NostrFilter[]`]

Formats a subscription request for relay transmission according to NIP-01

## Parameters

### subscription

[`NostrSubscription`](../interfaces/NostrSubscription.md)

The subscription request containing filters

## Returns

[`string`, `string`, `...NostrFilter[]`]

A tuple of ['REQ', subscriptionId, ...filters] ready for relay transmission

## Defined in

[protocol/index.ts:25](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/9c160331e9485dc52c520a832e977c4e54bbdc89/src/protocol/index.ts#L25)
