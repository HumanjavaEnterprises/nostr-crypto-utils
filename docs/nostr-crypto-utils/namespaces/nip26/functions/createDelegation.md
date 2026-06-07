[**nostr-crypto-utils v0.9.0**](../../../../README.md)

***

[nostr-crypto-utils](../../../../README.md) / [nip26](../README.md) / createDelegation

# Function: createDelegation()

> **createDelegation**(`delegatorPrivateKey`, `delegatee`, `conditions`): [`Delegation`](../interfaces/Delegation.md)

Defined in: [nips/nip-26.ts:36](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/be74ab5aca2dc1a3967c5b722bcc405900aade28/src/nips/nip-26.ts#L36)

Create a delegation token

## Parameters

### delegatorPrivateKey

`string`

Delegator's private key (used for signing only, never returned)

### delegatee

`string`

Delegatee's public key

### conditions

[`DelegationConditions`](../interfaces/DelegationConditions.md)

Delegation conditions

## Returns

[`Delegation`](../interfaces/Delegation.md)

Delegation token (delegator field contains the PUBLIC key, not the private key)
