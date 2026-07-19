[**nostr-crypto-utils v0.9.0**](../../../../../README.md)

***

[nostr-crypto-utils](../../../../../README.md) / [nips/nip-44](../README.md) / getConversationKey

# Function: getConversationKey()

> **getConversationKey**(`privkeyA`, `pubkeyB`): `Uint8Array`

Defined in: [nips/nip-44.ts:67](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/nips/nip-44.ts#L67)

Derive conversation key from private key and public key using ECDH + HKDF

## Parameters

### privkeyA

`Uint8Array`

### pubkeyB

`string`

## Returns

`Uint8Array`
