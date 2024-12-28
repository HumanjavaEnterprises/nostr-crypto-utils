[**nostr-crypto-utils v0.3.0**](../README.md)

***

[nostr-crypto-utils](../globals.md) / parseNostrMessage

# Function: parseNostrMessage()

> **parseNostrMessage**(`message`): `NostrResponse` \| `null`

Parses a Nostr protocol message according to NIP-01

## Parameters

### message

`unknown`

The message to parse

## Returns

`NostrResponse` \| `null`

Parsed message or null if invalid

## Throws

If message format is invalid

## Example

```typescript
const message = ['EVENT', signedEvent];
const parsed = parseNostrMessage(message);
if (parsed && parsed.type === NostrMessageType.EVENT) {
  console.log('Received event:', parsed.payload);
}
```

## Defined in

[integration.ts:81](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/0f31137ec103ea3e26d2a80b02d4d406d5a6e0d6/src/integration.ts#L81)
