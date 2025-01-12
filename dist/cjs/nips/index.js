"use strict";
/**
 * @module nips
 * @description Exports for all NIP implementations
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = exports.nrelayEncode = exports.naddrEncode = exports.neventEncode = exports.nprofileEncode = exports.noteEncode = exports.nsecEncode = exports.npubEncode = void 0;
var nip_19_1 = require("./nip-19");
Object.defineProperty(exports, "npubEncode", { enumerable: true, get: function () { return nip_19_1.npubEncode; } });
Object.defineProperty(exports, "nsecEncode", { enumerable: true, get: function () { return nip_19_1.nsecEncode; } });
Object.defineProperty(exports, "noteEncode", { enumerable: true, get: function () { return nip_19_1.noteEncode; } });
Object.defineProperty(exports, "nprofileEncode", { enumerable: true, get: function () { return nip_19_1.nprofileEncode; } });
Object.defineProperty(exports, "neventEncode", { enumerable: true, get: function () { return nip_19_1.neventEncode; } });
Object.defineProperty(exports, "naddrEncode", { enumerable: true, get: function () { return nip_19_1.naddrEncode; } });
Object.defineProperty(exports, "nrelayEncode", { enumerable: true, get: function () { return nip_19_1.nrelayEncode; } });
Object.defineProperty(exports, "decode", { enumerable: true, get: function () { return nip_19_1.decode; } });
/**
 * @module nips
 * @description Core NIP implementations for cryptographic operations
 *
 * Includes:
 * - NIP-01: Basic protocol flow description
 * - NIP-04: Encrypted Direct Messages
 * - NIP-19: bech32-encoded entities
 * - NIP-26: Delegated Event Signing
 */
__exportStar(require("./nip-01"), exports);
__exportStar(require("./nip-04"), exports);
__exportStar(require("./nip-19"), exports);
__exportStar(require("./nip-26"), exports);
//# sourceMappingURL=index.js.map