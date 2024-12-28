[**nostr-crypto-utils v0.3.0**](../README.md)

***

[nostr-crypto-utils](../globals.md) / createKindFilter

# Function: createKindFilter()

> **createKindFilter**(`kind`, `limit`?): `NostrFilter`

Creates a subscription filter for a specific event kind

## Parameters

### kind

`number`

Event kind to filter for

### limit?

`number`

Optional maximum number of events to receive

## Returns

`NostrFilter`

Created filter

## Example

```typescript
// Get last 10 text notes
const filter = createKindFilter(1, 10);
```

## Defined in

[integration.ts:334](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/0f31137ec103ea3e26d2a80b02d4d406d5a6e0d6/src/integration.ts#L334)
