# nostr-crypto-utils

A comprehensive TypeScript library providing cryptographic utilities and protocol-compliant message handling for Nostr applications, designed to work seamlessly with [@humanjavaenterprises/nostr-nsec-seedphrase](https://github.com/HumanjavaEnterprises/nostr-nsec-seedphrase).

[![npm version](https://badge.fury.io/js/%40humanjavaenterprises%2Fnostr-crypto-utils.svg)](https://www.npmjs.com/package/@humanjavaenterprises/nostr-crypto-utils)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/HumanjavaEnterprises/nostr-crypto-utils/blob/main/LICENSE)
[![Documentation](https://img.shields.io/badge/docs-TypeDoc-blue.svg)](https://humanjavaenterprises.github.io/nostr-crypto-utils/)

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

## Features and Capabilities

| Feature                    | Status | Description                                           |
|---------------------------|--------|-------------------------------------------------------|
| Key Management            | ✅     | Generate, validate, and manage Nostr keypairs         |
| Event Creation            | ✅     | Create and validate Nostr events                      |
| Event Signing             | ✅     | Sign events with schnorr signatures                   |
| Event Verification        | ✅     | Verify event signatures and validate event structure  |
| Message Encryption        | ✅     | NIP-04 compliant message encryption                   |
| Message Decryption        | ✅     | NIP-04 compliant message decryption                  |
| Event Serialization       | ✅     | Protocol-compliant event serialization               |
| Event Hashing            | ✅     | Generate and verify event IDs                        |

## Installation

```bash
npm install nostr-crypto-utils
```

## Quick Start

```typescript
import { generateKeyPair, signEvent, verifyEvent } from 'nostr-crypto-utils';

// Generate a new keypair
const keyPair = await generateKeyPair();
console.log('Public Key:', keyPair.publicKey);
console.log('Private Key:', keyPair.privateKey);

// Create and sign an event
const event = await signEvent({
  kind: 1,
  content: 'Hello Nostr!',
  tags: []
}, keyPair.privateKey);

// Verify the event
const isValidEvent = await verifyEvent(event);
```

## Documentation

This project uses JSDoc for documentation. All public APIs are documented with:
- Detailed descriptions of functionality
- Parameter and return type information
- Usage examples
- Type information (TypeScript)

You can generate the documentation using:

```bash
npm run docs
```

The generated documentation will be available in the `docs` directory.

### Contributing Documentation

When contributing to this project, please ensure:

1. All public APIs have comprehensive JSDoc comments
2. Include usage examples in the documentation
3. Keep documentation up to date with code changes
4. Use TypeScript types in JSDoc annotations
5. Document error cases and validation rules

### Publishing Checklist

Before publishing to npmjs:

1. [ ] All public APIs are documented with JSDoc
2. [ ] Documentation is generated and up to date
3. [ ] README includes installation and basic usage
4. [ ] CHANGELOG is updated
5. [ ] Tests are passing
6. [ ] Types are properly exported
7. [ ] Package.json is properly configured

## Version History

### v0.3.0 (2024-12-27)
- ✨ Added schnorr signature support for event signing and verification
- 🔒 Improved public key handling with both compressed and schnorr formats
- 🐛 Fixed signature verification issues
- 🏗️ Enhanced TypeScript type safety
- 📝 Improved documentation and examples
- ✅ Added comprehensive test coverage

### v0.2.0 (2024-12-26)
- 🎉 Initial public release
- ✨ Added support for NIP-01 and NIP-04
- 🔑 Implemented key pair generation and management
- 📝 Added comprehensive documentation
- 🧪 Added test suite
- 🏗️ Set up TypeScript configuration
- 📦 Configured package for npm distribution

### v0.1.0 (2024-12-25)
- 🎉 Initial development version
- 🏗️ Basic project structure
- 📝 Initial documentation
- 🔧 Development environment setup

## Support & Community

We welcome your feedback and contributions! Here's how you can get involved:

- 🐛 [Report bugs](https://github.com/humanjavaenterprises/nostr-crypto-utils/issues/new?labels=bug&template=bug_report.md)
- 💡 [Request features](https://github.com/humanjavaenterprises/nostr-crypto-utils/issues/new?labels=enhancement&template=feature_request.md)
- 💬 [Start a discussion](https://github.com/humanjavaenterprises/nostr-crypto-utils/discussions)
- 📖 [Read documentation](https://humanjavaenterprises.github.io/nostr-crypto-utils/)
- 🔒 [Report security issues](https://github.com/humanjavaenterprises/nostr-crypto-utils/security/advisories/new)

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Before contributing:
- Read our [Code of Conduct](CODE_OF_CONDUCT.md)
- Check our [Contributing Guidelines](.github/CONTRIBUTING.md)
- Review our [Security Policy](SECURITY.md)
- Search [existing issues](https://github.com/humanjavaenterprises/nostr-crypto-utils/issues) before creating a new one

## License

[MIT](LICENSE)

---
<div align="center">
Made with ❤️ by <a href="https://github.com/humanjavaenterprises">Humanjava Enterprises</a>
</div>
