[**nostr-crypto-utils v0.3.0**](../README.md)

***

[nostr-crypto-utils](../globals.md) / formatCloseForRelay

# Function: formatCloseForRelay()

> **formatCloseForRelay**(`subscriptionId`): [`string`, `string`]

Formats a close request for relay transmission according to NIP-01

## Parameters

### subscriptionId

`string`

The ID of the subscription to close

## Returns

[`string`, `string`]

A tuple of ['CLOSE', subscriptionId] ready for relay transmission

## Example

```typescript
const formatted = formatCloseForRelay('sub1');
// formatted = ['CLOSE', 'sub1']
```

## Defined in

[integration.ts:51](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/0f31137ec103ea3e26d2a80b02d4d406d5a6e0d6/src/integration.ts#L51)
