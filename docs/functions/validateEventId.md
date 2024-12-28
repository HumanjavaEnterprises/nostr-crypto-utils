[**nostr-crypto-utils v0.3.0**](../README.md)

***

[nostr-crypto-utils](../globals.md) / validateEventId

# Function: validateEventId()

> **validateEventId**(`event`): [`ValidationResult`](../interfaces/ValidationResult.md)

Validates a Nostr event ID by checking if it matches the SHA-256 hash of the canonical event serialization.

## Parameters

### event

[`SignedNostrEvent`](../interfaces/SignedNostrEvent.md)

The event to validate

## Returns

[`ValidationResult`](../interfaces/ValidationResult.md)

Object containing validation result and any error message

## Example

```typescript
const result = validateEventId(event);
if (!result.isValid) {
  console.error(result.error);
}
```

## Defined in

validation/index.ts:27
