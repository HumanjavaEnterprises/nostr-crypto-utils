[**nostr-crypto-utils v0.9.0**](../../../../README.md)

***

[nostr-crypto-utils](../../../../README.md) / nips/nip-46

# nips/nip-46

## Description

Implementation of NIP-46 (Nostr Connect / Remote Signing)

Pure protocol layer — crypto, encoding, message formatting.
No WebSocket, no relay connections, no I/O.
Consumers provide their own transport.

## See

https://github.com/nostr-protocol/nips/blob/master/46.md

## Functions

- [connectRequest](functions/connectRequest.md)
- [createBunkerURI](functions/createBunkerURI.md)
- [createRequest](functions/createRequest.md)
- [createRequestFilter](functions/createRequestFilter.md)
- [createResponse](functions/createResponse.md)
- [createResponseFilter](functions/createResponseFilter.md)
- [createSession](functions/createSession.md)
- [getPublicKeyRequest](functions/getPublicKeyRequest.md)
- [getRelaysRequest](functions/getRelaysRequest.md)
- [getSessionInfo](functions/getSessionInfo.md)
- [handleSignerRequest](functions/handleSignerRequest.md)
- [isRequest](functions/isRequest.md)
- [isResponse](functions/isResponse.md)
- [nip04DecryptRequest](functions/nip04DecryptRequest.md)
- [nip04EncryptRequest](functions/nip04EncryptRequest.md)
- [nip44DecryptRequest](functions/nip44DecryptRequest.md)
- [nip44EncryptRequest](functions/nip44EncryptRequest.md)
- [parseBunkerURI](functions/parseBunkerURI.md)
- [parsePayload](functions/parsePayload.md)
- [pingRequest](functions/pingRequest.md)
- [restoreSession](functions/restoreSession.md)
- [signEventRequest](functions/signEventRequest.md)
- [unwrapEvent](functions/unwrapEvent.md)
- [unwrapRequest](functions/unwrapRequest.md)
- [validateBunkerURI](functions/validateBunkerURI.md)
- [wrapEvent](functions/wrapEvent.md)
- [wrapResponse](functions/wrapResponse.md)
