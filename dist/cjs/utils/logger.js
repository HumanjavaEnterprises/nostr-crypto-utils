"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomLogger = exports.logger = exports.LogLevel = void 0;
exports.setLogLevel = setLogLevel;
exports.getLogLevel = getLogLevel;
exports.createLogger = createLogger;
exports.log = log;
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
// Ordered for gating. trace/fatal/silent included for pino-call compatibility.
const LEVELS = ['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent'];
/**
 * Library logging is SILENT by default. Callers opt in with {@link setLogLevel}
 * or the namespaced env var `NOSTR_CRYPTO_UTILS_LOG_LEVEL` (read lazily on first
 * use, never at import time; the generic `LOG_LEVEL` is deliberately ignored).
 */
const DEFAULT_LEVEL = 'silent';
const ENV_VAR = 'NOSTR_CRYPTO_UTILS_LOG_LEVEL';
let overrideLevel;
let envLevel; // undefined = not read yet, null = unset
function isLevel(v) {
    return typeof v === 'string' && LEVELS.includes(v);
}
/** Read the namespaced env var without assuming a Node `process` global (Workers-safe). */
function readEnvLevel() {
    try {
        const proc = globalThis.process;
        const raw = proc?.env?.[ENV_VAR];
        const lvl = typeof raw === 'string' ? raw.toLowerCase() : undefined;
        return isLevel(lvl) ? lvl : null;
    }
    catch {
        return null;
    }
}
function effectiveDefaultLevel() {
    if (overrideLevel)
        return overrideLevel;
    if (envLevel === undefined)
        envLevel = readEnvLevel();
    return envLevel ?? DEFAULT_LEVEL;
}
/**
 * Set the log level for every logger in this library.
 * Pass `undefined` to go back to the default (env var, else `silent`).
 * @example setLogLevel('debug')
 */
function setLogLevel(level) {
    if (level !== undefined && !isLevel(level)) {
        throw new Error(`Invalid log level: ${String(level)}`);
    }
    overrideLevel = level;
}
/** Current effective library log level. */
function getLogLevel() {
    return effectiveDefaultLevel();
}
function rank(level) {
    const i = LEVELS.indexOf(level);
    return i === -1 ? LEVELS.indexOf('info') : i;
}
function serializeError(value) {
    if (value instanceof Error) {
        return { name: value.name, message: value.message, stack: value.stack };
    }
    return value;
}
// Resolve console methods at call time (not import time) so hosts can patch or
// redirect console after this module loads.
const CONSOLE_METHOD = {
    trace: 'debug',
    debug: 'debug',
    info: 'info',
    warn: 'warn',
    error: 'error',
    fatal: 'error',
};
function write(method, line) {
    if (method === 'silent')
        return;
    const c = console;
    const fn = c[CONSOLE_METHOD[method]] ?? c.log;
    fn?.call(console, line);
}
class EdgeLogger {
    explicitLevel;
    name;
    bindings;
    constructor(opts = {}) {
        this.name = opts.name;
        this.explicitLevel = opts.level;
        this.bindings = opts.bindings ?? {};
    }
    /** Per-instance level; falls back to the library-wide level (see setLogLevel). */
    get level() {
        return this.explicitLevel ?? effectiveDefaultLevel();
    }
    set level(value) {
        this.explicitLevel = value;
    }
    emit(method, args) {
        const level = this.level;
        if (level === 'silent' || rank(method) < rank(level))
            return;
        let context;
        let message;
        if (args.length && typeof args[0] === 'object' && args[0] !== null) {
            // pino-style: (mergingObject, message)
            context = {};
            for (const [k, v] of Object.entries(args[0])) {
                context[k] = serializeError(v);
            }
            message = args[1] != null ? String(args[1]) : '';
        }
        else {
            message = args
                .map((a) => (typeof a === 'string' ? a : JSON.stringify(serializeError(a))))
                .join(' ');
        }
        const merged = { ...this.bindings, ...context };
        const prefix = `[${new Date().toISOString()}] ${method.toUpperCase()}` + (this.name ? ` (${this.name})` : '');
        const ctx = Object.keys(merged).length ? ` ${JSON.stringify(merged)}` : '';
        write(method, `${prefix}: ${message}${ctx}`);
    }
    trace(...args) {
        this.emit('trace', args);
    }
    debug(...args) {
        this.emit('debug', args);
    }
    info(...args) {
        this.emit('info', args);
    }
    warn(...args) {
        this.emit('warn', args);
    }
    error(...args) {
        this.emit('error', args);
    }
    fatal(...args) {
        this.emit('fatal', args);
    }
    child(bindings) {
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
function createLogger(name) {
    return new EdgeLogger({ name });
}
/**
 * Simple log function for basic logging needs.
 * @param message - Message to log
 * @param data - Optional data to include
 */
function log(message, data) {
    console.log(message, data);
}
/** Default logger instance for the library. */
exports.logger = new EdgeLogger({ name: 'nostr-crypto-utils' });
/**
 * Legacy class-based logger, retained for backward compatibility.
 * Prefer {@link createLogger} / {@link logger}.
 */
class CustomLogger {
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
exports.CustomLogger = CustomLogger;
