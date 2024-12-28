[**nostr-crypto-utils v0.3.0**](../README.md)

***

[nostr-crypto-utils](../globals.md) / decryptMessage

# Function: decryptMessage()

> **decryptMessage**(`encryptedMessage`, `senderPubKey`, `recipientPrivKey`): `Promise`\<`string`\>

Decrypts a message using NIP-04 decryption

## Parameters

### encryptedMessage

`string`

Encrypted message

### senderPubKey

`string`

Sender's public key

### recipientPrivKey

`string`

Recipient's private key

## Returns

`Promise`\<`string`\>

Decrypted message

## Defined in

crypto/encryption.ts:69
