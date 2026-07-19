**nostr-crypto-utils v0.9.0**

***

# nostr-crypto-utils v0.9.0

## Description

Core cryptographic utilities for Nostr protocol

## Namespaces

- [nip19](nostr-crypto-utils/namespaces/nip19/README.md)
- [nip26](nostr-crypto-utils/namespaces/nip26/README.md)
- [nips/nip-01](nostr-crypto-utils/namespaces/nips/nip-01/README.md)
- [~~nips/nip-04~~](nostr-crypto-utils/namespaces/nips/nip-04/README.md)
- [nips/nip-17](nostr-crypto-utils/namespaces/nips/nip-17/README.md)
- [nips/nip-44](nostr-crypto-utils/namespaces/nips/nip-44/README.md)
- [nips/nip-46](nostr-crypto-utils/namespaces/nips/nip-46/README.md)
- [nips/nip-49](nostr-crypto-utils/namespaces/nips/nip-49/README.md)
- [nips/nip-59](nostr-crypto-utils/namespaces/nips/nip-59/README.md)
- [nips/nip-98](nostr-crypto-utils/namespaces/nips/nip-98/README.md)

## Enumerations

- [Nip46Method](enumerations/Nip46Method.md)
- [NostrEventKind](enumerations/NostrEventKind.md)
- [NostrMessageType](enumerations/NostrMessageType.md)

## Interfaces

- [BunkerURI](interfaces/BunkerURI.md)
- [BunkerValidationResult](interfaces/BunkerValidationResult.md)
- [KeyPair](interfaces/KeyPair.md)
- [Nip46HandleOptions](interfaces/Nip46HandleOptions.md)
- [Nip46HandleResult](interfaces/Nip46HandleResult.md)
- [Nip46Request](interfaces/Nip46Request.md)
- [Nip46Response](interfaces/Nip46Response.md)
- [Nip46Session](interfaces/Nip46Session.md)
- [Nip46SessionInfo](interfaces/Nip46SessionInfo.md)
- [Nip46SignerHandlers](interfaces/Nip46SignerHandlers.md)
- [Nip46UnwrapResult](interfaces/Nip46UnwrapResult.md)
- [NostrEvent](interfaces/NostrEvent.md)
- [NostrFilter](interfaces/NostrFilter.md)
- [NostrSubscription](interfaces/NostrSubscription.md)
- [PublicKey](interfaces/PublicKey.md)
- [SignedNostrEvent](interfaces/SignedNostrEvent.md)
- [UnsignedNostrEvent](interfaces/UnsignedNostrEvent.md)

## Type Aliases

- [NostrMessageTuple](type-aliases/NostrMessageTuple.md)

## Functions

- [bytesToHex](functions/bytesToHex.md)
- [bytesToUtf8](functions/bytesToUtf8.md)
- [calculateEventId](functions/calculateEventId.md)
- [computeSharedSecret](functions/computeSharedSecret.md)
- [createEvent](functions/createEvent.md)
- [decrypt](functions/decrypt.md)
- [decryptMessage](functions/decryptMessage.md)
- [encrypt](functions/encrypt.md)
- [encryptMessage](functions/encryptMessage.md)
- [finalizeEvent](functions/finalizeEvent.md)
- [generateKeyPair](functions/generateKeyPair.md)
- [getPublicKey](functions/getPublicKey.md)
- [getPublicKeySync](functions/getPublicKeySync.md)
- [hexToBytes](functions/hexToBytes.md)
- [signEvent](functions/signEvent.md)
- [utf8ToBytes](functions/utf8ToBytes.md)
- [validateEvent](functions/validateEvent.md)
- [validateEventBase](functions/validateEventBase.md)
- [validateEventId](functions/validateEventId.md)
- [validateEventSignature](functions/validateEventSignature.md)
- [validateFilter](functions/validateFilter.md)
- [validateKeyPair](functions/validateKeyPair.md)
- [validateResponse](functions/validateResponse.md)
- [validateSignedEvent](functions/validateSignedEvent.md)
- [validateSubscription](functions/validateSubscription.md)
- [verifySignature](functions/verifySignature.md)
