# nostr-crypto-utils

A comprehensive TypeScript library providing cryptographic utilities and protocol-compliant message handling for Nostr applications, designed to work seamlessly with [@humanjavaenterprises/nostr-nsec-seedphrase](https://github.com/HumanjavaEnterprises/nostr-nsec-seedphrase).

[![npm version](https://badge.fury.io/js/%40humanjavaenterprises%2Fnostr-crypto-utils.svg)](https://www.npmjs.com/package/@humanjavaenterprises/nostr-crypto-utils)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/main/LICENSE)
[![Documentation](https://img.shields.io/badge/docs-TypeDoc-blue.svg)](https://humanjavaenterprises.github.io/nostr-crypto-utils/)
[![Build Status](https://img.shields.io/github/workflow/status/HumanjavaEnterprises/nostr-crypto-utils/CI)](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/actions)
[![Coverage Status](https://coveralls.io/repos/github/HumanjavaEnterprises/nostr-crypto-utils/badge.svg?branch=main)](https://coveralls.io/github/HumanjavaEnterprises/nostr-crypto-utils?branch=main)
[![Known Vulnerabilities](https://snyk.io/test/github/HumanjavaEnterprises/nostr-crypto-utils/badge.svg)](https://snyk.io/test/github/HumanjavaEnterprises/nostr-crypto-utils)

## Security Notice

⚠️ **Important**: This library handles cryptographic keys and operations that are critical for securing your Nostr identity and data. All cryptographic operations, including key generation, signing, and encryption, must be handled with appropriate security measures.

If you discover a security vulnerability, please follow our [Security Policy](SECURITY.md) and report it through [GitHub's Security Advisory feature](https://github.com/humanjavaenterprises/nostr-crypto-utils/security/advisories/new).

## Features

- **Complete NIP Compliance**: Implements all required cryptographic operations according to Nostr Implementation Possibilities (NIPs)
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Event Handling**: Create, sign, and validate Nostr events
- **Message Formatting**: Protocol-compliant message formatting for relay communication
- **Encryption**: Secure encryption and decryption for direct messages (NIP-04)
- **Validation**: Comprehensive validation for events, filters, and subscriptions
- **Cross-Platform**: Works in both Node.js and browser environments
- **Zero Dependencies**: Minimal external dependencies for better security

## Features and Capabilities

| Feature                    | Status | Description                                           |
|---------------------------|--------|-------------------------------------------------------|
| Key Management            | ✅     | Generate, validate, and manage Nostr keypairs         |
| Event Creation            | ✅     | Create and validate Nostr events                      |
| Event Signing             | ✅     | Sign events with schnorr signatures                   |
| Event Verification        | ✅     | Verify event signatures and validate event structure  |
| Direct Messages (NIP-04)  | ✅     | Encrypt and decrypt direct messages                   |
| Message Formatting        | ✅     | Format messages for relay communication               |
| Type Safety              | ✅     | Full TypeScript support with strict typing           |
| Browser Support          | ✅     | Works in modern browsers with Web Crypto API         |
| Node.js Support         | ✅     | Full support for Node.js environments               |

## Installation

```bash
npm install @humanjavaenterprises/nostr-crypto-utils
```

## Quick Start

```typescript
import { createKeyPair, createTextNoteEvent, signEvent } from '@humanjavaenterprises/nostr-crypto-utils';

// Generate a new key pair
const keyPair = createKeyPair();

// Create a text note event
const event = createTextNoteEvent({
  content: 'Hello Nostr!',
  pubkey: keyPair.publicKey,
  created_at: Math.floor(Date.now() / 1000)
});

// Sign the event
const signedEvent = signEvent(event, keyPair.privateKey);
```

## Documentation

Comprehensive documentation is available at [https://humanjavaenterprises.github.io/nostr-crypto-utils/](https://humanjavaenterprises.github.io/nostr-crypto-utils/)

## Type Safety

This library is written in TypeScript and provides comprehensive type definitions for all functions and data structures. Type checking is enforced at compile time to catch potential errors early.

```typescript
import { NostrEvent, NostrFilter, ValidationResult } from '@humanjavaenterprises/nostr-crypto-utils';

// All types are properly defined
const filter: NostrFilter = {
  kinds: [1],
  authors: ['pubkey1', 'pubkey2'],
  limit: 10
};

// Validation results include type information
const result: ValidationResult = validateEvent(event);
```

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

### v0.3.0 (2024-12-28)
- 🔒 Improved type safety with stricter TypeScript checks
- 🐛 Fixed crypto implementation for cross-platform compatibility
- ✨ Added comprehensive validation for all message types
- 📝 Updated documentation with more examples

### v0.2.0 (2024-12-26)
- 🎉 Initial public release
- ✨ Added support for NIP-01 and NIP-04
- 🔑 Implemented key pair generation and management
- 📝 Added comprehensive documentation

## Support

- 📖 [Documentation](https://humanjavaenterprises.github.io/nostr-crypto-utils/)
- 🐛 [Issue Tracker](https://github.com/humanjavaenterprises/nostr-crypto-utils/issues)
- 💬 [Discussions](https://github.com/humanjavaenterprises/nostr-crypto-utils/discussions)

## Related Projects

- [@humanjavaenterprises/nostr-nsec-seedphrase](https://github.com/HumanjavaEnterprises/nostr-nsec-seedphrase) - Generate and manage Nostr private keys using BIP-39 seed phrases

---
<div align="center">
Made with ❤️ by <a href="https://github.com/humanjavaenterprises">Humanjava Enterprises</a>
</div>
