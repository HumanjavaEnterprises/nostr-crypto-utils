/**
 * @module logger
 * @description Logger utility for the application
 */

enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR
}

import pino from 'pino';

/**
 * Create a logger instance with consistent configuration
 * @param name - Component or module name for the logger
 * @returns Configured pino logger instance
 */
export function createLogger(name: string): pino.Logger {
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
export function log(message: string, data?: unknown): void {
  console.log(message, data);
}

/**
 * Default logger instance for the application
 * Includes enhanced error handling and formatting
 */
export const logger: pino.Logger = pino({
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
    log: (obj: Record<string, unknown>) => {
      // Convert error objects to strings for better logging
      if (obj && typeof obj === 'object' && 'err' in obj) {
        const newObj = { ...obj };
        if (newObj.err instanceof Error) {
          const err = newObj.err as Error;
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
  private _level: LogLevel;

  constructor(level: LogLevel = LogLevel.INFO) {
    this._level = level;
  }

  setLevel(level: LogLevel): void {
    this._level = level;
  }

  private _log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    if (level >= this._level) {
      const timestamp = new Date().toISOString();
      const levelName = LogLevel[level];
      const contextStr = context ? ` ${JSON.stringify(context)}` : '';
      console.log(`[${timestamp}] ${levelName}: ${message}${contextStr}`);
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this._log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this._log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this._log(LogLevel.WARN, message, context);
  }

  error(message: string | Error | unknown, context?: Record<string, unknown>): void {
    const errorMessage = message instanceof Error ? message.message : String(message);
    this._log(LogLevel.ERROR, errorMessage, context);
  }
}

// Re-export the Logger type for use in other files
export type { Logger } from 'pino';
