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

/**
 * Library logging is SILENT by default. Callers opt in with {@link setLogLevel}
 * or the namespaced env var `NOSTR_CRYPTO_UTILS_LOG_LEVEL` (read lazily on first
 * use, never at import time; the generic `LOG_LEVEL` is deliberately ignored).
 */
const DEFAULT_LEVEL: LogLevelName = 'silent';
const ENV_VAR = 'NOSTR_CRYPTO_UTILS_LOG_LEVEL';

let overrideLevel: LogLevelName | undefined;
let envLevel: LogLevelName | null | undefined; // undefined = not read yet, null = unset

function isLevel(v: unknown): v is LogLevelName {
  return typeof v === 'string' && (LEVELS as readonly string[]).includes(v);
}

/** Read the namespaced env var without assuming a Node `process` global (Workers-safe). */
function readEnvLevel(): LogLevelName | null {
  try {
    const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;
    const raw = proc?.env?.[ENV_VAR];
    const lvl = typeof raw === 'string' ? raw.toLowerCase() : undefined;
    return isLevel(lvl) ? lvl : null;
  } catch {
    return null;
  }
}

function effectiveDefaultLevel(): LogLevelName {
  if (overrideLevel) return overrideLevel;
  if (envLevel === undefined) envLevel = readEnvLevel();
  return envLevel ?? DEFAULT_LEVEL;
}

/**
 * Set the log level for every logger in this library.
 * Pass `undefined` to go back to the default (env var, else `silent`).
 * @example setLogLevel('debug')
 */
export function setLogLevel(level: LogLevelName | undefined): void {
  if (level !== undefined && !isLevel(level)) {
    throw new Error(`Invalid log level: ${String(level)}`);
  }
  overrideLevel = level;
}

/** Current effective library log level. */
export function getLogLevel(): LogLevelName {
  return effectiveDefaultLevel();
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

// Resolve console methods at call time (not import time) so hosts can patch or
// redirect console after this module loads.
const CONSOLE_METHOD: Record<Exclude<LogLevelName, 'silent'>, 'debug' | 'info' | 'warn' | 'error'> = {
  trace: 'debug',
  debug: 'debug',
  info: 'info',
  warn: 'warn',
  error: 'error',
  fatal: 'error',
};

function write(method: LogLevelName, line: string): void {
  if (method === 'silent') return;
  const c = console as unknown as Record<string, ((...a: unknown[]) => void) | undefined>;
  const fn = c[CONSOLE_METHOD[method]] ?? c.log;
  fn?.call(console, line);
}

class EdgeLogger implements Logger {
  private explicitLevel?: string;
  private readonly name?: string;
  private readonly bindings: Record<string, unknown>;

  constructor(opts: { name?: string; level?: string; bindings?: Record<string, unknown> } = {}) {
    this.name = opts.name;
    this.explicitLevel = opts.level;
    this.bindings = opts.bindings ?? {};
  }

  /** Per-instance level; falls back to the library-wide level (see setLogLevel). */
  get level(): LogLevelName | string {
    return this.explicitLevel ?? effectiveDefaultLevel();
  }

  set level(value: LogLevelName | string) {
    this.explicitLevel = value;
  }

  private emit(method: LogLevelName, args: unknown[]): void {
    const level = this.level;
    if (level === 'silent' || rank(method) < rank(level)) return;

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
    write(method, `${prefix}: ${message}${ctx}`);
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
      level: this.explicitLevel,
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
