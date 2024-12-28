/**
 * @module logger
 * @description Logger utility for the application
 */

import pino from 'pino';

/**
 * Create a logger instance
 */
export function createLogger(name: string, _options?: Record<string, unknown>): any {
  return pino({
    name,
    level: process.env.LOG_LEVEL || 'info',
    transport: process.env.NODE_ENV === 'development' ? {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    } : undefined
  });
}

/**
 * @description Simple logger utility
 */

/**
 * Log a message with optional data
 * @param message - Message to log
 * @param data - Optional data to log
 */
export function log(message: string, data?: unknown): void {
  console.log(message, data);
}

// Export a default logger instance
export const logger = createLogger('default');
