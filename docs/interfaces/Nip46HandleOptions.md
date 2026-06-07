[**nostr-crypto-utils v0.9.0**](../README.md)

***

[nostr-crypto-utils](../README.md) / Nip46HandleOptions

# Interface: Nip46HandleOptions

Defined in: [types/nip46.ts:110](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/types/nip46.ts#L110)

Options for handleSignerRequest

## Properties

### authenticatedClients?

> `optional` **authenticatedClients?**: `Set`\<`string`\>

Defined in: [types/nip46.ts:114](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/types/nip46.ts#L114)

Set of authenticated client pubkeys. Not mutated — check newlyAuthenticated on result.

***

### secret?

> `optional` **secret?**: `string`

Defined in: [types/nip46.ts:112](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/types/nip46.ts#L112)

Expected connection secret (from bunker:// URI)
