"use strict";
/**
 * @module integration
 * @description Integration tests for Nostr crypto utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestEvent = createTestEvent;
exports.verifyTestEvent = verifyTestEvent;
const crypto_js_1 = require("../crypto.js");
const crypto_js_2 = require("../crypto.js");
const index_js_1 = require("../types/index.js");
/**
 * Create and sign a test event
 */
async function createTestEvent() {
    const keyPair = await (0, crypto_js_1.generateKeyPair)();
    const publicKey = await (0, crypto_js_1.getPublicKey)(keyPair.privateKey);
    const event = (0, crypto_js_2.createEvent)({
        kind: index_js_1.NostrEventKind.TEXT_NOTE,
        content: 'Test message',
        pubkey: publicKey.hex
    });
    return (0, crypto_js_2.signEvent)(event, keyPair.privateKey);
}
/**
 * Verify a test event
 */
async function verifyTestEvent(event) {
    return (0, crypto_js_2.verifySignature)(event);
}
//# sourceMappingURL=index.js.map