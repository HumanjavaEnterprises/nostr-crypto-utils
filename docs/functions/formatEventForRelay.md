[**nostr-crypto-utils v0.3.0**](../README.md)

***

[nostr-crypto-utils](../globals.md) / formatEventForRelay

# Function: formatEventForRelay()

> **formatEventForRelay**(`event`): [`string`, `SignedNostrEvent`]

Formats an event for relay transmission according to NIP-01

## Parameters

### event

`SignedNostrEvent`

The signed Nostr event to format

## Returns

[`string`, `SignedNostrEvent`]

A tuple of ['EVENT', event] ready for relay transmission

## Example

```typescript
const event = await signEvent(myEvent, privateKey);
const formatted = formatEventForRelay(event);
// formatted = ['EVENT', event]
```

## See

[https://github.com/nostr-protocol/nips/blob/master/01.md#from-client-to-relay-sending-events-and-creating-subscriptions](https://github.com/nostr-protocol/nips/blob/master/01.md#from-client-to-relay-sending-events-and-creating-subscriptions)

## Defined in

[integration.ts:19](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/0f31137ec103ea3e26d2a80b02d4d406d5a6e0d6/src/integration.ts#L19)
