"use strict";
/**
 * NIP-26: Delegated Event Signing
 * Implements delegation of event signing capabilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDelegation = createDelegation;
exports.verifyDelegation = verifyDelegation;
exports.checkDelegationConditions = checkDelegationConditions;
exports.addDelegationTag = addDelegationTag;
exports.extractDelegation = extractDelegation;
const sha256_1 = require("@noble/hashes/sha256");
const crypto_1 = require("../crypto");
const utils_1 = require("@noble/curves/abstract/utils");
/**
 * Create a delegation token
 * @param delegator Delegator's private key
 * @param delegatee Delegatee's public key
 * @param conditions Delegation conditions
 * @returns Delegation token
 */
function createDelegation(delegator, delegatee, conditions) {
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
async function verifyDelegation(delegation) {
    const conditionsString = serializeConditions(delegation.conditions);
    return await verifyDelegationSignature(delegation.delegator, delegation.delegatee, conditionsString, delegation.token);
}
/**
 * Check if an event meets delegation conditions
 * @param event Event to check
 * @param conditions Delegation conditions
 * @returns True if conditions are met
 */
function checkDelegationConditions(event, conditions) {
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
function addDelegationTag(event, delegation) {
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
function extractDelegation(event) {
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
function serializeConditions(conditions) {
    const parts = [];
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
function parseConditions(conditionsString) {
    const conditions = {};
    const parts = conditionsString.split('&');
    for (const part of parts) {
        if (part.startsWith('kind=')) {
            conditions.kind = parseInt(part.slice(5));
        }
        else if (part.startsWith('created_at>')) {
            conditions.since = parseInt(part.slice(11));
        }
        else if (part.startsWith('created_at<')) {
            conditions.until = parseInt(part.slice(11));
        }
    }
    return conditions;
}
function signDelegation(delegator, delegatee, conditions) {
    const message = `nostr:delegation:${delegatee}:${conditions}`;
    const hash = (0, sha256_1.sha256)(new TextEncoder().encode(message));
    const signature = (0, crypto_1.signSchnorr)(hash, delegator);
    return (0, utils_1.bytesToHex)(signature);
}
async function verifyDelegationSignature(delegator, delegatee, conditions, signature) {
    const msgHash = (0, sha256_1.sha256)(new TextEncoder().encode(`nostr:delegation:${delegatee}:${conditions}`));
    return (0, crypto_1.verifySchnorrSignature)(msgHash, delegator, signature);
}
//# sourceMappingURL=nip-26.js.map