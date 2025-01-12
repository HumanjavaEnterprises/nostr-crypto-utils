# Nostr Crypto Utils

A comprehensive cryptographic utility library for Nostr protocol implementation, focusing on core security operations and cross-platform compatibility.

## Overview

This library provides essential cryptographic operations and utilities required for Nostr protocol implementation, with a focus on:

- Schnorr signatures for the Nostr protocol
- Key management and validation
- Event signing and verification
- Encrypted direct messages (NIP-04)
- Bech32-encoded entities (NIP-19)
- Delegated event signing (NIP-26)

## Core Features

### Cryptographic Operations
- Key generation and validation using Schnorr signatures
- Event signing and verification (NIP-01 compliant)
- NIP-04 encryption/decryption
- Shared secret computation
- Delegation token handling (NIP-26)

### Encoding Utilities
- Hex encoding/decoding
- Base64 encoding/decoding
- UTF-8 encoding/decoding
- Binary data handling
- Bech32 encoding/decoding (NIP-19)

### Protocol Support
- NIP-01: Basic protocol flow
- NIP-04: Encrypted Direct Messages
- NIP-19: Bech32-Encoded Entities
- NIP-26: Delegated Event Signing

## Project Structure

```
├── src/
│   ├── crypto.ts           # Core cryptographic operations
│   ├── encoding/           # Encoding utilities
│   │   ├── base64.ts
│   │   ├── hex.ts
│   │   └── index.ts
│   ├── types/             # Type definitions
│   │   ├── base.ts
│   │   ├── messages.ts
│   │   ├── protocol.ts
│   │   └── guards.ts
│   ├── nips/              # NIP implementations
│   └── utils/             # Utility functions
```

## Technical Requirements

- Node.js 18 or higher
- TypeScript with "bundler" moduleResolution
- Supports both ESM and CJS formats
- Cross-platform compatible (Node.js and browser environments)

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

## Why Choose nostr-crypto-utils?

- **Lightweight**: Only 208.7KB unpacked, focusing on essential cryptographic operations
- **Type-First**: Built from the ground up with TypeScript for maximum type safety
- **Minimal Dependencies**: Reduced attack surface and easier auditing
- **Modular Design**: Perfect for projects that need cryptographic operations without full client functionality
- **Complementary**: Works seamlessly with nostr-nsec-seedphrase for complete key management
- **Security Focused**: Strict validation and comprehensive test coverage

## Features

- **Complete NIP Compliance**: Implements all required cryptographic operations according to Nostr Implementation Possibilities (NIPs)
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Event Handling**: Create, sign, and validate Nostr events
- **Message Formatting**: Protocol-compliant message formatting for relay communication
- **Encryption**: Secure encryption and decryption for direct messages (NIP-04)
- **Validation**: Comprehensive validation for events, filters, and subscriptions
- **Cross-Platform**: Works in both Node.js and browser environments
- **Zero Dependencies**: Minimal external dependencies for better security

## Supported NIPs

This library implements the following Nostr Implementation Possibilities (NIPs):

