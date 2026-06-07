[**nostr-crypto-utils v0.9.0**](../README.md)

***

[nostr-crypto-utils](../README.md) / validateResponse

# Function: validateResponse()

> **validateResponse**(`message`): `ValidationResult`

Defined in: [validation/index.ts:382](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/validation/index.ts#L382)

Validates a Nostr relay response message.

## Parameters

### message

`unknown`

The message to validate

## Returns

`ValidationResult`

Object containing validation result and any error message

## Example

```typescript
const result = validateResponse(['EVENT', eventObj]);
if (!result.isValid) {
  console.error(result.error);
}
```
