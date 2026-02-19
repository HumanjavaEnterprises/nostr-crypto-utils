/**
 * Basic Usage Example — nostr-crypto-utils
 *
 * Demonstrates key generation, event creation, and event signing.
 */
import { generateKeyPair, createEvent, signEvent, verifySignature } from 'nostr-crypto-utils';

async function main() {
  // Generate a new Nostr key pair
  const keyPair = generateKeyPair();
  console.log('Public key:', keyPair.publicKey);
  console.log('Private key:', keyPair.privateKey);

  // Create an unsigned text note event (kind 1)
  const event = createEvent({
    pubkey: keyPair.publicKey,
    kind: 1,
    content: 'Hello Nostr!',
    tags: [],
    created_at: Math.floor(Date.now() / 1000),
  });

  // Sign the event
  const signedEvent = await signEvent(event, keyPair.privateKey);
  console.log('Signed event ID:', signedEvent.id);
  console.log('Signature:', signedEvent.sig);

  // Verify the signature
  const isValid = await verifySignature(signedEvent);
  console.log('Signature valid:', isValid);
}

main().catch(console.error);
