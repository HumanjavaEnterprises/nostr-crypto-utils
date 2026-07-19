[**nostr-crypto-utils v0.9.0**](../../../../../README.md)

***

[nostr-crypto-utils](../../../../../README.md) / [nips/nip-46](../README.md) / restoreSession

# Function: restoreSession()

> **restoreSession**(`clientSecretKey`, `remotePubkey`): [`Nip46Session`](../../../../../interfaces/Nip46Session.md)

Defined in: [nips/nip-46.ts:132](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/nips/nip-46.ts#L132)

Restore a session from a previously saved ephemeral private key

## Parameters

### clientSecretKey

`string`

Hex-encoded ephemeral private key

### remotePubkey

`string`

Remote signer's public key (hex)

## Returns

[`Nip46Session`](../../../../../interfaces/Nip46Session.md)

Restored session
