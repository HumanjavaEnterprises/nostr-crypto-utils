/**
 * NIP-19: bech32-encoded entities
 * Implements encoding and decoding of Nostr entities using bech32 format
 */
import { bech32 } from 'bech32';
import { Buffer } from 'buffer';
const VALID_PREFIXES = ['npub', 'nsec', 'note', 'nprofile', 'nevent', 'naddr', 'nrelay'];
// TLV type constants
const TLV_TYPES = {
    SPECIAL: 0, // Main data (hex)
    RELAY: 1, // Relay URL (utf8)
    AUTHOR: 2, // Author pubkey (hex)
    KIND: 3, // Event kind (uint8)
    IDENTIFIER: 4 // Identifier (utf8)
};
/**
 * Encode a public key as an npub
 * @param pubkey Public key in hex format
 * @returns bech32-encoded npub string
 * @throws {Error} If pubkey is invalid
 */
export function npubEncode(pubkey) {
    validateHexString(pubkey, 64);
    const data = Buffer.from(pubkey, 'hex');
    const words = bech32.toWords(data);
    return bech32.encode('npub', words, 1000);
}
/**
 * Encode a private key as an nsec
 * @param privkey Private key in hex format
 * @returns bech32-encoded nsec string
 * @throws {Error} If privkey is invalid
 */
export function nsecEncode(privkey) {
    validateHexString(privkey, 64);
    const data = Buffer.from(privkey, 'hex');
    const words = bech32.toWords(data);
    return bech32.encode('nsec', words, 1000);
}
/**
 * Encode an event ID as a note
 * @param eventId Event ID in hex format
 * @returns bech32-encoded note string
 * @throws {Error} If eventId is invalid
 */
export function noteEncode(eventId) {
    validateHexString(eventId, 64);
    const data = Buffer.from(eventId, 'hex');
    const words = bech32.toWords(data);
    return bech32.encode('note', words, 1000);
}
/**
 * Encode profile information
 * @param pubkey Public key in hex format
 * @param relays Optional relay URLs
 * @returns bech32-encoded nprofile string
 * @throws {Error} If pubkey is invalid or relays are malformed
 */
export function nprofileEncode(pubkey, relays) {
    validateHexString(pubkey, 64);
    if (relays) {
        relays.forEach(validateRelayUrl);
    }
    const data = encodeTLV({
        type: 'nprofile',
        data: pubkey,
        relays
    });
    return bech32.encode('nprofile', data, 1000);
}
/**
 * Encode event information
 * @param eventId Event ID in hex format
 * @param relays Optional relay URLs
 * @param author Optional author public key
 * @param kind Optional event kind
 * @returns bech32-encoded nevent string
 * @throws {Error} If parameters are invalid
 */
export function neventEncode(eventId, relays, author, kind) {
    validateHexString(eventId, 64);
    if (relays) {
        relays.forEach(validateRelayUrl);
    }
    if (author) {
        validateHexString(author, 64);
    }
    if (kind !== undefined && !Number.isInteger(kind)) {
        throw new Error('Invalid event kind');
    }
    const data = encodeTLV({
        type: 'nevent',
        data: eventId,
        relays,
        author,
        kind
    });
    return bech32.encode('nevent', data, 1000);
}
/**
 * Encode an address (NIP-33)
 * @param pubkey Author's public key
 * @param kind Event kind
 * @param identifier String identifier
 * @param relays Optional relay URLs
 * @returns bech32-encoded naddr string
 * @throws {Error} If parameters are invalid
 */
export function naddrEncode(pubkey, kind, identifier, relays) {
    validateHexString(pubkey, 64);
    if (!Number.isInteger(kind)) {
        throw new Error('Invalid event kind');
    }
    if (!identifier) {
        throw new Error('Identifier is required');
    }
    if (relays) {
        relays.forEach(validateRelayUrl);
    }
    const data = encodeTLV({
        type: 'naddr',
        data: pubkey,
        kind,
        identifier,
        relays
    });
    return bech32.encode('naddr', data, 1000);
}
/**
 * Encode a relay URL
 * @param url Relay URL
 * @returns bech32-encoded nrelay string
 * @throws {Error} If URL is invalid
 */
export function nrelayEncode(url) {
    validateRelayUrl(url);
    const data = Buffer.from(url, 'utf8');
    const words = bech32.toWords(data);
    return bech32.encode('nrelay', words, 1000);
}
/**
 * Decode a bech32-encoded Nostr entity
 * @param str bech32-encoded string
 * @returns Decoded data with type and metadata
 * @throws {Error} If string is invalid or malformed
 */
