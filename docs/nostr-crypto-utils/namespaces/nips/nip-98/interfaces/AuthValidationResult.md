[**nostr-crypto-utils v0.9.0**](../../../../../README.md)

***

[nostr-crypto-utils](../../../../../README.md) / [nips/nip-98](../README.md) / AuthValidationResult

# Interface: AuthValidationResult

Defined in: nips/nip-98.ts:109

Result of [validateAuthEvent](../functions/validateAuthEvent.md).

## Properties

### reason?

> `optional` **reason?**: `string`

Defined in: nips/nip-98.ts:113

Human-readable reason for the first failed check (absent when valid).

***

### valid

> **valid**: `boolean`

Defined in: nips/nip-98.ts:111

True if every check passed and the signature is valid.
