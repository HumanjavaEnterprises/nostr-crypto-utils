# @humanjavaenterprises/nostr-crypto-utils

A comprehensive TypeScript library providing cryptographic utilities and protocol-compliant message handling for Nostr applications, designed to work seamlessly with [@humanjavaenterprises/nostr-nsec-seedphrase](https://github.com/HumanjavaEnterprises/nostr-nsec-seedphrase).

[![npm version](https://badge.fury.io/js/%40humanjavaenterprises%2Fnostr-crypto-utils.svg)](https://www.npmjs.com/package/@humanjavaenterprises/nostr-crypto-utils)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/main/LICENSE)

⚠️ **Important Security Notice**

This library handles cryptographic keys and operations that are critical for securing your Nostr identity and data. All cryptographic operations, including key generation, signing, and encryption, must be handled with appropriate security measures.

## Features

- **Complete NIP Compliance**: Implements all required cryptographic operations according to Nostr Implementation Possibilities (NIPs)
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Event Handling**: Create, sign, and validate Nostr events
- **Message Formatting**: Protocol-compliant message formatting for relay communication
- **Encryption**: Secure encryption and decryption for direct messages (NIP-04)
- **Validation**: Comprehensive validation for events, filters, and subscriptions

## Installation

```bash
npm install @humanjavaenterprises/nostr-crypto-utils
```

## Usage

### Key Management

```typescript
import { generateKeyPair, getPublicKey } from '@humanjavaenterprises/nostr-crypto-utils';

// Generate a new key pair
const keyPair = await generateKeyPair();
console.log('Public Key:', keyPair.publicKey);
console.log('Private Key:', keyPair.privateKey);

// Get public key from private key
const pubKey = getPublicKey(privateKey);
```

### Event Operations

```typescript
import { createEvent, signEvent, validateEvent } from '@humanjavaenterprises/nostr-crypto-utils';

// Create and sign an event
const event = createEvent({
  kind: NostrEventKind.TEXT_NOTE,
  content: 'Hello Nostr!',
  tags: []
});
const signedEvent = await signEvent(event, privateKey);

// Validate an event
const validation = validateEvent(event);
if (validation.isValid) {
  console.log('Event is valid');
} else {
  console.log('Validation errors:', validation.errors);
}
```

### Message Handling

```typescript
import { 
  formatEventForRelay, 
  formatSubscriptionForRelay,
  parseNostrMessage 
} from '@humanjavaenterprises/nostr-crypto-utils';

// Format event for relay
const eventMessage = formatEventForRelay(signedEvent);

// Format subscription request
const subscription = {
  id: 'sub1',
  filters: [{ kinds: [1], limit: 10 }]
};
const subMessage = formatSubscriptionForRelay(subscription);

// Parse incoming messages
const message = ['EVENT', signedEvent];
const parsed = parseNostrMessage(message);
```

### Encryption (NIP-04)

```typescript
import { encrypt, decrypt } from '@humanjavaenterprises/nostr-crypto-utils';

// Encrypt a message
const encrypted = await encrypt(
  'Secret message',
  recipientPublicKey,
  senderPrivateKey
);

// Decrypt a message
const decrypted = await decrypt(
  encrypted,
  senderPublicKey,
  recipientPrivateKey
);
```

## Protocol Compliance

This library implements the following Nostr Implementation Possibilities (NIPs):

- NIP-01: Basic protocol flow description
- NIP-02: Contact List and Petnames
- NIP-04: Encrypted Direct Message
- NIP-09: Event Deletion
- NIP-25: Reactions
- NIP-28: Public Chat Channels

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## Security

If you discover a security vulnerability within this library, please send an e-mail to security@humanjavaenterprises.com. All security vulnerabilities will be promptly addressed.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/main/LICENSE) file for details.

---

Built with ❤️ by [Human Java Enterprises](https://github.com/HumanjavaEnterprises)
