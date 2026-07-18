/**
 * @module nips/nip-04
 * @description Implementation of NIP-04 (Encrypted Direct Messages).
 *
 * This module is the SINGLE canonical NIP-04 implementation for the package.
 * The blessed API is:
 *
 *   encryptMessage(message, senderPrivkey: PrivateKey, recipientPubkey: PublicKey): string
 *   decryptMessage(ciphertext, recipientPrivkey: PrivateKey, senderPubkey: PublicKey): string
 *
 * Branded key types (see ../types/keys) make argument-order mistakes a compile
 * error. The ECDH accepts 32-byte x-only Nostr public keys (the only form used
 * on the wire) by prepending the 02 prefix before deriving the shared secret.
 *
 * @see https://github.com/nostr-protocol/nips/blob/master/04.md
 */
import { type PrivateKey, type PublicKey } from '../types/keys.js';
/**
 * Encrypt a message using NIP-04 (AES-256-CBC over the ECDH shared secret).
 *
 * @param message - Plaintext message to encrypt
 * @param senderPrivkey - Sender's private key (branded {@link PrivateKey})
 * @param recipientPubkey - Recipient's x-only public key (branded {@link PublicKey})
 * @returns NIP-04 payload: `base64(ciphertext)?iv=base64(iv)`
 */
export declare function encryptMessage(message: string, senderPrivkey: PrivateKey, recipientPubkey: PublicKey): string;
/**
 * Decrypt a NIP-04 message.
 *
 * @param ciphertext - NIP-04 payload (`base64(ct)?iv=base64(iv)`), or legacy hex (iv||ct)
 * @param recipientPrivkey - Recipient's private key (branded {@link PrivateKey})
 * @param senderPubkey - Sender's x-only public key (branded {@link PublicKey})
 * @returns Decrypted plaintext
 */
export declare function decryptMessage(ciphertext: string, recipientPrivkey: PrivateKey, senderPubkey: PublicKey): string;
interface SharedSecret {
    sharedSecret: Uint8Array;
}
/**
 * Generate the NIP-04 shared secret (x-coordinate) for a private/public key pair.
 * @param privateKey - Private key (64 hex)
 * @param publicKey - Public key (64 hex x-only, or 66 hex prefixed)
 */
export declare function generateSharedSecret(privateKey: string, publicKey: string): SharedSecret;
export { generateSharedSecret as computeSharedSecret };
export { asPrivateKey, asPublicKey, type PrivateKey, type PublicKey } from '../types/keys.js';
//# sourceMappingURL=nip-04.d.ts.map