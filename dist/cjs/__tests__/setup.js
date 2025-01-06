"use strict";
/**
 * @module test/setup
 * @description Test setup and configuration
 */
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const node_crypto_1 = require("node:crypto");
// Configure crypto for test environment
if (typeof globalThis.crypto === 'undefined') {
    globalThis.crypto = node_crypto_1.webcrypto;
}
// Set up global test environment
(0, vitest_1.beforeEach)(() => {
    // Add any global setup here
});
(0, vitest_1.afterEach)(() => {
    // Add any cleanup here
});
// Add any custom matchers or global test utilities here
//# sourceMappingURL=setup.js.map