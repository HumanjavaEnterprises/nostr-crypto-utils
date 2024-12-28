/**
 * @module logger
 * @description Logger utility for the application
 */
import pino from 'pino';
/**
 * Creates a logger instance with the specified configuration
 */
export function createLogger() {
    return pino({
        level: process.env.LOG_LEVEL || 'info',
        transport: process.env.NODE_ENV === 'development' ? {
            target: 'pino-pretty',
            options: {
                colorize: true
            }
        } : undefined
    });
}
// Export a default logger instance
export const logger = createLogger();
