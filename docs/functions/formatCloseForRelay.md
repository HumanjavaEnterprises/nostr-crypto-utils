[**nostr-crypto-utils v0.4.1**](../README.md)

***

[nostr-crypto-utils](../README.md) / formatCloseForRelay

# Function: formatCloseForRelay()

> **formatCloseForRelay**(`subscriptionId`): [`string`, `string`]

Formats a close request for relay transmission according to NIP-01

## Parameters

### subscriptionId

`string`

The ID of the subscription to close

## Returns

[`string`, `string`]

A tuple of ['CLOSE', subscriptionId] ready for relay transmission

## Defined in

[protocol/index.ts:35](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/9c160331e9485dc52c520a832e977c4e54bbdc89/src/protocol/index.ts#L35)
