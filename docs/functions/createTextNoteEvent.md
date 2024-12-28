[**nostr-crypto-utils v0.3.0**](../README.md)

***

[nostr-crypto-utils](../globals.md) / createTextNoteEvent

# Function: createTextNoteEvent()

> **createTextNoteEvent**(`content`, `pubkey`, `replyTo`?, `mentions`?): `NostrEvent`

Creates a text note event according to NIP-01

## Parameters

### content

`string`

The text content of the note

### pubkey

`string`

Public key of the author

### replyTo?

`string`

Optional ID of event being replied to

### mentions?

`string`[]

Optional array of pubkeys to mention

## Returns

`NostrEvent`

Created text note event

## Example

```typescript
// Simple text note
const note = createTextNoteEvent('Hello Nostr!', myPubkey);

// Reply with mentions
const reply = createTextNoteEvent(
  'Great post!',
  myPubkey,
  originalEventId,
  [authorPubkey]
);
```

## Defined in

[integration.ts:180](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/0f31137ec103ea3e26d2a80b02d4d406d5a6e0d6/src/integration.ts#L180)
