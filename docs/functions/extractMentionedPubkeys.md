[**nostr-crypto-utils v0.3.0**](../README.md)

***

[nostr-crypto-utils](../globals.md) / extractMentionedPubkeys

# Function: extractMentionedPubkeys()

> **extractMentionedPubkeys**(`event`): `string`[]

Extracts mentioned pubkeys from an event's tags

## Parameters

### event

`NostrEvent`

Event to extract mentions from

## Returns

`string`[]

Array of mentioned pubkeys

## Example

```typescript
const mentions = extractMentionedPubkeys(event);
console.log('Mentioned users:', mentions);
```

## Defined in

[integration.ts:316](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/0f31137ec103ea3e26d2a80b02d4d406d5a6e0d6/src/integration.ts#L316)
