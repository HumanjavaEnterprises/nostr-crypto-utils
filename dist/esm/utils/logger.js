/**
 * @module logger
 * @description Logger utility for the application
 */
import pino from 'pino';
/**
 * Create a logger instance with consistent configuration
 * @param name - Component or module name for the logger
 * @param _options - Optional additional configuration
 * @returns Configured pino logger instance
 */
export function createLogger(name, _options) {
    return pino({
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
export function log(message, data) {
    console.log(message, data);
}
/**
 * Default logger instance for the application
 * Includes enhanced error handling and formatting
 */
export const logger = pino({
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