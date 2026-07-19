[**nostr-crypto-utils v0.9.0**](../README.md)

***

[nostr-crypto-utils](../README.md) / validateSubscription

# Function: validateSubscription()

> **validateSubscription**(`subscription`): `ValidationResult`

Defined in: [validation/index.ts:337](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/validation/index.ts#L337)

Validates a Nostr subscription by checking its structure and filters.

## Parameters

### subscription

[`NostrSubscription`](../interfaces/NostrSubscription.md)

The subscription to validate

## Returns

`ValidationResult`

Object containing validation result and any error message

## Example

```typescript
const result = validateSubscription(subscription);
if (!result.isValid) {
  console.error(result.error);
}
```
