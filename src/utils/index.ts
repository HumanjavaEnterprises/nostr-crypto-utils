/**
 * @module utils
 * @description Shared utilities and helper functions
 */

// Export basic functions
export * from './functions.js';
export * from './validation.js';

// Export integration utilities
export {
  formatEventForRelay,
  formatSubscriptionForRelay,
  formatCloseForRelay,
  formatAuthForRelay,
  parseNostrMessage,
  extractReferencedEvents,
  extractMentionedPubkeys,
  createKindFilter,
  createAuthorFilter,
  createReplyFilter,
  createMetadataEvent,
  createTextNoteEvent,
  createDirectMessageEvent,
  createChannelMessageEvent
} from './integration.js';

// Export logger
import { createLogger } from './logger.js';
export const logger = createLogger('default');
