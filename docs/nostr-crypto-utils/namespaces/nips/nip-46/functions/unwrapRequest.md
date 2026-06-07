[**nostr-crypto-utils v0.9.0**](../../../../../README.md)

***

[nostr-crypto-utils](../../../../../README.md) / [nips/nip-46](../README.md) / unwrapRequest

# Function: unwrapRequest()

> **unwrapRequest**(`event`, `signerSecretKey`): [`Nip46UnwrapResult`](../../../../../interfaces/Nip46UnwrapResult.md)

Defined in: [nips/nip-46.ts:407](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/nips/nip-46.ts#L407)

Decrypt an incoming kind 24133 event using the signer's secret key.
Returns the decrypted request, client pubkey, and conversation key.

## Parameters

### event

[`SignedNostrEvent`](../../../../../interfaces/SignedNostrEvent.md)

Signed kind 24133 event from a client

### signerSecretKey

`string`

Signer's private key (hex)

## Returns

[`Nip46UnwrapResult`](../../../../../interfaces/Nip46UnwrapResult.md)

Decrypted request, client pubkey, and conversation key for reuse
