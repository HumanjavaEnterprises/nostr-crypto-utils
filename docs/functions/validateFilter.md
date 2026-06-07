[**nostr-crypto-utils v0.9.0**](../README.md)

***

[nostr-crypto-utils](../README.md) / validateFilter

# Function: validateFilter()

> **validateFilter**(`filter`): `ValidationResult`

Defined in: [validation/index.ts:272](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/validation/index.ts#L272)

Validates a Nostr filter by checking its structure and fields.

## Parameters

### filter

[`NostrFilter`](../interfaces/NostrFilter.md)

The filter to validate

## Returns

`ValidationResult`

Object containing validation result and any error message

## Example

```typescript
const result = validateFilter(filter);
if (!result.isValid) {
  console.error(result.error);
}
```
