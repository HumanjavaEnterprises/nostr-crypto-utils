[**nostr-crypto-utils v0.3.0**](../README.md)

***

[nostr-crypto-utils](../globals.md) / createDirectMessageEvent

# Function: createDirectMessageEvent()

> **createDirectMessageEvent**(`recipientPubkey`, `content`, `senderPubkey`): `NostrEvent`

Creates a direct message event according to NIP-04

## Parameters

### recipientPubkey

`string`

Public key of message recipient

### content

`string`

Message content (will be encrypted)

### senderPubkey

`string`

Public key of the sender

## Returns

`NostrEvent`

Created direct message event

## Example

```typescript
const dm = createDirectMessageEvent(
  recipientPubkey,
  'Secret message',
  myPubkey
);
```

## See

[https://github.com/nostr-protocol/nips/blob/master/04.md](https://github.com/nostr-protocol/nips/blob/master/04.md)

## Defined in

[integration.ts:224](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/0f31137ec103ea3e26d2a80b02d4d406d5a6e0d6/src/integration.ts#L224)
