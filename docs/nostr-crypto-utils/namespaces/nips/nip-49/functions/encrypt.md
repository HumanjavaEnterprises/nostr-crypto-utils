[**nostr-crypto-utils v0.9.0**](../../../../../README.md)

***

[nostr-crypto-utils](../../../../../README.md) / [nips/nip-49](../README.md) / encrypt

# Function: encrypt()

> **encrypt**(`sec`, `password`, `logn?`, `ksb?`): `string`

Defined in: [nips/nip-49.ts:22](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/nips/nip-49.ts#L22)

Encrypt a Nostr private key with a password, producing an ncryptsec bech32 string

## Parameters

### sec

`Uint8Array`

32-byte secret key

### password

`string`

Password for encryption

### logn?

`number` = `16`

Scrypt log2(N) parameter (default: 16, meaning N=65536)

### ksb?

`KeySecurityByte` = `0x02`

Key security byte: 0x00=unknown, 0x01=unsafe, 0x02=safe (default: 0x02)

## Returns

`string`

bech32-encoded ncryptsec string
