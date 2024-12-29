[**nostr-crypto-utils v0.4.1**](../README.md)

***

[nostr-crypto-utils](../README.md) / PublicKeyDetails

# Interface: PublicKeyDetails

Represents a public key with additional formats

## See

https://github.com/nostr-protocol/nips/blob/master/01.md

## Properties

### bytes

> **bytes**: `Uint8Array`

Public key in bytes format (33 bytes compressed)

#### Defined in

[types/base.ts:20](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/9c160331e9485dc52c520a832e977c4e54bbdc89/src/types/base.ts#L20)

***

### hex

> **hex**: `string`

Public key in hex format (33 bytes compressed)

#### Defined in

[types/base.ts:18](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/9c160331e9485dc52c520a832e977c4e54bbdc89/src/types/base.ts#L18)

***

### schnorrBytes

> **schnorrBytes**: `Uint8Array`

Schnorr public key in bytes format (32 bytes x-coordinate)

#### Defined in

[types/base.ts:24](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/9c160331e9485dc52c520a832e977c4e54bbdc89/src/types/base.ts#L24)

***

### schnorrHex

> **schnorrHex**: `string`

Schnorr public key in hex format (32 bytes x-coordinate)

#### Defined in

[types/base.ts:22](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/9c160331e9485dc52c520a832e977c4e54bbdc89/src/types/base.ts#L22)
