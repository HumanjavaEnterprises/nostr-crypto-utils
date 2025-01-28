/**
 * @module utils/events
 * @description Event creation utility functions
 */
import { NostrEvent } from '../types';
/**
 * Creates a text note event
 * @param content - Text content
 * @param pubkey - Public key
 * @returns Created event
 */
export declare function createTextNoteEvent(content: string, pubkey: string): NostrEvent;
/**
 * Creates a metadata event
 * @param metadata - User metadata
 * @param pubkey - Public key
 * @returns Created event
 */
export declare function createMetadataEvent(metadata: Record<string, string>, pubkey: string): NostrEvent;
/**
 * Creates a channel message event
 * @param content - Message content
 * @param channelId - Channel ID
 * @param pubkey - Public key
 * @returns Created event
 */
export declare function createChannelMessageEvent(content: string, channelId: string, pubkey: string): NostrEvent;
/**
 * Creates a direct message event
 * @param content - Message content
 * @param recipientPubKey - Recipient's public key
 * @param pubkey - Sender's public key
 * @returns Created event
 */
export declare function createDirectMessageEvent(content: string, recipientPubKey: string, pubkey: string): NostrEvent;
//# sourceMappingURL=events.d.ts.map