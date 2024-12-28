[**nostr-crypto-utils v0.3.0**](../README.md)

***

[nostr-crypto-utils](../globals.md) / validateEventSignature

# Function: validateEventSignature()

> **validateEventSignature**(`event`): [`ValidationResult`](../interfaces/ValidationResult.md)

Validates a Nostr event signature using Schnorr signature verification.

## Parameters

### event

[`SignedNostrEvent`](../interfaces/SignedNostrEvent.md)

The event to validate

## Returns

[`ValidationResult`](../interfaces/ValidationResult.md)

Object containing validation result and any error message

## Example

```typescript
const result = validateEventSignature(event);
if (!result.isValid) {
  console.error(result.error);
}
```

## Defined in

validation/index.ts:64
