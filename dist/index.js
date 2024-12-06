import { schnorr } from '@noble/curves/secp256k1';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { sha256 } from '@noble/hashes/sha256';
import { randomBytes } from '@noble/hashes/utils';
import * as secp256k1 from '@noble/secp256k1';
import { NostrSeedPhrase } from '@humanjavaenterprises/nostr-nsec-seedphrase';
import { generateSecretKey, getPublicKey } from 'nostr-tools';
/**
 * Generate a new secp256k1 key pair for use with NOSTR
 * @param seedPhrase - Optional seed phrase to use for key generation
 * @returns Promise<KeyPair> A promise that resolves to a key pair object
 */
export async function generateKeyPair(seedPhrase) {
    let privateKey;
    if (!seedPhrase) {
        privateKey = bytesToHex(generateSecretKey());
    }
    else {
        const keyPair = NostrSeedPhrase.seedToNsec(seedPhrase);
        privateKey = keyPair.privateKeyHex;
    }
    const publicKey = await derivePublicKey(privateKey);
    return { privateKey, publicKey };
}
/**
 * Derive a public key from a private key
 * @param privateKey - Hex-encoded private key
 * @returns Promise<string> A promise that resolves to the hex-encoded public key
 */
export async function derivePublicKey(privateKey) {
    const pubKey = getPublicKey(hexToBytes(privateKey));
    return pubKey;
}
/**
 * Validate a key pair
 * @param publicKey - Hex-encoded public key
 * @param privateKey - Hex-encoded private key
 * @returns Promise<ValidationResult> A promise that resolves to the validation result
 */
export async function validateKeyPair(publicKey, privateKey) {
    try {
        const derivedPubKey = await derivePublicKey(privateKey);
        return {
            isValid: derivedPubKey === publicKey,
            error: derivedPubKey !== publicKey ? 'Public key does not match derived key' : undefined
        };
    }
    catch (error) {
        return {
            isValid: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}
/**
 * Calculate the hash of a NOSTR event
 * @param event - The event to hash
 * @returns Promise<string> A promise that resolves to the hex-encoded event hash
 */
export async function getEventHash(event) {
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
/**
 * Sign a NOSTR event
 * @param event - The event to sign
 * @param privateKey - Hex-encoded private key
 * @returns Promise<SignedNostrEvent> A promise that resolves to the signed event
 */
export async function signEvent(event, privateKey) {
    const hash = await getEventHash(event);
    const signature = bytesToHex(await schnorr.sign(hexToBytes(hash), hexToBytes(privateKey)));
    return {
        ...event,
        id: hash,
        sig: signature,
        pubkey: await derivePublicKey(privateKey)
    };
}
/**
 * Verify the signature of a signed NOSTR event
 * @param event - The signed event to verify
 * @returns Promise<boolean> A promise that resolves to true if the signature is valid
 */
export async function verifySignature(event) {
    const hash = await getEventHash(event);
    return schnorr.verify(hexToBytes(event.sig), hexToBytes(hash), hexToBytes(event.pubkey));
}
/**
 * Encrypt a message using NIP-04
 * @param message - The message to encrypt
 * @param recipientPubKey - Recipient's hex-encoded public key
 * @param senderPrivKey - Sender's hex-encoded private key
 * @returns Promise<string> A promise that resolves to the encrypted message
 */
export async function encrypt(message, recipientPubKey, senderPrivKey) {
    const sharedSecret = secp256k1.getSharedSecret(senderPrivKey, '02' + recipientPubKey);
    const iv = randomBytes(16);
    const key = sha256(sharedSecret);
    const textEncoder = new TextEncoder();
    const textDecoder = new TextDecoder();
    const encrypted = await crypto.subtle.encrypt({ name: 'AES-CBC', iv }, await crypto.subtle.importKey('raw', key, { name: 'AES-CBC' }, false, ['encrypt']), textEncoder.encode(message));
    return bytesToHex(iv) + bytesToHex(new Uint8Array(encrypted));
}
/**
 * Decrypt a message using NIP-04
 * @param encryptedMessage - The encrypted message
 * @param senderPubKey - Sender's hex-encoded public key
 * @param recipientPrivKey - Recipient's hex-encoded private key
 * @returns Promise<string> A promise that resolves to the decrypted message
 */
export async function decrypt(encryptedMessage, senderPubKey, recipientPrivKey) {
    const sharedSecret = secp256k1.getSharedSecret(recipientPrivKey, '02' + senderPubKey);
    const key = sha256(sharedSecret);
    const iv = hexToBytes(encryptedMessage.slice(0, 32));
    const ciphertext = hexToBytes(encryptedMessage.slice(32));
    const textDecoder = new TextDecoder();
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-CBC', iv }, await crypto.subtle.importKey('raw', key, { name: 'AES-CBC' }, false, ['decrypt']), ciphertext);
    return textDecoder.decode(new Uint8Array(decrypted));
}
