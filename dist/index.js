// src/index.ts
import { schnorr } from "@noble/curves/secp256k1";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import { sha256 } from "@noble/hashes/sha256";
import { randomBytes } from "@noble/hashes/utils";
import * as secp256k1 from "@noble/secp256k1";
import { NostrSeedPhrase } from "@humanjavaenterprises/nostr-nsec-seedphrase";
async function generateKeyPair(seedPhrase) {
  let keyPair;
  if (!seedPhrase) {
    keyPair = NostrSeedPhrase.generateNew();
  } else {
    keyPair = NostrSeedPhrase.seedToNsec(seedPhrase);
  }
  return { privateKey: keyPair.privateKeyHex, publicKey: keyPair.publicKeyHex };
}
async function derivePublicKey(privateKey) {
  const pubKey = schnorr.getPublicKey(hexToBytes(privateKey));
  return bytesToHex(pubKey);
}
async function validateKeyPair(publicKey, privateKey) {
  try {
    const derivedPubKey = await derivePublicKey(privateKey);
    return {
      isValid: derivedPubKey === publicKey,
      error: derivedPubKey !== publicKey ? "Public key does not match derived key" : void 0
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}
async function getEventHash(event) {
  const serialized = JSON.stringify([
    0,
    event.pubkey,
    event.created_at,
    event.kind,
    event.tags,
    event.content
  ]);
  const hash = sha256(new TextEncoder().encode(serialized));
  return bytesToHex(hash);
}
async function signEvent(event, privateKey) {
  const hash = await getEventHash(event);
  const signature = bytesToHex(
    await schnorr.sign(hexToBytes(hash), hexToBytes(privateKey))
  );
  return {
    ...event,
    id: hash,
    sig: signature,
    pubkey: await derivePublicKey(privateKey)
  };
}
async function verifySignature(event) {
  const hash = await getEventHash(event);
  return schnorr.verify(
    hexToBytes(event.sig),
    hexToBytes(hash),
    hexToBytes(event.pubkey)
  );
}
async function encrypt(message, recipientPubKey, senderPrivKey) {
  const sharedSecret = secp256k1.getSharedSecret(
    senderPrivKey,
    "02" + recipientPubKey
  );
  const iv = randomBytes(16);
  const key = sha256(sharedSecret);
  const textEncoder = new TextEncoder();
  const textDecoder = new TextDecoder();
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv },
    await crypto.subtle.importKey(
      "raw",
      key,
      { name: "AES-CBC" },
      false,
      ["encrypt"]
    ),
    textEncoder.encode(message)
  );
  return bytesToHex(iv) + bytesToHex(new Uint8Array(encrypted));
}
async function decrypt(encryptedMessage, senderPubKey, recipientPrivKey) {
  const sharedSecret = secp256k1.getSharedSecret(
    recipientPrivKey,
    "02" + senderPubKey
  );
  const key = sha256(sharedSecret);
  const iv = hexToBytes(encryptedMessage.slice(0, 32));
  const ciphertext = hexToBytes(encryptedMessage.slice(32));
  const textDecoder = new TextDecoder();
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv },
    await crypto.subtle.importKey(
      "raw",
      key,
      { name: "AES-CBC" },
      false,
      ["decrypt"]
    ),
    ciphertext
  );
  return textDecoder.decode(new Uint8Array(decrypted));
}
export {
  decrypt,
  derivePublicKey,
  encrypt,
  generateKeyPair,
  getEventHash,
  signEvent,
  validateKeyPair,
  verifySignature
};
