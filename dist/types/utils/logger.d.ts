/**
 * @module logger
 * @description Logger utility for the application
 */
declare enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3
}
import pino from 'pino';
/**
 * Create a logger instance with consistent configuration
 * @param name - Component or module name for the logger
 * @returns Configured pino logger instance
 */
export declare function createLogger(name: string): pino.Logger;
/**
 * Simple log function for basic logging needs
 * @param message - Message to log
 * @param data - Optional data to include
 */
export declare function log(message: string, data?: unknown): void;
/**
 * Default logger instance for the application
 * Includes enhanced error handling and formatting
 */
export declare const logger: pino.Logger;
export declare class CustomLogger {
    private _level;
    constructor(level?: LogLevel);
    setLevel(level: LogLevel): void;
    private _log;
    debug(message: string, context?: Record<string, unknown>): void;
    info(message: string, context?: Record<string, unknown>): void;
    warn(message: string, context?: Record<string, unknown>): void;
    error(message: string | Error | unknown, context?: Record<string, unknown>): void;
}
export type { Logger } from 'pino';
//# sourceMappingURL=logger.d.ts.map