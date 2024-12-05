# @humanjavaenterprises/nostr-crypto-utils

A comprehensive cryptographic utilities package for NOSTR applications, designed to work seamlessly with [@humanjavaenterprises/nostr-nsec-seedphrase](https://github.com/humanjavaenterprises/nostr-nsec-seedphrase).

⚠️ **Important Security Notice**

This library handles cryptographic keys and seed phrases that are critical for securing your Nostr identity and data. Just like Bitcoin, any seed phrase or private key (`nsec`) generated by this library must be stored with the utmost security and care.

Developers using this library must inform their users about the critical nature of managing seed phrases, `nsec`, and hex keys. It is the user's responsibility to securely store and manage these keys. The library and its authors disclaim any responsibility or liability for lost keys, seed phrases, or data resulting from mismanagement.

## Features

- 🔑 Complete key pair management (generation, validation, public key derivation)
- 📝 Event signing and verification
- 🔒 NIP-04 encryption and decryption
- 🌱 Seed phrase support via integration with nostr-nsec-seedphrase
- 📦 Modern ESM package with full TypeScript support
- ⚡️ Built on established crypto libraries (noble-curves, noble-hashes)
- 🤝 Compatible with nostr-tools as a peer dependency

## Installation

```bash
npm install @humanjavaenterprises/nostr-crypto-utils @humanjavaenterprises/nostr-nsec-seedphrase nostr-tools
```

## Architecture Overview

This library serves as a crucial middleware layer in NOSTR applications:

```
┌─────────────────────────────────────────────────────┐
│                  Your NOSTR App                     │
└───────────────────────┬─────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────┐
│           @humanjavaenterprises/nostr-crypto-utils  │
│                                                     │
│  ┌─────────────────┐        ┌──────────────────┐    │
│  │   Key Manager   │        │  Event Handler   │    │
│  └────────┬────────┘        └────────┬─────────┘    │
│           │                          │              │
│  ┌────────▼────────┐        ┌───────▼─────────┐    │
│  │ nostr-nsec-     │        │   nostr-tools   │    │
│  │ seedphrase      │        │                 │    │
│  └─────────────────┘        └─────────────────┘    │
└─────────────────────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────┐
│               NOSTR Protocol / Relays               │
└─────────────────────────────────────────────────────┘
```

## Usage Examples

### Key Management

```typescript
import { generateKeyPair, derivePublicKey, validateKeyPair } from '@humanjavaenterprises/nostr-crypto-utils';

// Generate a new key pair
const keyPair = await generateKeyPair();
console.log(keyPair);
// { privateKey: '...', publicKey: '...' }

// Generate from seed phrase
const seedPhrase = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
const keyPairFromSeed = await generateKeyPair(seedPhrase);

// Derive public key from private key
const publicKey = await derivePublicKey(keyPair.privateKey);

// Validate a key pair
const validation = await validateKeyPair(keyPair.publicKey, keyPair.privateKey);
console.log(validation);
// { isValid: true, error: undefined }
```

### Event Operations

```typescript
import { signEvent, verifySignature } from '@humanjavaenterprises/nostr-crypto-utils';

// Create and sign a NOSTR event
const event = {
  kind: 1,
  created_at: Math.floor(Date.now() / 1000),
  tags: [],
  content: 'Hello NOSTR!'
};

const signedEvent = await signEvent(event, keyPair.privateKey);
console.log(signedEvent);
// { id: '...', pubkey: '...', sig: '...', ...event }

// Verify an event signature
const isValid = await verifySignature(signedEvent);
console.log(isValid); // true
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

## Integration Examples

### Authentication Flow

```typescript
import { generateKeyPair, signEvent } from '@humanjavaenterprises/nostr-crypto-utils';

async function authenticateUser(seedPhrase?: string) {
  // Generate or recover keys
  const keyPair = await generateKeyPair(seedPhrase);
  
  // Create auth event
  const authEvent = {
    kind: 22242,
    created_at: Math.floor(Date.now() / 1000),
    tags: [['challenge', 'authentication-challenge']],
    content: 'Authenticating...'
  };
  
  // Sign the event
  const signedAuthEvent = await signEvent(authEvent, keyPair.privateKey);
  
  return signedAuthEvent;
}
```

### Secure Messaging

```typescript
import { generateKeyPair, encrypt, decrypt } from '@humanjavaenterprises/nostr-crypto-utils';

async function secureMessaging() {
  // Generate keys for both parties
  const alice = await generateKeyPair();
  const bob = await generateKeyPair();
  
  // Alice encrypts a message for Bob
  const encrypted = await encrypt(
    'Hey Bob!',
    bob.publicKey,
    alice.privateKey
  );
  
  // Bob decrypts Alice's message
  const decrypted = await decrypt(
    encrypted,
    alice.publicKey,
    bob.privateKey
  );
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Related Projects

- [@humanjavaenterprises/nostr-nsec-seedphrase](https://github.com/humanjavaenterprises/nostr-nsec-seedphrase) - Seed phrase management for NOSTR
- [nostr-tools](https://github.com/nbd-wtf/nostr-tools) - Core NOSTR functionality