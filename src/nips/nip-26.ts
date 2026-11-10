/**
 * NIP-26: Delegated Event Signing
 * Implements delegation of event signing capabilities
 *
 * @deprecated NIP-26 is `unrecommended` upstream ("adds unnecessary burden for
 * little gain") and cannot revoke without time-bounding. Prefer NIP-46 remote
 * signing for acting on behalf of a key. Retained for compatibility only.
 */

import { sha256 } from '@noble/hashes/sha2.js';
import { NostrEvent } from '../types/index.js';
import { signSchnorr, verifySchnorrSignature } from '../crypto.js';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils.js';
import { schnorr } from '@noble/curves/secp256k1.js';

export interface DelegationConditions {
  kind?: number;
  /** Allowed kinds when the conditions string carries several `kind=` clauses. */
  kinds?: number[];
  /** Event created_at must be strictly greater than this. */
  since?: number;
  /** Event created_at must be strictly less than this. */
  until?: number;
}

export interface Delegation {
  delegator: string;
  delegatee: string;
  conditions: DelegationConditions;
  token: string;
  /**
   * The EXACT conditions query string that was signed (e.g. from the delegation
   * tag). Verification hashes this byte-for-byte rather than re-serializing the
   * parsed conditions, so delegations created by other clients (with a different
   * condition ordering) verify correctly.
   */
  conditionsString?: string;
}

/**
 * Create a delegation token
 * @param delegatorPrivateKey Delegator's private key (used for signing only, never returned)
 * @param delegatee Delegatee's public key
 * @param conditions Delegation conditions
 * @returns Delegation token (delegator field contains the PUBLIC key, not the private key)
 */
export function createDelegation(
  delegatorPrivateKey: string,
  delegatee: string,
  conditions: DelegationConditions
): Delegation {
  const conditionsString = serializeConditions(conditions);
  const token = signDelegation(delegatorPrivateKey, delegatee, conditionsString);

  // Derive the public key from the private key — NEVER return the private key
  const delegatorPublicKey = bytesToHex(schnorr.getPublicKey(hexToBytes(delegatorPrivateKey)));

  return {
    delegator: delegatorPublicKey,
    delegatee,
    conditions,
    token,
    conditionsString
  };
}

/**
 * Verify a delegation token
 * @param delegation Delegation to verify
 * @returns True if valid, false otherwise
 */
export async function verifyDelegation(delegation: Delegation): Promise<boolean> {
  // Use the exact signed conditions string when available (preserves the
  // delegator's byte-for-byte ordering); only fall back to re-serialization
  // for delegations constructed without a raw string.
  const conditionsString = delegation.conditionsString ?? serializeConditions(delegation.conditions);
  return await verifyDelegationSignature(
    delegation.delegator,
    delegation.delegatee,
    conditionsString,
    delegation.token
  );
}

/**
 * Check if an event meets delegation conditions
 * @param event Event to check
 * @param conditions Delegation conditions
 * @returns True if conditions are met
 */
export function checkDelegationConditions(
  event: NostrEvent,
  conditions: DelegationConditions
): boolean {
  const allowedKinds = conditions.kinds ?? (conditions.kind !== undefined ? [conditions.kind] : undefined);
  if (allowedKinds !== undefined && !allowedKinds.includes(event.kind)) {
    return false;
  }

  // NIP-26: `created_at>` and `created_at<` are strict comparisons.
  if (conditions.since !== undefined && !(event.created_at > conditions.since)) {
    return false;
  }

  if (conditions.until !== undefined && !(event.created_at < conditions.until)) {
    return false;
  }

  return true;
}

/**
 * Add delegation tag to an event
 * @param event Event to add delegation to
 * @param delegation Delegation to add
 * @returns Updated event
 */
export function addDelegationTag(
  event: NostrEvent,
  delegation: Delegation
): NostrEvent {
  const tag = [
    'delegation',
    delegation.delegator,
    delegation.conditionsString ?? serializeConditions(delegation.conditions),
    delegation.token
  ];

  return {
    ...event,
    tags: [...event.tags, tag]
  };
}

/**
 * Extract delegation from an event
 * @param event Event to extract delegation from
 * @returns Delegation or null if not found
 */
export function extractDelegation(event: NostrEvent): Delegation | null {
  const tag = event.tags.find(t => t[0] === 'delegation');
  if (!tag || tag.length !== 4) {
    return null;
  }

  // Unparseable conditions fail closed: the delegation is not recognized.
  let conditions: DelegationConditions;
  try {
    conditions = parseConditions(tag[2]);
  } catch {
    return null;
  }

  return {
    delegator: tag[1],
    delegatee: event.pubkey,
    conditions,
    token: tag[3],
    // Preserve the original conditions string exactly as signed by the delegator.
    conditionsString: tag[2]
  };
}

// Helper functions
function serializeConditions(conditions: DelegationConditions): string {
  const parts: string[] = [];

  if (conditions.kinds !== undefined) {
    for (const k of conditions.kinds) parts.push(`kind=${k}`);
  } else if (conditions.kind !== undefined) {
    parts.push(`kind=${conditions.kind}`);
  }
  if (conditions.since !== undefined) {
    parts.push(`created_at>${conditions.since}`);
  }
  if (conditions.until !== undefined) {
    parts.push(`created_at<${conditions.until}`);
  }

  return parts.join('&');
}

function parseUint(raw: string): number {
  if (!/^\d+$/.test(raw)) throw new Error(`invalid delegation condition value: ${raw}`);
  return Number(raw);
}

/**
 * Parse a NIP-26 conditions string. Repeated `kind=` clauses form a set of
 * allowed kinds. Unknown or malformed clauses throw (fail closed).
 */
function parseConditions(conditionsString: string): DelegationConditions {
  const conditions: DelegationConditions = {};
  if (typeof conditionsString !== 'string' || conditionsString === '') return conditions;
  const kinds: number[] = [];

  for (const part of conditionsString.split('&')) {
    if (part.startsWith('kind=')) {
      kinds.push(parseUint(part.slice(5)));
    } else if (part.startsWith('created_at>')) {
      conditions.since = parseUint(part.slice(11));
    } else if (part.startsWith('created_at<')) {
      conditions.until = parseUint(part.slice(11));
    } else {
      throw new Error(`unknown delegation condition: ${part}`);
    }
  }

  if (kinds.length === 1) {
    conditions.kind = kinds[0];
  } else if (kinds.length > 1) {
    conditions.kind = kinds[0];
    conditions.kinds = kinds;
  }

  return conditions;
}

function signDelegation(
  delegator: string,
  delegatee: string,
  conditions: string
): string {
  const message = `nostr:delegation:${delegatee}:${conditions}`;
  const hash = sha256(new TextEncoder().encode(message));
  const signature = signSchnorr(hash, hexToBytes(delegator));
  return bytesToHex(signature);
}

async function verifyDelegationSignature(
  delegator: string,
  delegatee: string,
  conditions: string,
  signature: string
): Promise<boolean> {
  const msgHash = sha256(new TextEncoder().encode(`nostr:delegation:${delegatee}:${conditions}`));

  return verifySchnorrSignature(hexToBytes(signature), msgHash, hexToBytes(delegator));
}
