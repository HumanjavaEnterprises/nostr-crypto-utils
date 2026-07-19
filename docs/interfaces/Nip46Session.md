[**nostr-crypto-utils v0.9.0**](../README.md)

***

[nostr-crypto-utils](../README.md) / Nip46Session

# Interface: Nip46Session

Defined in: [types/nip46.ts:55](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/types/nip46.ts#L55)

A NIP-46 session containing the ephemeral keypair and conversation key

## Properties

### clientPubkey

> **clientPubkey**: `string`

Defined in: [types/nip46.ts:59](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/types/nip46.ts#L59)

Client's ephemeral public key (hex)

***

### clientSecretKey

> **clientSecretKey**: `string`

Defined in: [types/nip46.ts:57](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/types/nip46.ts#L57)

Client's ephemeral private key (hex)

***

### conversationKey

> **conversationKey**: `Uint8Array`

Defined in: [types/nip46.ts:63](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/types/nip46.ts#L63)

NIP-44 conversation key (derived from ECDH)

***

### remotePubkey

> **remotePubkey**: `string`

Defined in: [types/nip46.ts:61](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/types/nip46.ts#L61)

Remote signer's public key (hex)
