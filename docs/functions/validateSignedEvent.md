[**nostr-crypto-utils v0.4.1**](../README.md)

***

[nostr-crypto-utils](../README.md) / validateSignedEvent

# Function: validateSignedEvent()

> **validateSignedEvent**(`event`): `ValidationResult`

Validates a signed Nostr event (NIP-01)

## Parameters

### event

[`SignedNostrEvent`](../interfaces/SignedNostrEvent.md)

Signed event to validate

## Returns

`ValidationResult`

Validation result containing any errors found or true if valid

## Example

```typescript
const validation = validateSignedEvent(signedEvent);
if (!validation.isValid) {
  console.error('Invalid signature or event structure:', validation.error);
}
```

## Defined in

[utils/validation.ts:93](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/9c160331e9485dc52c520a832e977c4e54bbdc89/src/utils/validation.ts#L93)
