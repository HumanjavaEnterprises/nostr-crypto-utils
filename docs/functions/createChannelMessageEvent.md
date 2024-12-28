[**nostr-crypto-utils v0.3.0**](../README.md)

***

[nostr-crypto-utils](../globals.md) / createChannelMessageEvent

# Function: createChannelMessageEvent()

> **createChannelMessageEvent**(`channelId`, `content`, `authorPubkey`, `replyTo`?): `NostrEvent`

Creates a channel message event according to NIP-28

## Parameters

### channelId

`string`

ID of the channel

### content

`string`

Message content

### authorPubkey

`string`

Public key of the message author

### replyTo?

`string`

Optional ID of message being replied to

## Returns

`NostrEvent`

Created channel message event

## Example

```typescript
// New channel message
const msg = createChannelMessageEvent(
  channelId,
  'Hello channel!',
  myPubkey
);

// Reply to message
const reply = createChannelMessageEvent(
  channelId,
  'Good point!',
  myPubkey,
  originalMessageId
);
```

## See

[https://github.com/nostr-protocol/nips/blob/master/28.md](https://github.com/nostr-protocol/nips/blob/master/28.md)

## Defined in

[integration.ts:265](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/0f31137ec103ea3e26d2a80b02d4d406d5a6e0d6/src/integration.ts#L265)
