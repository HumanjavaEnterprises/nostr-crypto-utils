import { schnorr } from '@noble/curves/secp256k1';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { sha256 } from '@noble/hashes/sha256';
import { randomBytes } from '@noble/hashes/utils';
import * as secp256k1 from '@noble/secp256k1';
import { generateSecretKey, getPublicKey as getNostrPublicKey } from 'nostr-tools';
/**
 * Generate a private key for use with NOSTR
 */
export function generatePrivateKey() {
    return bytesToHex(generateSecretKey());
}
/**
 * Get a public key from a private key
 */
export function getPublicKey(privateKey) {
    return getNostrPublicKey(hexToBytes(privateKey));
}
/**
 * Generate a new key pair
 */
export function generateKeyPair() {
    const privateKey = generatePrivateKey();
    const publicKey = getPublicKey(privateKey);
    return { privateKey, publicKey };
}
/**
 * Get the hash of a NOSTR event
 */
export function getEventHash(event) {
    const serialized = JSON.stringify([
        0,
        event.pubkey,
        event.created_at,
        event.kind,
        event.tags,
        event.content,
    ]);
    const hash = sha256(new TextEncoder().encode(serialized));
    return bytesToHex(hash);
}
/**
 * Sign a NOSTR event
 */
export function signEvent(event, privateKey) {
    const hash = getEventHash(event);
    const signature = bytesToHex(await schnorr.sign(hexToBytes(hash), hexToBytes(privateKey)));
    return {
        ...event,
        id: hash,
        sig: signature,
        pubkey: getPublicKey(privateKey)
    };
}
/**
 * Verify a signature
 */
export function verifySignature(event) {
    const hash = getEventHash(event);
    return schnorr.verify(hexToBytes(event.sig), hexToBytes(hash), hexToBytes(event.pubkey));
}
/**
 * Validate a key pair
 */
export function validateKeyPair(publicKey, privateKey) {
    try {
        const derivedPubKey = getPublicKey(privateKey);
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
 * Encrypt a message using NIP-04
 */
export function encrypt(message, recipientPubKey, senderPrivKey) {
    const sharedSecret = secp256k1.getSharedSecret(senderPrivKey, '02' + recipientPubKey);
    const iv = randomBytes(16);
    const key = sha256(sharedSecret);
    const textEncoder = new TextEncoder();
    const textDecoder = new TextDecoder();
    const encrypted = crypto.subtle.encrypt({ name: 'AES-CBC', iv }, crypto.subtle.importKey('raw', key, { name: 'AES-CBC' }, false, ['encrypt']), textEncoder.encode(message));
    return bytesToHex(iv) + bytesToHex(new Uint8Array(encrypted));
}
/**
 * Decrypt a message using NIP-04
 */
export function decrypt(encryptedMessage, senderPubKey, recipientPrivKey) {
    const sharedSecret = secp256k1.getSharedSecret(recipientPrivKey, '02' + senderPubKey);
    const key = sha256(sharedSecret);
    const iv = hexToBytes(encryptedMessage.slice(0, 32));
    const ciphertext = hexToBytes(encryptedMessage.slice(32));
    const textDecoder = new TextDecoder();
    const decrypted = crypto.subtle.decrypt({ name: 'AES-CBC', iv }, crypto.subtle.importKey('raw', key, { name: 'AES-CBC' }, false, ['decrypt']), ciphertext);
    return textDecoder.decode(new Uint8Array(decrypted));
}
