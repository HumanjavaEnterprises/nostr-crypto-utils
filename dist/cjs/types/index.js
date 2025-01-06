"use strict";
/**
 * @module types
 * @description Type definitions for Nostr protocol
 * @see https://github.com/nostr-protocol/nips
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
/**
 * Re-export all types from base module
 * @packageDocumentation
 */
__exportStar(require("./base.js"), exports);
/** Re-export protocol types */
__exportStar(require("./protocol.js"), exports);
/** Re-export message types */
__exportStar(require("./messages.js"), exports);
/** Re-export type guards */
__exportStar(require("./guards.js"), exports);
//# sourceMappingURL=index.js.map