import { SignedNostrEvent, NostrFilter } from './base';

export type NostrMessageType = 'EVENT' | 'NOTICE' | 'OK' | 'EOSE' | 'REQ' | 'CLOSE' | 'AUTH';

export type NostrMessageTuple = 
  | ['EVENT', SignedNostrEvent]
  | ['NOTICE', string]
  | ['OK', string, boolean, string]
  | ['EOSE', string]
  | ['REQ', string, ...NostrFilter[]]
  | ['CLOSE', string]
  | ['AUTH', SignedNostrEvent];

export interface NostrMessage {
  type: NostrMessageType;
  payload: unknown;
}
