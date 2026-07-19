[**nostr-crypto-utils v0.9.0**](../README.md)

***

[nostr-crypto-utils](../README.md) / validateEvent

# Function: validateEvent()

> **validateEvent**(`event`): `ValidationResult`

Defined in: [validation/index.ts:126](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/validation/index.ts#L126)

Validates a complete Nostr event by checking its structure, timestamps, ID, and signature.

## Parameters

### event

[`SignedNostrEvent`](../interfaces/SignedNostrEvent.md)

The event to validate

## Returns

`ValidationResult`

Object containing validation result and any error message

## Example

```typescript
const result = validateEvent(event);
if (!result.isValid) {
  console.error(result.error);
}
```
