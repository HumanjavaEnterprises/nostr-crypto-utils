/**
 * NIP-19: bech32-encoded entities
 * Implements encoding and decoding of Nostr entities using bech32 format
 */
export type Nip19DataType = 'npub' | 'nsec' | 'note' | 'nprofile' | 'nevent' | 'naddr' | 'nrelay';
export interface Nip19Data {
    type: Nip19DataType;
    data: string;
    relays?: string[];
    author?: string;
    kind?: number;
    identifier?: string;
}
/**
 * Encode a public key as an npub
 * @param pubkey Public key in hex format
 * @returns bech32-encoded npub string
 * @throws {Error} If pubkey is invalid
 */
export declare function npubEncode(pubkey: string): string;
/**
 * Encode a private key as an nsec
 * @param privkey Private key in hex format
 * @returns bech32-encoded nsec string
 * @throws {Error} If privkey is invalid
 */
export declare function nsecEncode(privkey: string): string;
/**
 * Encode an event ID as a note
 * @param eventId Event ID in hex format
 * @returns bech32-encoded note string
 * @throws {Error} If eventId is invalid
 */
export declare function noteEncode(eventId: string): string;
/**
 * Encode profile information
 * @param pubkey Public key in hex format
 * @param relays Optional relay URLs
 * @returns bech32-encoded nprofile string
 * @throws {Error} If pubkey is invalid or relays are malformed
 */
export declare function nprofileEncode(pubkey: string, relays?: string[]): string;
/**
 * Encode event information
 * @param eventId Event ID in hex format
 * @param relays Optional relay URLs
 * @param author Optional author public key
 * @param kind Optional event kind
 * @returns bech32-encoded nevent string
 * @throws {Error} If parameters are invalid
 */
export declare function neventEncode(eventId: string, relays?: string[], author?: string, kind?: number): string;
/**
 * Encode an address (NIP-33)
 * @param pubkey Author's public key
 * @param kind Event kind
 * @param identifier String identifier
 * @param relays Optional relay URLs
 * @returns bech32-encoded naddr string
 * @throws {Error} If parameters are invalid
 */
export declare function naddrEncode(pubkey: string, kind: number, identifier: string, relays?: string[]): string;
/**
 * Encode a relay URL
 * @param url Relay URL
 * @returns bech32-encoded nrelay string
 * @throws {Error} If URL is invalid
 */
export declare function nrelayEncode(url: string): string;
/**
 * Decode a bech32-encoded Nostr entity
 * @param str bech32-encoded string
 * @returns Decoded data with type and metadata
 * @throws {Error} If string is invalid or malformed
 */
export declare function decode(str: string): Nip19Data;
//# sourceMappingURL=nip-19.d.ts.map