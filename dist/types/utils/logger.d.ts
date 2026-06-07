/**
 * @module logger
 * @description Zero-dependency, edge-safe logger for nostr-crypto-utils.
 *
 * Replaces the previous pino-based logger so the package runs natively on
 * Cloudflare Workers / Deno / browsers with no Node polyfills and no transitive
 * logging dependencies. The public API stays compatible with common pino usage:
 *   - level gating via `LOG_LEVEL` (or `logger.level = '...'`)
 *   - `logger.info('msg')` and `logger.error({ err }, 'msg')` call signatures
 *   - `logger.child(bindings)`
 */
export declare enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3
}
declare const LEVELS: readonly ["trace", "debug", "info", "warn", "error", "fatal", "silent"];
export type LogLevelName = (typeof LEVELS)[number];
export interface Logger {
    level: LogLevelName | string;
    trace(...args: unknown[]): void;
    debug(...args: unknown[]): void;
    info(...args: unknown[]): void;
    warn(...args: unknown[]): void;
    error(...args: unknown[]): void;
    fatal(...args: unknown[]): void;
    child(bindings: Record<string, unknown>): Logger;
}
/**
 * Create a named logger instance.
 * @param name - Component or module name for the logger
 */
export declare function createLogger(name: string): Logger;
/**
 * Simple log function for basic logging needs.
 * @param message - Message to log
 * @param data - Optional data to include
 */
export declare function log(message: string, data?: unknown): void;
/** Default logger instance for the library. */
export declare const logger: Logger;
/**
 * Legacy class-based logger, retained for backward compatibility.
 * Prefer {@link createLogger} / {@link logger}.
 */
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
export {};
//# sourceMappingURL=logger.d.ts.map