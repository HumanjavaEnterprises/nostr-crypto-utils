[**nostr-crypto-utils v0.9.0**](../README.md)

***

[nostr-crypto-utils](../README.md) / validateEventId

# Function: validateEventId()

> **validateEventId**(`event`): `ValidationResult`

Defined in: [validation/index.ts:47](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/validation/index.ts#L47)

Validates a Nostr event ID by checking if it matches the SHA-256 hash of the canonical event serialization.

## Parameters

### event

[`SignedNostrEvent`](../interfaces/SignedNostrEvent.md)

The event to validate

## Returns

`ValidationResult`

Object containing validation result and any error message

## Example

```typescript
const result = validateEventId(event);
if (!result.isValid) {
  console.error(result.error);
}
```
