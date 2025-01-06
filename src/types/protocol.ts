/**
 * @module types/protocol
 * @description Nostr protocol types
 */

import type { 
  NostrFilter, 
  PublicKey,
  NostrMessageType,
  NostrSubscription,
  NostrResponse,
  NostrError
} from './base.js';

// Re-export types from base that are used in this module
export type { 
  NostrFilter, 
  PublicKey,
  NostrMessageType,
  NostrSubscription,
  NostrResponse,
  NostrError
};
