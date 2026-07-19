[**nostr-crypto-utils v0.9.0**](../../../../../README.md)

***

[nostr-crypto-utils](../../../../../README.md) / [nips/nip-46](../README.md) / wrapResponse

# Function: wrapResponse()

> **wrapResponse**(`response`, `signerSecretKey`, `signerPubkey`, `clientPubkey`, `conversationKey?`): `Promise`\<[`SignedNostrEvent`](../../../../../interfaces/SignedNostrEvent.md)\>

Defined in: [nips/nip-46.ts:442](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/nips/nip-46.ts#L442)

Encrypt and sign a NIP-46 response from the signer's perspective.

## Parameters

### response

[`Nip46Response`](../../../../../interfaces/Nip46Response.md)

JSON-RPC response to send

### signerSecretKey

`string`

Signer's private key (hex)

### signerPubkey

`string`

Signer's public key (hex)

### clientPubkey

`string`

Recipient client's public key (hex)

### conversationKey?

`Uint8Array`\<`ArrayBufferLike`\>

Optional pre-computed NIP-44 conversation key (avoids re-deriving ECDH)

## Returns

`Promise`\<[`SignedNostrEvent`](../../../../../interfaces/SignedNostrEvent.md)\>

Signed kind 24133 event
