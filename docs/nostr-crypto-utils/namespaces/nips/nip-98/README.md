[**nostr-crypto-utils v0.9.0**](../../../../README.md)

***

[nostr-crypto-utils](../../../../README.md) / nips/nip-98

# nips/nip-98

## Description

NIP-98 HTTP Auth — build and verify the ephemeral `kind 27235`
event used to authorize HTTP requests with a Nostr key.

## See

https://github.com/nostr-protocol/nips/blob/master/98.md

This module deliberately performs **no HTTP**. It builds and verifies the
auth event and the `Authorization: Nostr <base64>` header value; the caller
is responsible for actually issuing/receiving the request. This keeps the
package edge-native (no fetch, no transport).

## Interfaces

- [AuthValidationResult](interfaces/AuthValidationResult.md)
- [CreateAuthEventParams](interfaces/CreateAuthEventParams.md)
- [ValidateAuthParams](interfaces/ValidateAuthParams.md)

## Variables

- [KIND\_HTTP\_AUTH](variables/KIND_HTTP_AUTH.md)

## Functions

- [createAuthEvent](functions/createAuthEvent.md)
- [fromAuthHeader](functions/fromAuthHeader.md)
- [hashPayload](functions/hashPayload.md)
- [toAuthHeader](functions/toAuthHeader.md)
- [validateAuthEvent](functions/validateAuthEvent.md)
