import { describe, expect, it } from 'vitest';
import {
  npubEncode,
  nsecEncode,
  noteEncode,
  nprofileEncode,
  neventEncode,
  decode
} from '../../nips/nip-19';

describe('NIP-19: Bech32 Entities', () => {
  const samplePubkey = '3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d';
  const samplePrivkey = '123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234';
  const sampleEventId = 'cf8de9db67a1d7261b705d9b9f4b77013e96f75e3b876fd79a90dfeaa37d4e35';

  it('should encode and decode public key', () => {
    const encoded = npubEncode(samplePubkey);
    expect(encoded).toMatch(/^npub1/);
    
    const decoded = decode(encoded);
    expect(decoded.type).toBe('npub');
    expect(decoded.data).toBe(samplePubkey);
  });

  it('should encode and decode private key', () => {
    const encoded = nsecEncode(samplePrivkey);
    expect(encoded).toMatch(/^nsec1/);
    
    const decoded = decode(encoded);
    expect(decoded.type).toBe('nsec');
    expect(decoded.data).toBe(samplePrivkey);
  });

  it('should encode and decode note', () => {
    const encoded = noteEncode(sampleEventId);
    expect(encoded).toMatch(/^note1/);
    
    const decoded = decode(encoded);
    expect(decoded.type).toBe('note');
    expect(decoded.data).toBe(sampleEventId);
  });

  it('should encode and decode profile', () => {
    const relays = ['wss://relay.example.com'];
    const encoded = nprofileEncode(samplePubkey, relays);
    expect(encoded).toMatch(/^nprofile1/);
    
    const decoded = decode(encoded);
    expect(decoded.type).toBe('nprofile');
    expect(decoded.data).toBe(samplePubkey);
    expect(decoded.relays).toEqual(relays);
  });

  it('should encode and decode event', () => {
    const relays = ['wss://relay.example.com'];
    const author = samplePubkey;
    const kind = 1;
    
    const encoded = neventEncode(sampleEventId, relays, author, kind);
    expect(encoded).toMatch(/^nevent1/);
    
    const decoded = decode(encoded);
    expect(decoded.type).toBe('nevent');
    expect(decoded.data).toBe(sampleEventId);
    expect(decoded.relays).toEqual(relays);
    expect(decoded.author).toBe(author);
    expect(decoded.kind).toBe(kind);
  });

  it('should throw error for invalid bech32 string', () => {
    expect(() => decode('invalid')).toThrow('Invalid bech32 string');
  });

  it('should throw error for unknown prefix', () => {
    // Create a valid bech32 string with unknown prefix
    const encoded = npubEncode(samplePubkey).replace('npub', 'test');
    expect(() => decode(encoded)).toThrow('Unknown prefix');
  });
});
