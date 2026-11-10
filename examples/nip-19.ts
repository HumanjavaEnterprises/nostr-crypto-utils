/**
 * NIP-19 Example — nostr-crypto-utils
 *
 * Demonstrates encoding and decoding of bech32-encoded Nostr entities.
 */
import { generateKeyPair } from 'nostr-crypto-utils';
import {
  npubEncode,
  nsecEncode,
  noteEncode,
  nprofileEncode,
  decode,
} from 'nostr-crypto-utils/nip19';

async function main() {
  const keyPair = await generateKeyPair();

  // Encode public key as npub
  const npub = npubEncode(keyPair.publicKey.hex);
  console.log('npub:', npub);

  // Encode private key as nsec
  const nsec = nsecEncode(keyPair.privateKey);
  console.log('nsec:', nsec);

  // Encode an event ID as note
  const exampleEventId = keyPair.publicKey.hex; // using pubkey as stand-in
  const note = noteEncode(exampleEventId);
  console.log('note:', note);

  // Encode a profile with relay hints
  const nprofile = nprofileEncode(keyPair.publicKey.hex, [
    'wss://relay.damus.io',
    'wss://nos.lol',
  ]);
  console.log('nprofile:', nprofile);

  // Decode any bech32 entity back
  const decoded = decode(npub);
  console.log('Decoded npub:', decoded);

  const decodedProfile = decode(nprofile);
  console.log('Decoded nprofile:', decodedProfile);
}

main().catch(console.error);
