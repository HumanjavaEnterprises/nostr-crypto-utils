import { webcrypto } from 'node:crypto';
// Configure crypto for test environment
if (typeof globalThis.crypto === 'undefined') {
    globalThis.crypto = webcrypto;
}
