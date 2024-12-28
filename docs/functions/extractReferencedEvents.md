[**nostr-crypto-utils v0.3.0**](../README.md)

***

[nostr-crypto-utils](../globals.md) / extractReferencedEvents

# Function: extractReferencedEvents()

> **extractReferencedEvents**(`event`): `string`[]

Extracts referenced event IDs from an event's tags

## Parameters

### event

`NostrEvent`

Event to extract references from

## Returns

`string`[]

Array of referenced event IDs

## Example

```typescript
const refs = extractReferencedEvents(event);
console.log('Referenced events:', refs);
```

## Defined in

[integration.ts:299](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/0f31137ec103ea3e26d2a80b02d4d406d5a6e0d6/src/integration.ts#L299)
