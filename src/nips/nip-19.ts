/**
 * NIP-19: bech32-encoded entities
 * Implements encoding and decoding of Nostr entities using bech32 format
 */

import { bech32 } from 'bech32';
import { Buffer } from 'buffer';

export type Nip19DataType = 'npub' | 'nsec' | 'note' | 'nprofile' | 'nevent' | 'naddr' | 'nrelay';

export interface Nip19Data {
  type: Nip19DataType;
  data: string;
  relays?: string[];
  author?: string;
  kind?: number;
}

/**
 * Encode a public key as an npub
 * @param pubkey Public key in hex format
 * @returns bech32-encoded npub string
 */
export function npubEncode(pubkey: string): string {
  const data = Buffer.from(pubkey, 'hex');
  const words = bech32.toWords(data);
  return bech32.encode('npub', words, 1000);
}

/**
 * Encode a private key as an nsec
 * @param privkey Private key in hex format
 * @returns bech32-encoded nsec string
 */
export function nsecEncode(privkey: string): string {
  const data = Buffer.from(privkey, 'hex');
  const words = bech32.toWords(data);
  return bech32.encode('nsec', words, 1000);
}

/**
 * Encode an event ID as a note
 * @param eventId Event ID in hex format
 * @returns bech32-encoded note string
 */
export function noteEncode(eventId: string): string {
  const data = Buffer.from(eventId, 'hex');
  const words = bech32.toWords(data);
  return bech32.encode('note', words, 1000);
}

/**
 * Encode profile information
 * @param pubkey Public key in hex format
 * @param relays Optional relay URLs
 * @returns bech32-encoded nprofile string
 */
export function nprofileEncode(pubkey: string, relays?: string[]): string {
  const data = encodeTLV({
    type: 'nprofile',
    data: pubkey,
    relays: relays ? [relays[0]] : undefined // Only use first relay
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
 */
export function neventEncode(
  eventId: string,
  relays?: string[],
  author?: string,
  kind?: number
): string {
  const data = encodeTLV({
    type: 'nevent',
    data: eventId,
    relays: relays ? [relays[0]] : undefined, // Only use first relay
    author,
    kind
  });
  return bech32.encode('nevent', data, 1000);
}

/**
 * Decode a bech32-encoded Nostr entity
 * @param str bech32-encoded string
 * @returns Decoded data with type and metadata
 */
export function decode(str: string): Nip19Data {
  // First validate basic string format
  if (!str.includes('1')) {
    throw new Error('Invalid bech32 string');
  }

  // Then validate the prefix
  const prefix = str.split('1')[0];
  if (!['npub', 'nsec', 'note', 'nprofile', 'nevent', 'naddr', 'nrelay'].includes(prefix)) {
    throw new Error('Unknown prefix');
  }

  try {
    const decoded = bech32.decode(str, 1000);
    const data = Buffer.from(bech32.fromWords(decoded.words));

    switch (decoded.prefix) {
      case 'npub':
      case 'nsec':
      case 'note':
        return {
          type: decoded.prefix as Nip19DataType,
          data: data.toString('hex')
        };
      case 'nprofile':
      case 'nevent':
      case 'naddr':
      case 'nrelay':
        return decodeTLV(decoded.prefix as Nip19DataType, data);
      default:
        throw new Error('Unknown prefix');
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'Unknown prefix') {
        throw error;
      }
    }
    throw new Error('Invalid bech32 string');
  }
}

// Helper functions
export function encodeBytes(prefix: string, data: Uint8Array): string {
  const words = bech32.toWords(data);
  return bech32.encode(prefix, words, 1000);
}

function encodeTLV(data: Nip19Data): number[] {
  const result: number[] = [];
  
  // Special (type 0): main data
  const bytes = Buffer.from(data.data, 'hex');
  result.push(0, bytes.length);
  result.push(...bytes);

  // Relay (type 1): relay URLs
  if (data.relays) {
    // Only use first relay to keep size down
    const relay = data.relays[0];
    if (relay) {
      const relayBytes = Buffer.from(relay, 'utf8');
      result.push(1, relayBytes.length);
      result.push(...relayBytes);
    }
  }

  // Author (type 2): author pubkey
  if (data.author) {
    const authorBytes = Buffer.from(data.author, 'hex');
    result.push(2, authorBytes.length);
    result.push(...authorBytes);
  }

  // Kind (type 3): event kind
  if (data.kind !== undefined) {
    const kindBytes = Buffer.alloc(1);
    kindBytes.writeUInt8(data.kind);
    result.push(3, kindBytes.length);
    result.push(...kindBytes);
  }

  return bech32.toWords(Buffer.from(result));
}

function decodeTLV(prefix: Nip19DataType, data: Buffer): Nip19Data {
  const result: Nip19Data = {
    type: prefix,
    data: '',
    relays: []
  };

  let i = 0;
  while (i < data.length) {
    const type = data[i];
    const length = data[i + 1];
    const value = data.slice(i + 2, i + 2 + length);

    switch (type) {
      case 0: // Special
        result.data = value.toString('hex');
        break;
      case 1: // Relay
        result.relays = result.relays || [];
        result.relays.push(value.toString('utf8'));
        break;
      case 2: // Author
        result.author = value.toString('hex');
        break;
      case 3: // Kind
        result.kind = value.readUInt8();
        break;
    }

    i += 2 + length;
  }

  return result;
}
