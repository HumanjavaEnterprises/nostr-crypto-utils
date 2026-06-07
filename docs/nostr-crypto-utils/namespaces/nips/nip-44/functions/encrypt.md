[**nostr-crypto-utils v0.9.0**](../../../../../README.md)

***

[nostr-crypto-utils](../../../../../README.md) / [nips/nip-44](../README.md) / encrypt

# Function: encrypt()

> **encrypt**(`plaintext`, `conversationKey`, `nonce?`): `string`

Defined in: [nips/nip-44.ts:96](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/nips/nip-44.ts#L96)

Encrypt plaintext using NIP-44 v2

## Parameters

### plaintext

`string`

The message to encrypt

### conversationKey

`Uint8Array`

32-byte conversation key from getConversationKey

### nonce?

`Uint8Array` = `...`

Optional 32-byte nonce (random if not provided)

## Returns

`string`

Base64-encoded encrypted payload
