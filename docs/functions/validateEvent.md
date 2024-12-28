[**nostr-crypto-utils v0.3.0**](../README.md)

***

[nostr-crypto-utils](../globals.md) / validateEvent

# Function: validateEvent()

> **validateEvent**(`event`): [`ValidationResult`](../interfaces/ValidationResult.md)

Validates a complete Nostr event by checking its structure, timestamps, ID, and signature.

## Parameters

### event

[`SignedNostrEvent`](../interfaces/SignedNostrEvent.md)

The event to validate

## Returns

[`ValidationResult`](../interfaces/ValidationResult.md)

Object containing validation result and any error message

## Example

```typescript
const result = validateEvent(event);
if (!result.isValid) {
  console.error(result.error);
}
```

## Defined in

validation/index.ts:93
