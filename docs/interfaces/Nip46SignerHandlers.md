[**nostr-crypto-utils v0.9.0**](../README.md)

***

[nostr-crypto-utils](../README.md) / Nip46SignerHandlers

# Interface: Nip46SignerHandlers

Defined in: [types/nip46.ts:90](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/types/nip46.ts#L90)

Callback handlers the consumer provides to the signer.
The signer dispatches incoming NIP-46 requests to these handlers.
NIP-04 handlers are optional (legacy support).

## Properties

### getPublicKey

> **getPublicKey**: () => `string` \| `Promise`\<`string`\>

Defined in: [types/nip46.ts:92](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/types/nip46.ts#L92)

Return the signer's public key (hex)

#### Returns

`string` \| `Promise`\<`string`\>

***

### getRelays?

> `optional` **getRelays?**: () => `string` \| `Promise`\<`string`\>

Defined in: [types/nip46.ts:104](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/types/nip46.ts#L104)

Return relay map as JSON string

#### Returns

`string` \| `Promise`\<`string`\>

***

### nip04Decrypt?

> `optional` **nip04Decrypt?**: (`pubkey`, `ciphertext`) => `string` \| `Promise`\<`string`\>

Defined in: [types/nip46.ts:98](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/types/nip46.ts#L98)

NIP-04 decrypt (legacy, optional)

#### Parameters

##### pubkey

`string`

##### ciphertext

`string`

#### Returns

`string` \| `Promise`\<`string`\>

***

### nip04Encrypt?

> `optional` **nip04Encrypt?**: (`pubkey`, `plaintext`) => `string` \| `Promise`\<`string`\>

Defined in: [types/nip46.ts:96](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/types/nip46.ts#L96)

NIP-04 encrypt (legacy, optional)

#### Parameters

##### pubkey

`string`

##### plaintext

`string`

#### Returns

`string` \| `Promise`\<`string`\>

***

### nip44Decrypt?

> `optional` **nip44Decrypt?**: (`pubkey`, `ciphertext`) => `string` \| `Promise`\<`string`\>

Defined in: [types/nip46.ts:102](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/types/nip46.ts#L102)

NIP-44 decrypt

#### Parameters

##### pubkey

`string`

##### ciphertext

`string`

#### Returns

`string` \| `Promise`\<`string`\>

***

### nip44Encrypt?

> `optional` **nip44Encrypt?**: (`pubkey`, `plaintext`) => `string` \| `Promise`\<`string`\>

Defined in: [types/nip46.ts:100](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/types/nip46.ts#L100)

NIP-44 encrypt

#### Parameters

##### pubkey

`string`

##### plaintext

`string`

#### Returns

`string` \| `Promise`\<`string`\>

***

### signEvent

> **signEvent**: (`eventJson`) => `string` \| `Promise`\<`string`\>

Defined in: [types/nip46.ts:94](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/types/nip46.ts#L94)

Sign a stringified unsigned event, return the stringified signed event

#### Parameters

##### eventJson

`string`

#### Returns

`string` \| `Promise`\<`string`\>
