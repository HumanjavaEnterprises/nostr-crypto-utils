"use strict";
/**
 * @module logger
 * @description Logger utility for the application
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.createLogger = createLogger;
exports.log = log;
const pino_1 = __importDefault(require("pino"));
/**
 * Create a logger instance with consistent configuration
 * @param name - Component or module name for the logger
 * @param _options - Optional additional configuration
 * @returns Configured pino logger instance
 */
function createLogger(name, _options) {
    return (0, pino_1.default)({
        name,
        level: process.env.LOG_LEVEL || 'info',
        transport: process.env.NODE_ENV === 'development' ? {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'HH:MM:ss',
                ignore: 'pid,hostname',
            }
        } : undefined,
        formatters: {
            level: (label) => {
                return { level: label.toUpperCase() };
            }
        }
    });
}
/**
 * Simple log function for basic logging needs
 * @param message - Message to log
 * @param data - Optional data to include
 */
function log(message, data) {
    console.log(message, data);
}
/**
 * Default logger instance for the application
 * Includes enhanced error handling and formatting
 */
exports.logger = (0, pino_1.default)({
    name: 'nostr-crypto-utils',
    level: process.env.LOG_LEVEL || 'info',
    transport: process.env.NODE_ENV === 'development' ? {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'HH:MM:ss',
            ignore: 'pid,hostname',
        }
    } : undefined,
    formatters: {
        level: (label) => {
            return { level: label.toUpperCase() };
        },
        log: (obj) => {
            // Convert error objects to strings for better logging
            if (obj && typeof obj === 'object' && 'err' in obj) {
                const newObj = { ...obj };
                if (newObj.err instanceof Error) {
                    const err = newObj.err;
                    newObj.err = {
                        message: err.message,
                        stack: err.stack,
                        name: err.name,
                    };
                }
                return newObj;
            }
            return obj;
        }
    }
});
//# sourceMappingURL=logger.js.map