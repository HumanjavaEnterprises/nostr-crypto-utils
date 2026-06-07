[**nostr-crypto-utils v0.9.0**](../README.md)

***

[nostr-crypto-utils](../README.md) / getPublicKeySync

# Function: getPublicKeySync()

> **getPublicKeySync**(`privateKey`): `string`

Defined in: [crypto.ts:260](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/crypto.ts#L260)

Gets a public key hex string from a private key (synchronous)

## Parameters

### privateKey

`string` \| `Uint8Array`\<`ArrayBufferLike`\>

Private key as hex string or Uint8Array

## Returns

`string`

Hex-encoded public key (32-byte x-only schnorr key)
