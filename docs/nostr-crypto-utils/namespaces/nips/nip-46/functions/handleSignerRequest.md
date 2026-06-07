[**nostr-crypto-utils v0.9.0**](../../../../../README.md)

***

[nostr-crypto-utils](../../../../../README.md) / [nips/nip-46](../README.md) / handleSignerRequest

# Function: handleSignerRequest()

> **handleSignerRequest**(`request`, `clientPubkey`, `handlers`, `opts?`): `Promise`\<[`Nip46HandleResult`](../../../../../interfaces/Nip46HandleResult.md)\>

Defined in: [nips/nip-46.ts:493](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/nips/nip-46.ts#L493)

Pure dispatch: validates auth, routes a NIP-46 method to the appropriate handler,
and returns a response. No state mutation — caller manages authenticated clients.

## Parameters

### request

[`Nip46Request`](../../../../../interfaces/Nip46Request.md)

Parsed NIP-46 request

### clientPubkey

`string`

The requesting client's pubkey (hex)

### handlers

[`Nip46SignerHandlers`](../../../../../interfaces/Nip46SignerHandlers.md)

Consumer-provided crypto callbacks

### opts?

[`Nip46HandleOptions`](../../../../../interfaces/Nip46HandleOptions.md)

Optional secret and authenticated client set

## Returns

`Promise`\<[`Nip46HandleResult`](../../../../../interfaces/Nip46HandleResult.md)\>

Response and optional newlyAuthenticated pubkey
