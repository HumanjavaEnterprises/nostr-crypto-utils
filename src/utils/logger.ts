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

export enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

// Ordered for gating. trace/fatal/silent included for pino-call compatibility.
const LEVELS = ['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent'] as const;
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

/** Read LOG_LEVEL without assuming a Node `process` global (Workers-safe). */
function defaultLevel(): LogLevelName {
  const env =
    typeof process !== 'undefined' && process.env ? process.env : ({} as Record<string, string>);
  const lvl = (env.LOG_LEVEL || 'info').toLowerCase();
  return (LEVELS as readonly string[]).includes(lvl) ? (lvl as LogLevelName) : 'info';
}

function rank(level: string): number {
  const i = (LEVELS as readonly string[]).indexOf(level);
  return i === -1 ? (LEVELS as readonly string[]).indexOf('info') : i;
}

function serializeError(value: unknown): unknown {
  if (value instanceof Error) {
    return { name: value.name, message: value.message, stack: value.stack };
  }
  return value;
}

const CONSOLE: Record<LogLevelName, (...a: unknown[]) => void> = {
  trace: (console.debug ?? console.log).bind(console),
  debug: (console.debug ?? console.log).bind(console),
  info: (console.info ?? console.log).bind(console),
  warn: (console.warn ?? console.log).bind(console),
  error: (console.error ?? console.log).bind(console),
  fatal: (console.error ?? console.log).bind(console),
  silent: () => {},
};

class EdgeLogger implements Logger {
  level: LogLevelName | string;
  private readonly name?: string;
  private readonly bindings: Record<string, unknown>;

  constructor(opts: { name?: string; level?: string; bindings?: Record<string, unknown> } = {}) {
    this.name = opts.name;
    this.level = (opts.level as LogLevelName) || defaultLevel();
    this.bindings = opts.bindings ?? {};
  }

  private emit(method: LogLevelName, args: unknown[]): void {
    if (this.level === 'silent' || rank(method) < rank(this.level)) return;

    let context: Record<string, unknown> | undefined;
    let message: string;

    if (args.length && typeof args[0] === 'object' && args[0] !== null) {
      // pino-style: (mergingObject, message)
      context = {};
      for (const [k, v] of Object.entries(args[0] as Record<string, unknown>)) {
        context[k] = serializeError(v);
      }
      message = args[1] != null ? String(args[1]) : '';
    } else {
      message = args
        .map((a) => (typeof a === 'string' ? a : JSON.stringify(serializeError(a))))
        .join(' ');
    }

    const merged = { ...this.bindings, ...context };
    const prefix =
      `[${new Date().toISOString()}] ${method.toUpperCase()}` + (this.name ? ` (${this.name})` : '');
    const ctx = Object.keys(merged).length ? ` ${JSON.stringify(merged)}` : '';
    (CONSOLE[method] ?? CONSOLE.info)(`${prefix}: ${message}${ctx}`);
  }

  trace(...args: unknown[]): void {
    this.emit('trace', args);
  }
  debug(...args: unknown[]): void {
    this.emit('debug', args);
  }
  info(...args: unknown[]): void {
    this.emit('info', args);
  }
  warn(...args: unknown[]): void {
    this.emit('warn', args);
  }
  error(...args: unknown[]): void {
    this.emit('error', args);
  }
  fatal(...args: unknown[]): void {
    this.emit('fatal', args);
  }

  child(bindings: Record<string, unknown>): Logger {
    return new EdgeLogger({
      name: this.name,
      level: this.level,
      bindings: { ...this.bindings, ...bindings },
    });
  }
}

/**
 * Create a named logger instance.
 * @param name - Component or module name for the logger
 */
export function createLogger(name: string): Logger {
  return new EdgeLogger({ name });
}

/**
 * Simple log function for basic logging needs.
 * @param message - Message to log
 * @param data - Optional data to include
 */
export function log(message: string, data?: unknown): void {
  console.log(message, data);
}

/** Default logger instance for the library. */
export const logger: Logger = new EdgeLogger({ name: 'nostr-crypto-utils' });

/**
 * Legacy class-based logger, retained for backward compatibility.
 * Prefer {@link createLogger} / {@link logger}.
 */
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
