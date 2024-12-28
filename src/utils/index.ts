/**
 * @module utils
 * @description Shared utilities and helper functions
 */

export * from './functions';
export * from './validation';

import { createLogger } from './logger';
export const logger = createLogger();
