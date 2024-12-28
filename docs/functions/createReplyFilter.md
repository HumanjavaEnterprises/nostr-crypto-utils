[**nostr-crypto-utils v0.3.0**](../README.md)

***

[nostr-crypto-utils](../globals.md) / createReplyFilter

# Function: createReplyFilter()

> **createReplyFilter**(`eventId`, `limit`?): `NostrFilter`

Creates a subscription filter for replies to a specific event

## Parameters

### eventId

`string`

ID of the event to find replies to

### limit?

`number`

Optional maximum number of replies to receive

## Returns

`NostrFilter`

Created filter

## Example

```typescript
// Get last 50 replies to an event
const filter = createReplyFilter(eventId, 50);
```

## Defined in

[integration.ts:374](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/0f31137ec103ea3e26d2a80b02d4d406d5a6e0d6/src/integration.ts#L374)
