[**nostr-crypto-utils v0.4.1**](../README.md)

***

[nostr-crypto-utils](../README.md) / validateEvent

# Function: validateEvent()

> **validateEvent**(`event`): `ValidationResult`

Validates a Nostr event against the protocol specification (NIP-01)

## Parameters

### event

[`NostrEvent`](../interfaces/NostrEvent.md)

Event to validate

## Returns

`ValidationResult`

Validation result containing any errors found or true if valid

## Example

```typescript
const event = createEvent({
  kind: NostrEventKind.TEXT_NOTE,
  content: 'Hello Nostr!'
});
const validation = validateEvent(event);
if (!validation.isValid) {
  console.error('Validation error:', validation.error);
}
```

## Defined in

[utils/validation.ts:29](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/9c160331e9485dc52c520a832e977c4e54bbdc89/src/utils/validation.ts#L29)
