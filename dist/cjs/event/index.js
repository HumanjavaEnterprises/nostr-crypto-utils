"use strict";
/**
 * @module event
 * @description Event handling utilities for Nostr
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateEventId = exports.validateEvent = exports.getEventHash = exports.serializeEvent = exports.createEvent = void 0;
var creation_js_1 = require("./creation.js");
Object.defineProperty(exports, "createEvent", { enumerable: true, get: function () { return creation_js_1.createEvent; } });
Object.defineProperty(exports, "serializeEvent", { enumerable: true, get: function () { return creation_js_1.serializeEvent; } });
Object.defineProperty(exports, "getEventHash", { enumerable: true, get: function () { return creation_js_1.getEventHash; } });
var signing_js_1 = require("./signing.js");
Object.defineProperty(exports, "validateEvent", { enumerable: true, get: function () { return signing_js_1.validateEvent; } });
Object.defineProperty(exports, "calculateEventId", { enumerable: true, get: function () { return signing_js_1.calculateEventId; } });
//# sourceMappingURL=index.js.map