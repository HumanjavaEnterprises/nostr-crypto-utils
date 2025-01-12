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
export declare function createLogger(name: string, _options?: unknown): pino.Logger;
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
export type { Logger } from 'pino';
//# sourceMappingURL=logger.d.ts.map