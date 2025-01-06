import { SignedNostrEvent, NostrFilter } from './base.js';

export type NostrMessageTuple = 
  | ['EVENT', SignedNostrEvent]
  | ['NOTICE', string]
  | ['OK', string, boolean, string]
  | ['EOSE', string]
  | ['REQ', string, ...NostrFilter[]]
  | ['CLOSE', string]
  | ['AUTH', SignedNostrEvent];
