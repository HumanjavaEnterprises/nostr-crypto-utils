[**nostr-crypto-utils v0.9.0**](../../../../README.md)

***

[nostr-crypto-utils](../../../../README.md) / nips/nip-04

# ~~nips/nip-04~~

## Description

Implementation of NIP-04 (Encrypted Direct Messages)

## See

https://github.com/nostr-protocol/nips/blob/master/04.md

## Deprecated

NIP-04 is `unrecommended` upstream — it leaks metadata and uses a
weaker scheme. Prefer NIP-17 Private Direct Messages (NIP-44 encryption +
NIP-59 gift wrap). Retained for compatibility with legacy events only.

## References

### ~~computeSharedSecret~~

Re-exports [computeSharedSecret](../../../../functions/computeSharedSecret.md)

***

### ~~decryptMessage~~

Re-exports [decryptMessage](../../../../functions/decryptMessage.md)

***

### ~~encryptMessage~~

Re-exports [encryptMessage](../../../../functions/encryptMessage.md)

***

### ~~generateSharedSecret~~

Renames and re-exports [computeSharedSecret](../../../../functions/computeSharedSecret.md)
