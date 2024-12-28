[**nostr-crypto-utils v0.3.0**](../README.md)

***

[nostr-crypto-utils](../globals.md) / createAuthorFilter

# Function: createAuthorFilter()

> **createAuthorFilter**(`pubkey`, `kinds`?, `limit`?): `NostrFilter`

Creates a subscription filter for events by a specific author

## Parameters

### pubkey

`string`

Author's public key

### kinds?

`number`[]

Optional array of event kinds to filter

### limit?

`number`

Optional maximum number of events to receive

## Returns

`NostrFilter`

Created filter

## Example

```typescript
// Get user's last 20 text notes
const filter = createAuthorFilter(pubkey, [1], 20);
```

## Defined in

[integration.ts:354](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/0f31137ec103ea3e26d2a80b02d4d406d5a6e0d6/src/integration.ts#L354)
