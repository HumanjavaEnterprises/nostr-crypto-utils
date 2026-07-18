/**
 * NIP-04 Example — nostr-crypto-utils
 *
 * Demonstrates encrypted direct message creation and decryption using the
 * canonical NIP-04 API with branded key types.
 */
import {
  generateKeyPair,
  encryptMessage,
  decryptMessage,
  asPrivateKey,
  asPublicKey,
} from 'nostr-crypto-utils';

async function main() {
  // Generate two key pairs (sender and recipient)
  const sender = await generateKeyPair();
  const recipient = await generateKeyPair();

  console.log('Sender pubkey:', sender.publicKey.hex);
  console.log('Recipient pubkey:', recipient.publicKey.hex);

  // Encrypt a message from sender to recipient.
  // Canonical order: (message, senderPrivkey, recipientPubkey).
  // Branded constructors make an argument-order mistake a compile error.
  const plaintext = 'Hello, this is a secret message!';
  const encrypted = encryptMessage(
    plaintext,
    asPrivateKey(sender.privateKey),
    asPublicKey(recipient.publicKey.hex),
  );
  console.log('Encrypted:', encrypted);

  // Decrypt the message as the recipient.
  // Canonical order: (ciphertext, recipientPrivkey, senderPubkey).
  const decrypted = decryptMessage(
    encrypted,
    asPrivateKey(recipient.privateKey),
    asPublicKey(sender.publicKey.hex),
  );
  console.log('Decrypted:', decrypted);
  console.log('Match:', plaintext === decrypted);
}

main().catch(console.error);
