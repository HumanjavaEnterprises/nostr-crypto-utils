/**
 * NIP-26: Delegated Event Signing
 * Implements delegation of event signing capabilities
 */

import { createHash } from 'crypto';
import { NostrEvent } from '../types';
import { signSchnorr, verifySchnorrSignature } from '../crypto';
import { bytesToHex } from '@noble/curves/abstract/utils';

export interface DelegationConditions {
  kind?: number;
  since?: number;
  until?: number;
}

export interface Delegation {
  delegator: string;
  delegatee: string;
  conditions: DelegationConditions;
  token: string;
}

/**
 * Create a delegation token
 * @param delegator Delegator's private key
 * @param delegatee Delegatee's public key
 * @param conditions Delegation conditions
 * @returns Delegation token
 */
export function createDelegation(
  delegator: string,
  delegatee: string,
  conditions: DelegationConditions
): Delegation {
  const conditionsString = serializeConditions(conditions);
  const token = signDelegation(delegator, delegatee, conditionsString);

  return {
    delegator,
    delegatee,
    conditions,
    token
  };
}

/**
 * Verify a delegation token
 * @param delegation Delegation to verify
 * @returns True if valid, false otherwise
 */
export async function verifyDelegation(delegation: Delegation): Promise<boolean> {
  const conditionsString = serializeConditions(delegation.conditions);
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
  const now = Math.floor(Date.now() / 1000);

  if (conditions.kind !== undefined && event.kind !== conditions.kind) {
    return false;
  }

  if (conditions.since !== undefined && event.created_at < conditions.since) {
    return false;
  }

  if (conditions.until !== undefined && event.created_at > conditions.until) {
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
    serializeConditions(delegation.conditions),
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

  return {
    delegator: tag[1],
    delegatee: event.pubkey,
    conditions: parseConditions(tag[2]),
    token: tag[3]
  };
}

// Helper functions
function serializeConditions(conditions: DelegationConditions): string {
  const parts: string[] = [];

  if (conditions.kind !== undefined) {
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

function parseConditions(conditionsString: string): DelegationConditions {
  const conditions: DelegationConditions = {};
  const parts = conditionsString.split('&');

  for (const part of parts) {
    if (part.startsWith('kind=')) {
      conditions.kind = parseInt(part.slice(5));
    } else if (part.startsWith('created_at>')) {
      conditions.since = parseInt(part.slice(11));
    } else if (part.startsWith('created_at<')) {
      conditions.until = parseInt(part.slice(11));
    }
  }

  return conditions;
}

function signDelegation(
  delegator: string,
  delegatee: string,
  conditions: string
): string {
  const message = `nostr:delegation:${delegatee}:${conditions}`;
  const hash = createHash('sha256').update(message).digest();
  const signature = signSchnorr(hash, delegator);
  return bytesToHex(signature);
}

async function verifyDelegationSignature(
  delegator: string,
  delegatee: string,
  conditions: string,
  signature: string
): Promise<boolean> {
  const message = createHash('sha256')
    .update(Buffer.from(`nostr:delegation:${delegatee}:${conditions}`))
    .digest();
  
  return verifySchnorrSignature(message, delegator, signature);
}