export function decode(str) {
    if (!str.includes('1')) {
        throw new Error('Invalid bech32 string');
    }
    const prefix = str.split('1')[0].toLowerCase();
    if (!VALID_PREFIXES.includes(prefix)) {
        throw new Error('Unknown prefix');
    }
    try {
        const decoded = bech32.decode(str, 1000);
        const data = Buffer.from(bech32.fromWords(decoded.words));
        // For nrelay type
        let url;
        // For TLV types
        let decodedData;
        switch (decoded.prefix) {
            case 'npub':
            case 'nsec':
            case 'note':
                validateHexString(data.toString('hex'), 64);
                return {
                    type: decoded.prefix,
                    data: data.toString('hex')
                };
            case 'nrelay':
                url = data.toString('utf8');
                validateRelayUrl(url);
                return {
                    type: 'nrelay',
                    data: url
                };
            case 'nprofile':
            case 'nevent':
            case 'naddr':
                decodedData = decodeTLV(decoded.prefix, data);
                return decodedData;
            default:
                throw new Error('Unknown prefix');
        }
    }
    catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Invalid bech32 string');
    }
}
// Helper functions
function validateHexString(str, length) {
    if (!/^[0-9a-fA-F]+$/.test(str)) {
        throw new Error('Invalid hex string');
    }
    if (length && str.length !== length) {
        throw new Error(`Invalid hex string length (expected ${length})`);
    }
}
function validateRelayUrl(url) {
    try {
        const parsed = new URL(url);
        if (!['ws:', 'wss:'].includes(parsed.protocol)) {
            throw new Error('Invalid relay URL protocol');
        }
    }
    catch {
        throw new Error('Invalid relay URL');
    }
}
function encodeTLV(data) {
    const result = [];
    // Special (type 0): main data
    const bytes = Buffer.from(data.data, 'hex');
    result.push(TLV_TYPES.SPECIAL, bytes.length);
    result.push(...bytes);
    // Relay (type 1): relay URLs
    if (data.relays?.length) {
        for (const relay of data.relays) {
            const relayBytes = Buffer.from(relay, 'utf8');
            result.push(TLV_TYPES.RELAY, relayBytes.length);
            result.push(...relayBytes);
        }
    }
    // Author (type 2): author pubkey
    if (data.author) {
        const authorBytes = Buffer.from(data.author, 'hex');
        result.push(TLV_TYPES.AUTHOR, authorBytes.length);
        result.push(...authorBytes);
    }
    // Kind (type 3): event kind
    if (data.kind !== undefined) {
        const kindBytes = Buffer.alloc(4);
        kindBytes.writeUInt32BE(data.kind);
        result.push(TLV_TYPES.KIND, kindBytes.length);
        result.push(...kindBytes);
    }
    // Identifier (type 4): for naddr
    if (data.identifier) {
        const identifierBytes = Buffer.from(data.identifier, 'utf8');
        result.push(TLV_TYPES.IDENTIFIER, identifierBytes.length);
        result.push(...identifierBytes);
    }
    return bech32.toWords(Buffer.from(result));
}
function decodeTLV(prefix, data) {
    const result = {
        type: prefix,
        data: '',
        relays: []
    };
    let i = 0;
    // For relay type
    let relay;
    while (i < data.length) {
        const type = data[i];
        const length = data[i + 1];
        if (i + 2 + length > data.length) {
            throw new Error('Invalid TLV data');
        }
        const value = data.slice(i + 2, i + 2 + length);
        switch (type) {
            case TLV_TYPES.SPECIAL:
                result.data = value.toString('hex');
                validateHexString(result.data, 64);
                break;
            case TLV_TYPES.RELAY:
                relay = value.toString('utf8');
                validateRelayUrl(relay);
                result.relays = result.relays || [];
                result.relays.push(relay);
                break;
            case TLV_TYPES.AUTHOR:
                result.author = value.toString('hex');
                validateHexString(result.author, 64);
                break;
            case TLV_TYPES.KIND:
                result.kind = value.readUInt32BE();
                break;
            case TLV_TYPES.IDENTIFIER:
                result.identifier = value.toString('utf8');
                break;
            default:
                // Skip unknown TLV types
                break;
        }
        i += 2 + length;
    }
    return result;
}
//# sourceMappingURL=nip-19.js.map