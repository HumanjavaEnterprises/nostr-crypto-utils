[**nostr-crypto-utils v0.9.0**](../../../../README.md)

***

[nostr-crypto-utils](../../../../README.md) / nips/nip-59

# nips/nip-59

## Description

NIP-59 Gift Wrap — encapsulate any event as a rumor → seal
(`kind 13`) → gift wrap (`kind 1059` / ephemeral `kind 21059`), using
NIP-44 encryption. Obscures author, recipient, and content metadata.

## See

https://github.com/nostr-protocol/nips/blob/master/59.md

## Interfaces

- [GiftWrapOptions](interfaces/GiftWrapOptions.md)
- [Rumor](interfaces/Rumor.md)

## Variables

- [KIND\_GIFT\_WRAP](variables/KIND_GIFT_WRAP.md)
- [KIND\_GIFT\_WRAP\_EPHEMERAL](variables/KIND_GIFT_WRAP_EPHEMERAL.md)
- [KIND\_SEAL](variables/KIND_SEAL.md)

## Functions

- [createGiftWrap](functions/createGiftWrap.md)
- [createRumor](functions/createRumor.md)
- [createSeal](functions/createSeal.md)
- [unwrapEvent](functions/unwrapEvent.md)
- [wrapEvent](functions/wrapEvent.md)
