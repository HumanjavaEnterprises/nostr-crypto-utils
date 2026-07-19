[**nostr-crypto-utils v0.9.0**](../README.md)

***

[nostr-crypto-utils](../README.md) / validateSignedEvent

# Function: validateSignedEvent()

> **validateSignedEvent**(`event`): `ValidationResult`

Defined in: [validation/index.ts:156](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/validation/index.ts#L156)

Validates a signed Nostr event by checking its structure and signature format.

## Parameters

### event

[`SignedNostrEvent`](../interfaces/SignedNostrEvent.md)

The event to validate

## Returns

`ValidationResult`

Object containing validation result and any error message

## Example

```typescript
const result = validateSignedEvent(event);
if (!result.isValid) {
  console.error(result.error);
}
```
