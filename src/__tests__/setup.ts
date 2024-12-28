/**
 * @module test/setup
 * @description Test setup and configuration
 */

import { afterEach, beforeEach } from 'vitest';
import { webcrypto } from 'node:crypto';

// Configure crypto for test environment
if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = webcrypto as unknown as Crypto;
}

// Set up global test environment
beforeEach(() => {
  // Add any global setup here
});

afterEach(() => {
  // Add any cleanup here
});

// Add any custom matchers or global test utilities here
