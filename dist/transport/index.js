/**
 * @module transport
 * @description Functions for handling Nostr protocol messages and transport layer operations
 */
import { NostrMessageType } from '../types/base';
/**
 * Parses a Nostr message from a relay
 */
export function parseNostrMessage(message) {
    try {
        if (!Array.isArray(message) || message.length < 2) {
            return { success: false, message: 'Invalid message format', messageType: NostrMessageType.ERROR };
        }
        const [type, ...payload] = message;
        switch (type) {
            case 'EVENT':
                if (!payload[0] || typeof payload[0] !== 'object') {
                    return { success: false, message: 'Invalid EVENT message format', messageType: NostrMessageType.ERROR };
                }
                return {
                    success: true,
                    messageType: NostrMessageType.EVENT,
                    payload: payload[0]
                };
            case 'NOTICE':
                if (!payload[0] || typeof payload[0] !== 'string') {
                    return { success: false, message: 'Invalid NOTICE message format', messageType: NostrMessageType.ERROR };
                }
                return {
                    success: true,
                    messageType: NostrMessageType.NOTICE,
                    payload: payload[0]
                };
            case 'EOSE':
                return {
                    success: true,
                    messageType: NostrMessageType.EOSE,
                    payload: payload[0]
                };
            case 'OK':
                if (payload.length < 2 || typeof payload[0] !== 'string' || typeof payload[1] !== 'boolean') {
                    return { success: false, message: 'Invalid OK message format', messageType: NostrMessageType.ERROR };
                }
                return {
                    success: true,
                    messageType: NostrMessageType.OK,
                    payload: { eventId: payload[0], success: payload[1], message: payload[2] }
                };
            default:
                return { success: false, message: `Unknown message type: ${type}`, messageType: NostrMessageType.ERROR };
        }
    }
    catch (error) {
        return { success: false, message: `Error parsing message: ${error}`, messageType: NostrMessageType.ERROR };
    }
}
/**
 * Formats an event for relay transmission
 */
export function formatEventForRelay(event) {
    return ['EVENT', event];
}
/**
 * Formats a subscription request for relay transmission
 */
export function formatSubscriptionForRelay(id, filters) {
    if (!Array.isArray(filters)) {
        throw new Error('filters must be an array');
    }
    return ['REQ', id, ...filters];
}
/**
 * Formats a close message for relay transmission
 */
export function formatCloseForRelay(id) {
    return ['CLOSE', id];
}
