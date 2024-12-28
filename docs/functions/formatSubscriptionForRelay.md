[**nostr-crypto-utils v0.3.0**](../README.md)

***

[nostr-crypto-utils](../globals.md) / formatSubscriptionForRelay

# Function: formatSubscriptionForRelay()

> **formatSubscriptionForRelay**(`subscription`): [`string`, `string`, `...NostrFilter[]`]

Formats a subscription request for relay transmission according to NIP-01

## Parameters

### subscription

`NostrSubscription`

The subscription request containing filters

## Returns

[`string`, `string`, `...NostrFilter[]`]

A tuple of ['REQ', subscriptionId, ...filters] ready for relay transmission

## Example

```typescript
const sub = { id: 'sub1', filters: [{ kinds: [1], limit: 10 }] };
const formatted = formatSubscriptionForRelay(sub);
// formatted = ['REQ', 'sub1', { kinds: [1], limit: 10 }]
```

## See

[https://github.com/nostr-protocol/nips/blob/master/01.md#from-client-to-relay-creating-subscriptions](https://github.com/nostr-protocol/nips/blob/master/01.md#from-client-to-relay-creating-subscriptions)

## Defined in

[integration.ts:36](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/0f31137ec103ea3e26d2a80b02d4d406d5a6e0d6/src/integration.ts#L36)
