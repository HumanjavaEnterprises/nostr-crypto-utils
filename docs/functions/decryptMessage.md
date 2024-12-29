[**nostr-crypto-utils v0.4.1**](../README.md)

***

[nostr-crypto-utils](../README.md) / decryptMessage

# Function: decryptMessage()

> **decryptMessage**(`encryptedMessage`, `privateKey`, `senderPubKey`): `Promise`\<`string`\>

Decrypts a message

## Parameters

### encryptedMessage

`string`

Encrypted message

### privateKey

`string`

Recipient's private key

### senderPubKey

`string`

Sender's public key hex

## Returns

`Promise`\<`string`\>

Decrypted message

## Throws

Error if decryption fails

## Defined in

[crypto/index.ts:304](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/9c160331e9485dc52c520a832e977c4e54bbdc89/src/crypto/index.ts#L304)
