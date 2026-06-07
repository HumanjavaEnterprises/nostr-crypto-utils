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
/** Read LOG_LEVEL without assuming a Node `process` global (Workers-safe). */
function defaultLevel() {
    const env = typeof process !== 'undefined' && process.env ? process.env : {};
    const lvl = (env.LOG_LEVEL || 'info').toLowerCase();
    return LEVELS.includes(lvl) ? lvl : 'info';
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
const CONSOLE = {
    trace: (console.debug ?? console.log).bind(console),
    debug: (console.debug ?? console.log).bind(console),
    info: (console.info ?? console.log).bind(console),
    warn: (console.warn ?? console.log).bind(console),
    error: (console.error ?? console.log).bind(console),
    fatal: (console.error ?? console.log).bind(console),
    silent: () => { },
};
class EdgeLogger {
    level;
    name;
    bindings;
    constructor(opts = {}) {
        this.name = opts.name;
        this.level = opts.level || defaultLevel();
        this.bindings = opts.bindings ?? {};
    }
    emit(method, args) {
        if (this.level === 'silent' || rank(method) < rank(this.level))
            return;
        let context;
        let message = '';
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
        (CONSOLE[method] ?? CONSOLE.info)(`${prefix}: ${message}${ctx}`);
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
            level: this.level,
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
//# sourceMappingURL=logger.js.map