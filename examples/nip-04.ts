/**
 * NIP-04 Example — nostr-crypto-utils
 *
 * Demonstrates encrypted direct message creation and decryption.
 */
import { generateKeyPair, encryptMessage, decryptMessage } from 'nostr-crypto-utils';

async function main() {
  // Generate two key pairs (sender and recipient)
  const sender = generateKeyPair();
  const recipient = generateKeyPair();

  console.log('Sender pubkey:', sender.publicKey);
  console.log('Recipient pubkey:', recipient.publicKey);

  // Encrypt a message from sender to recipient
  const plaintext = 'Hello, this is a secret message!';
  const encrypted = await encryptMessage(
    plaintext,
    recipient.publicKey,
    sender.privateKey,
  );
  console.log('Encrypted:', encrypted);

  // Decrypt the message as the recipient
  const decrypted = await decryptMessage(
    encrypted,
    sender.publicKey,
    recipient.privateKey,
  );
  console.log('Decrypted:', decrypted);
  console.log('Match:', plaintext === decrypted);
}

main().catch(console.error);
