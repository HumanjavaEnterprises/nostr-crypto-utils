[**nostr-crypto-utils v0.3.0**](README.md)

***

# nostr-crypto-utils v0.3.0

## Description

A comprehensive TypeScript library providing cryptographic utilities and protocol-compliant message handling for Nostr applications

## Enumerations

- [NostrEventKind](enumerations/NostrEventKind.md)
- [NostrMessageType](enumerations/NostrMessageType.md)

## Interfaces

- [EncryptionResult](interfaces/EncryptionResult.md)
- [KeyPair](interfaces/KeyPair.md)
- [NostrError](interfaces/NostrError.md)
- [NostrEvent](interfaces/NostrEvent.md)
- [NostrFilter](interfaces/NostrFilter.md)
- [NostrMessage](interfaces/NostrMessage.md)
- [NostrResponse](interfaces/NostrResponse.md)
- [NostrSubscription](interfaces/NostrSubscription.md)
- [SignedNostrEvent](interfaces/SignedNostrEvent.md)
- [ValidationResult](interfaces/ValidationResult.md)

## Variables

- [customCrypto](variables/customCrypto.md)
- [logger](variables/logger.md)
- [NOSTR\_KIND](variables/NOSTR_KIND.md)
- [NOSTR\_TAG](variables/NOSTR_TAG.md)

## Functions

### Event Operations

- [extractMentionedPubkeys](functions/extractMentionedPubkeys.md)
- [extractReferencedEvents](functions/extractReferencedEvents.md)

### Message Handling

- [formatAuthForRelay](functions/formatAuthForRelay.md)
- [formatCloseForRelay](functions/formatCloseForRelay.md)
- [formatEventForRelay](functions/formatEventForRelay.md)
- [formatSubscriptionForRelay](functions/formatSubscriptionForRelay.md)
- [parseNostrMessage](functions/parseNostrMessage.md)

### Event Creation

- [createChannelMessageEvent](functions/createChannelMessageEvent.md)
- [createDirectMessageEvent](functions/createDirectMessageEvent.md)
- [createMetadataEvent](functions/createMetadataEvent.md)
- [createTextNoteEvent](functions/createTextNoteEvent.md)

### Filter Creation

- [createAuthorFilter](functions/createAuthorFilter.md)
- [createKindFilter](functions/createKindFilter.md)
- [createReplyFilter](functions/createReplyFilter.md)

### Other

- [createEvent](functions/createEvent.md)
- [decrypt](functions/decrypt.md)
- [decryptMessage](functions/decryptMessage.md)
- [encrypt](functions/encrypt.md)
- [encryptMessage](functions/encryptMessage.md)
- [generateKeyPair](functions/generateKeyPair.md)
- [generatePrivateKey](functions/generatePrivateKey.md)
- [getEventHash](functions/getEventHash.md)
- [getPublicKey](functions/getPublicKey.md)
- [getSharedSecret](functions/getSharedSecret.md)
- [serializeEvent](functions/serializeEvent.md)
- [signEvent](functions/signEvent.md)
- [validateEvent](functions/validateEvent.md)
- [validateEventId](functions/validateEventId.md)
- [validateEventSignature](functions/validateEventSignature.md)
- [validateKeyPair](functions/validateKeyPair.md)
- [verifySignature](functions/verifySignature.md)
