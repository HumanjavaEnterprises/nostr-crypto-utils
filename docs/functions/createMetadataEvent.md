[**nostr-crypto-utils v0.3.0**](../README.md)

***

[nostr-crypto-utils](../globals.md) / createMetadataEvent

# Function: createMetadataEvent()

> **createMetadataEvent**(`metadata`, `pubkey`): `NostrEvent`

Creates a metadata event according to NIP-01

## Parameters

### metadata

`Record`\<`string`, `string`\>

User metadata (name, about, picture, etc.)

### pubkey

`string`

Public key of the user

## Returns

`NostrEvent`

Created metadata event

## Example

```typescript
const event = createMetadataEvent({
  name: 'Alice',
  about: 'Nostr enthusiast',
  picture: 'https://example.com/avatar.jpg'
}, myPubkey);
```

## See

[https://github.com/nostr-protocol/nips/blob/master/01.md#basic-event-kinds](https://github.com/nostr-protocol/nips/blob/master/01.md#basic-event-kinds)

## Defined in

[integration.ts:148](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/0f31137ec103ea3e26d2a80b02d4d406d5a6e0d6/src/integration.ts#L148)
