[**nostr-crypto-utils v0.9.0**](../README.md)

***

[nostr-crypto-utils](../README.md) / decryptMessage

# Function: decryptMessage()

> **decryptMessage**(`encryptedMessage`, `recipientPrivKey`, `senderPubKey`): `Promise`\<`string`\>

Defined in: [nips/nip-04.ts:157](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/nips/nip-04.ts#L157)

Decrypts a message using NIP-04 decryption

## Parameters

### encryptedMessage

`string`

Encrypted message string

### recipientPrivKey

`string`

Recipient's private key

### senderPubKey

`string`

Sender's public key

## Returns

`Promise`\<`string`\>

Decrypted message string
