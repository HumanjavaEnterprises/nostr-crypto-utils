/**
 * @module logger
 * @description Logger utility for the application
 */

import pino from 'pino';

/**
 * Create a logger instance
 */
export function createLogger(name: string, _options?: unknown): pino.Logger {
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
/**
 * Logger instance for the application
 */
export const logger: pino.Logger = pino({
  name: 'default',
  level: 'info',
  formatters: {
    log: (obj: Record<string, unknown>) => {
      // Convert error objects to strings for better logging
      if (obj && typeof obj === 'object' && 'err' in obj) {
        const newObj = { ...obj };
        if (newObj.err instanceof Error) {
          newObj.err = newObj.err.message;
        }
        return newObj as Record<string, unknown>;
      }
      return obj;
    }
  }
});

// Re-export the Logger type for use in other files
export type { Logger } from 'pino';
