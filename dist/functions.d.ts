import type { KeyPair, NostrEvent, SignedNostrEvent, ValidationResult } from './types';
import { NostrEventKind } from './types';
export declare function generatePrivateKey(): Promise<string>;
export declare function generateKeyPair(seed?: string): Promise<KeyPair>;
export declare function getPublicKey(privateKey: string): string;
export declare function getEventHash(event: NostrEvent): Promise<string>;
export declare function serializeEvent(event: NostrEvent): string;
export declare function createEvent(params: {
    kind: NostrEventKind;
    content: string;
    tags?: string[][];
    created_at?: number;
    pubkey?: string;
}): NostrEvent;
export declare function signEvent(event: NostrEvent, privateKey: string): SignedNostrEvent;
export declare function verifySignature(event: SignedNostrEvent): boolean;
export declare function validateKeyPair(publicKey: string, privateKey: string): ValidationResult;
export declare function encrypt(message: string, recipientPubKey: string, senderPrivKey: string): Promise<string>;
export declare function decrypt(encryptedMessage: string, senderPubKey: string, recipientPrivKey: string): Promise<string>;
