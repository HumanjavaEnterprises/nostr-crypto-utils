[**nostr-crypto-utils v0.9.0**](../README.md)

***

[nostr-crypto-utils](../README.md) / validateEventSignature

# Function: validateEventSignature()

> **validateEventSignature**(`event`): `ValidationResult`

Defined in: [validation/index.ts:84](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/validation/index.ts#L84)

Validates a Nostr event signature using Schnorr signature verification.

## Parameters

### event

[`SignedNostrEvent`](../interfaces/SignedNostrEvent.md)

The event to validate

## Returns

`ValidationResult`

Object containing validation result and any error message

## Example

```typescript
const result = validateEventSignature(event);
if (!result.isValid) {
  console.error(result.error);
}
```
