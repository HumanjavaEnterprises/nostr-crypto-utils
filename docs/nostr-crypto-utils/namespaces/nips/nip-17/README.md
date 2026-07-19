[**nostr-crypto-utils v0.9.0**](../../../../README.md)

***

[nostr-crypto-utils](../../../../README.md) / nips/nip-17

# nips/nip-17

## Description

NIP-17 Private Direct Messages — encrypted chat using NIP-44
encryption and NIP-59 gift-wrapping. Builds unsigned `kind 14` chat rumors,
seals + gift-wraps them to each recipient (and the sender's own copy), and
unwraps received gift wraps back into the rumor.

## See

https://github.com/nostr-protocol/nips/blob/master/17.md

## Interfaces

- [DirectMessageParams](interfaces/DirectMessageParams.md)
- [WrappedMessage](interfaces/WrappedMessage.md)

## Variables

- [KIND\_CHAT\_MESSAGE](variables/KIND_CHAT_MESSAGE.md)
- [KIND\_FILE\_MESSAGE](variables/KIND_FILE_MESSAGE.md)

## Functions

- [createChatRumor](functions/createChatRumor.md)
- [createDirectMessage](functions/createDirectMessage.md)
- [readDirectMessage](functions/readDirectMessage.md)