| NIP | Title | Description | Status |
|-----|-------|-------------|---------|
| [NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md) | Basic Protocol Flow Description | Core protocol functionality including event creation, signing, and verification | ✅ Complete |
| [NIP-04](https://github.com/nostr-protocol/nips/blob/master/04.md) | Encrypted Direct Messages | Secure, end-to-end encrypted direct messaging between users | ✅ Complete |
| [NIP-19](https://github.com/nostr-protocol/nips/blob/master/19.md) | bech32-encoded Entities | Human-readable encoding for keys, events, and other entities | ✅ Complete |
| [NIP-26](https://github.com/nostr-protocol/nips/blob/master/26.md) | Delegated Event Signing | Create and verify delegated event signing capabilities | ✅ Complete |

### NIP-01 Features
- Event creation and serialization
- Event signing and verification
- Event ID calculation
- Basic protocol validation

### NIP-04 Features
- End-to-end encrypted direct messages
- Secure key exchange
- Message encryption/decryption

### NIP-19 Features
- Bech32 encoding/decoding for:
  - Public keys (`npub`)
  - Private keys (`nsec`)
  - Note IDs (`note`)
  - Profile references (`nprofile`)
  - Event references (`nevent`)
  - Addressable entities (`naddr`)
  - Relay URLs (`nrelay`)
- Comprehensive validation and error handling
- Support for multiple relay URLs
- TLV (Type-Length-Value) encoding for complex entities
- Improved type exports and function accessibility (v0.4.5+)
- Enhanced error messages and validation
- Cross-platform compatibility guaranteed

### NIP-19 Usage Examples

```typescript
import { 
  npubEncode, 
  nsecEncode, 
  noteEncode, 
  nprofileEncode,
  neventEncode,
  naddrEncode,
  nrelayEncode,
  decode 
} from '@humanjavaenterprises/nostr-crypto-utils';

// Encode a public key
const npub = npubEncode('7f3b6c2444c526fc7b3a48b0a1e38fb6a5a4062d4a097c9e96feb3c1df2f36d0');
// npub1xtscya34g58tk0z6v2g0r6w5gpqrxdgkz9xeav

// Encode a private key
const nsec = nsecEncode('7f3b6c2444c526fc7b3a48b0a1e38fb6a5a4062d4a097c9e96feb3c1df2f36d0');
// nsec1xtscya34g58tk0z6v2g0r6w5gpqrxdgkz9xeav

// Encode a note ID
const note = noteEncode('7f3b6c2444c526fc7b3a48b0a1e38fb6a5a4062d4a097c9e96feb3c1df2f36d0');
// note1xtscya34g58tk0z6v2g0r6w5gpqrxdgkz9xeav

// Encode a profile with multiple relays
const nprofile = nprofileEncode(
  '7f3b6c2444c526fc7b3a48b0a1e38fb6a5a4062d4a097c9e96feb3c1df2f36d0',
  ['wss://relay1.example.com', 'wss://relay2.example.com']
);

// Encode an event with author and kind
const nevent = neventEncode(
  '7f3b6c2444c526fc7b3a48b0a1e38fb6a5a4062d4a097c9e96feb3c1df2f36d0',
  ['wss://relay.example.com'],
  '7f3b6c2444c526fc7b3a48b0a1e38fb6a5a4062d4a097c9e96feb3c1df2f36d0',
  1
);

// Encode an addressable entity (NIP-33)
const naddr = naddrEncode(
  '7f3b6c2444c526fc7b3a48b0a1e38fb6a5a4062d4a097c9e96feb3c1df2f36d0',
  30023,
  'my-article',
  ['wss://relay.example.com']
);

// Encode a relay URL
const nrelay = nrelayEncode('wss://relay.example.com');

// Decode any bech32-encoded entity
const decoded = decode(nprofile);
console.log(decoded);
// {
//   type: 'nprofile',
//   data: '7f3b6c2444c526fc7b3a48b0a1e38fb6a5a4062d4a097c9e96feb3c1df2f36d0',
//   relays: ['wss://relay1.example.com', 'wss://relay2.example.com']
// }

// All functions include validation
try {
  const invalidNpub = npubEncode('invalid-hex');
} catch (error) {
  console.error(error); // Error: Invalid hex string
}

### Quick Start

### Installation
```bash
npm install nostr-crypto-utils
```

### Basic Usage

#### NIP-19 Encoding (Human-Readable Formats)
```typescript
import { npubEncode, nsecEncode, noteEncode } from 'nostr-crypto-utils';

// Convert a hex public key to npub format
const hexPubkey = '12xyl6w6aacmqa3gmmzwrr9m3u0ldx3dwqhczuascswvew9am9q4sfg99cx';
const npub = npubEncode(hexPubkey);
console.log(npub); // npub1...

// Convert a hex private key to nsec format
const hexPrivkey = 'your-hex-private-key';
const nsec = nsecEncode(hexPrivkey);
console.log(nsec); // nsec1...

// Convert an event ID to note format
const eventId = 'your-event-id';
const note = noteEncode(eventId);
console.log(note); // note1...
```

#### Key Generation and Event Signing
```typescript
import { generateKeyPair, createEvent, signEvent } from 'nostr-crypto-utils';

// Generate a new key pair
const keyPair = generateKeyPair();
console.log(keyPair.publicKey, keyPair.privateKey);

// Create and sign an event
const event = createEvent({
  pubkey: keyPair.publicKey,
  kind: 1,
  content: 'Hello Nostr!'
});
const signedEvent = signEvent(event, keyPair.privateKey);
```

### Schnorr Signature Examples

The library provides robust support for Schnorr signatures, which are fundamental to Nostr's cryptographic operations. Here are some common use cases:

#### Basic Message Signing

```typescript
import { schnorrSign, schnorrVerify } from 'nostr-crypto-utils';

// Sign a message
const message = 'Hello Nostr!';
const privateKey = 'your-private-key';
const signature = await schnorrSign(message, privateKey);

// Verify the signature
const publicKey = 'corresponding-public-key';
const isValid = await schnorrVerify(signature, message, publicKey);
console.log('Signature valid:', isValid); // true
```

#### Delegation Token Example (NIP-26)

```typescript
import { schnorrSign } from 'nostr-crypto-utils';

// Create a delegation token
const delegateePubkey = 'delegatee-public-key';
const delegatorPrivkey = 'delegator-private-key';
const conditions = {
  kind: 1,  // Only allow text notes
  until: Math.floor(Date.now() / 1000) + 86400 // 24 hours from now
};

// Format conditions string
const conditionsString = Object.entries(conditions)
  .map(([key, value]) => `${key}=${value}`)
  .sort()
  .join('&');

// Create and sign the delegation message
const message = `nostr:delegation:${delegateePubkey}:${conditionsString}`;
const token = await schnorrSign(message, delegatorPrivkey);
```

These examples demonstrate the library's type-safe approach to Schnorr signatures, ensuring both security and ease of use.

### Encrypted Direct Messages (NIP-04)

The library provides robust support for encrypted direct messages following the NIP-04 specification:

```typescript
import { encryptMessage, decryptMessage } from 'nostr-crypto-utils';

// Encrypting a direct message
async function createEncryptedDM(
  content: string,
  recipientPubkey: string,
  senderPrivkey: string
) {
  try {
    const encryptedContent = await encryptMessage(
      content, 
      recipientPubkey, 
      senderPrivkey
    );
    
    return {
      kind: 4, // NIP-04 Encrypted Direct Message
      content: encryptedContent,
      tags: [['p', recipientPubkey]]
    };
  } catch (error) {
    throw new Error(`Failed to create encrypted DM: ${error}`);
  }
}

// Decrypting a received message
async function decryptDM(
  encryptedContent: string,
  senderPubkey: string,
  recipientPrivkey: string
) {
  try {
    const decryptedContent = await decryptMessage(
      encryptedContent,
      senderPubkey,
      recipientPrivkey
    );
    return decryptedContent;
  } catch (error) {
    throw new Error(`Failed to decrypt DM: ${error}`);
  }
}
```

### Event Validation and Signature Verification

The library provides utilities for validating Nostr events and verifying signatures:

```typescript
import { validateEvent, verifySignature } from 'nostr-crypto-utils';
import type { NostrEvent, SignedNostrEvent } from './types';

async function validateSignedMessage(event: NostrEvent): Promise<boolean> {
  try {
    // First validate the event structure
    if (!validateEvent(event)) {
      console.debug('Invalid event format');
      return false;
    }

    // Then verify the signature
    const isValid = await verifySignature(event as SignedNostrEvent);
    if (!isValid) {
      console.debug('Invalid signature');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error validating signed message:', error);
    return false;
  }
}
```

These examples demonstrate real-world usage patterns from production Nostr applications, showcasing both the security features and ease of use of the library.

### NIP-26 Features
- Create delegation tokens
- Sign events with delegation
- Validate delegated events
- Conditional delegations with:
  - Time constraints
  - Event kind restrictions
  - Tag restrictions

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

## Integration with nostr-nsec-seedphrase

This library is designed to work seamlessly with [@humanjavaenterprises/nostr-nsec-seedphrase](https://github.com/HumanjavaEnterprises/nostr-nsec-seedphrase) to provide a complete solution for Nostr key management and cryptographic operations:

```typescript
import { generateSeedPhrase } from '@humanjavaenterprises/nostr-nsec-seedphrase';
import { createTextNoteEvent, signEvent } from '@humanjavaenterprises/nostr-crypto-utils';

// Generate keys using nostr-nsec-seedphrase
const seedPhrase = generateSeedPhrase();
const keyPair = seedPhraseToKeyPair(seedPhrase);

// Use nostr-crypto-utils for event creation and signing
const event = createTextNoteEvent({
  content: 'Hello Nostr!',
  pubkey: keyPair.publicKey,
  created_at: Math.floor(Date.now() / 1000)
});

const signedEvent = signEvent(event, keyPair.privateKey);
```

Together, these libraries provide:
- Secure key generation and recovery through seed phrases
- Type-safe cryptographic operations
- Comprehensive event handling
- Minimal bundle size and dependencies

## Delegate Token Creation (NIP-26)

You can use this library to create delegate tokens for use on web servers or other applications. This implements [NIP-26](https://github.com/nostr-protocol/nips/blob/master/26.md) for delegation of signing authority.

### Basic Delegation Example

```typescript
import { createDelegation, validateDelegation } from '@humanjavaenterprises/nostr-crypto-utils';

// Create a delegation token (delegator's perspective)
const delegatorKeyPair = await generateKeyPair();
const delegateePubkey = 'npub1...'; // The public key you're delegating to

const delegation = await createDelegation({
  delegatorPrivkey: delegatorKeyPair.privateKey,
  delegateePubkey,
  conditions: {
    kind: 1,  // Only allow text notes
    until: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60  // 30 days
  }
});

// Validate a delegation token (delegatee's perspective)
const isValid = await validateDelegation({
  token: delegation.token,
  delegatorPubkey: delegatorKeyPair.publicKey,
  delegateePubkey,
  kind: 1
});
```

### Web Server Example

Here's how to use delegation tokens in a web server context:

```typescript
import { createEvent, signEventWithDelegation } from '@humanjavaenterprises/nostr-crypto-utils';

// On your server, store these securely
const DELEGATE_PRIVKEY = 'nsec1...';  // Your server's private key
const DELEGATION_TOKEN = 'nostr:delegation:...';  // Token from the delegator
const DELEGATOR_PUBKEY = 'npub1...';  // Delegator's public key

// Create and sign an event on behalf of the delegator
const event = await createEvent({
  kind: 1,
  content: 'Posted via delegation!',
  pubkey: DELEGATOR_PUBKEY,  // Original delegator's pubkey
  created_at: Math.floor(Date.now() / 1000)
});

const signedEvent = await signEventWithDelegation({
  event,
  delegatePrivkey: DELEGATE_PRIVKEY,
  delegation: {
    token: DELEGATION_TOKEN,
    conditions: {
      kind: 1,
      until: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60
    }
  }
});
```

### Conditional Delegation

You can create more specific delegations with conditions:

```typescript
// Create a delegation with multiple conditions
const delegation = await createDelegation({
  delegatorPrivkey: delegatorKeyPair.privateKey,
  delegateePubkey,
  conditions: {
    kinds: [1, 6],  // Allow only text notes and reposts
    until: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,  // 1 week
    since: Math.floor(Date.now() / 1000),  // Starting from now
    tags: [
      ['t', 'nostr'],  // Only allow posts with tag 't' = 'nostr'
      ['p', delegateePubkey]  // Only allow mentions of the delegatee
    ]
  }
});
```

### Security Considerations

When working with delegated tokens:

1. **Store Securely**: Always store delegation tokens and private keys securely
2. **Check Expiration**: Validate the delegation's time constraints before using
3. **Validate Conditions**: Check all conditions before signing or accepting delegated events
4. **Limit Scope**: Only delegate the minimum required permissions
5. **Monitor Usage**: Keep track of how delegated tokens are being used

For more details on delegation, see the [NIP-26 specification](https://github.com/nostr-protocol/nips/blob/master/26.md).

## Type System Improvements

### Enhanced Type System

- **Consolidated Type Definitions**: Improved consistency and safety through unified type definitions
- **Better Type Inference**: Enhanced type inference for easier development and better code completion
- **Stricter Type Checks**: Improved type safety with stricter checks for better error prevention

### Improved Type Documentation

- **Better JSDoc Comments**: Improved documentation with clear and concise JSDoc comments
- **NIP References**: Added references to relevant NIPs for better understanding of the underlying protocol

## Debug Mode

Enable debug mode to get detailed logging:

```typescript
import { setDebugLevel } from '@humanjavaenterprises/nostr-crypto-utils';

// Enable debug logging
setDebugLevel('debug');

// Or for even more detail
setDebugLevel('trace');
```

### Common Error Messages

| Error Message | Likely Cause | Solution |
|--------------|--------------|----------|
| "Invalid delegation token" | Token expired or malformed | Check token expiration and format |
| "Signature verification failed" | Wrong key format or corrupted signature | Verify key formats and conversion |
| "Condition check failed" | Event doesn't match delegation conditions | Check event kind and other conditions |
| "Invalid pubkey format" | Using bech32 instead of hex | Convert pubkey to correct format |
| "Token expired" | Delegation token past expiration | Create new delegation with future expiration |

### Validation Checks

When troubleshooting, verify these common points:

#### Key Formats
- Private keys should be in hex format
- Public keys should be in hex format (not bech32)
- Signatures should be 64 bytes in hex format

#### Time Constraints
- Token expiration should be in the future
- Check system clock synchronization
- Use UTC timestamps consistently

#### Permission Scope
- Verify event kinds match delegation conditions
- Check any tag restrictions
- Confirm time window restrictions

#### Network Issues
- Verify relay connections
- Check for rate limiting
- Confirm proper websocket handling

### Testing Tools

```typescript
// Test delegation validity
const testDelegation = async (delegation) => {
  const result = await validateDelegation({
    token: delegation.token,
    delegatorPubkey: delegation.delegator,
    delegateePubkey: delegation.delegatee,
    kind: 1
  });
  
  console.log('Delegation valid:', result.isValid);
  if (!result.isValid) {
    console.error('Validation error:', result.error);
  }
  
  return result;
};

// Test event signing
const testEventSigning = async (event, delegation) => {
  try {
    const signed = await signEventWithDelegation({
      event,
      delegatePrivkey: delegation.privateKey,
      delegation: delegation.token
    });
    console.log('Event signed successfully:', signed.id);
    return true;
  } catch (error) {
    console.error('Signing failed:', error);
    return false;
  }
};
```

For more help, join our [Discord community](https://discord.gg/nostr) or [open an issue](https://github.com/humanjavaenterprises/nostr-crypto-utils/issues).

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
