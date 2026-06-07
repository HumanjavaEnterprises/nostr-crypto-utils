[**nostr-crypto-utils v0.9.0**](../../../../../README.md)

***

[nostr-crypto-utils](../../../../../README.md) / [nips/nip-44](../README.md) / decrypt

# Function: decrypt()

> **decrypt**(`payload`, `conversationKey`): `string`

Defined in: [nips/nip-44.ts:110](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/nips/nip-44.ts#L110)

Decrypt a NIP-44 v2 payload

## Parameters

### payload

`string`

Base64-encoded encrypted payload

### conversationKey

`Uint8Array`

32-byte conversation key from getConversationKey

## Returns

`string`

Decrypted plaintext string
