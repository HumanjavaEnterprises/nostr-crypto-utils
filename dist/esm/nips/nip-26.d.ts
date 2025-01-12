/**
 * NIP-26: Delegated Event Signing
 * Implements delegation of event signing capabilities
 */
import { NostrEvent } from '../types';
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
export declare function createDelegation(delegator: string, delegatee: string, conditions: DelegationConditions): Delegation;
/**
 * Verify a delegation token
 * @param delegation Delegation to verify
 * @returns True if valid, false otherwise
 */
export declare function verifyDelegation(delegation: Delegation): Promise<boolean>;
/**
 * Check if an event meets delegation conditions
 * @param event Event to check
 * @param conditions Delegation conditions
 * @returns True if conditions are met
 */
export declare function checkDelegationConditions(event: NostrEvent, conditions: DelegationConditions): boolean;
/**
 * Add delegation tag to an event
 * @param event Event to add delegation to
 * @param delegation Delegation to add
 * @returns Updated event
 */
export declare function addDelegationTag(event: NostrEvent, delegation: Delegation): NostrEvent;
/**
 * Extract delegation from an event
 * @param event Event to extract delegation from
 * @returns Delegation or null if not found
 */
export declare function extractDelegation(event: NostrEvent): Delegation | null;
//# sourceMappingURL=nip-26.d.ts.map