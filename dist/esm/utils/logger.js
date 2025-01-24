/**
 * @module logger
 * @description Logger utility for the application
 */
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
})(LogLevel || (LogLevel = {}));
import pino from 'pino';
/**
 * Create a logger instance with consistent configuration
 * @param name - Component or module name for the logger
 * @returns Configured pino logger instance
 */
export function createLogger(name) {
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
export class CustomLogger {
    _level;
    constructor(level = LogLevel.INFO) {
        this._level = level;
    }
    setLevel(level) {
        this._level = level;
    }
    _log(level, message, context) {
        if (level >= this._level) {
            const timestamp = new Date().toISOString();
            const levelName = LogLevel[level];
            const contextStr = context ? ` ${JSON.stringify(context)}` : '';
            console.log(`[${timestamp}] ${levelName}: ${message}${contextStr}`);
        }
    }
    debug(message, context) {
        this._log(LogLevel.DEBUG, message, context);
    }
    info(message, context) {
        this._log(LogLevel.INFO, message, context);
    }
    warn(message, context) {
        this._log(LogLevel.WARN, message, context);
    }
    error(message, context) {
        const errorMessage = message instanceof Error ? message.message : String(message);
        this._log(LogLevel.ERROR, errorMessage, context);
    }
}
//# sourceMappingURL=logger.js.map