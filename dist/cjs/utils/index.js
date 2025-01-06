"use strict";
/**
 * @module utils
 * @description Shared utilities and helper functions
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
exports.logger = exports.createChannelMessageEvent = exports.createDirectMessageEvent = exports.createTextNoteEvent = exports.createMetadataEvent = exports.createReplyFilter = exports.createAuthorFilter = exports.createKindFilter = exports.extractMentionedPubkeys = exports.extractReferencedEvents = exports.parseNostrMessage = exports.formatAuthForRelay = exports.formatCloseForRelay = exports.formatSubscriptionForRelay = exports.formatEventForRelay = void 0;
// Export basic functions
__exportStar(require("./functions"), exports);
__exportStar(require("./validation"), exports);
// Export integration utilities
var integration_1 = require("./integration");
Object.defineProperty(exports, "formatEventForRelay", { enumerable: true, get: function () { return integration_1.formatEventForRelay; } });
Object.defineProperty(exports, "formatSubscriptionForRelay", { enumerable: true, get: function () { return integration_1.formatSubscriptionForRelay; } });
Object.defineProperty(exports, "formatCloseForRelay", { enumerable: true, get: function () { return integration_1.formatCloseForRelay; } });
Object.defineProperty(exports, "formatAuthForRelay", { enumerable: true, get: function () { return integration_1.formatAuthForRelay; } });
Object.defineProperty(exports, "parseNostrMessage", { enumerable: true, get: function () { return integration_1.parseNostrMessage; } });
Object.defineProperty(exports, "extractReferencedEvents", { enumerable: true, get: function () { return integration_1.extractReferencedEvents; } });
Object.defineProperty(exports, "extractMentionedPubkeys", { enumerable: true, get: function () { return integration_1.extractMentionedPubkeys; } });
Object.defineProperty(exports, "createKindFilter", { enumerable: true, get: function () { return integration_1.createKindFilter; } });
Object.defineProperty(exports, "createAuthorFilter", { enumerable: true, get: function () { return integration_1.createAuthorFilter; } });
Object.defineProperty(exports, "createReplyFilter", { enumerable: true, get: function () { return integration_1.createReplyFilter; } });
Object.defineProperty(exports, "createMetadataEvent", { enumerable: true, get: function () { return integration_1.createMetadataEvent; } });
Object.defineProperty(exports, "createTextNoteEvent", { enumerable: true, get: function () { return integration_1.createTextNoteEvent; } });
Object.defineProperty(exports, "createDirectMessageEvent", { enumerable: true, get: function () { return integration_1.createDirectMessageEvent; } });
Object.defineProperty(exports, "createChannelMessageEvent", { enumerable: true, get: function () { return integration_1.createChannelMessageEvent; } });
// Export logger
const logger_1 = require("./logger");
exports.logger = (0, logger_1.createLogger)('default');
//# sourceMappingURL=index.js.map