"use strict";
/**
 * NIP-26: Delegated Event Signing
 * Implements delegation of event signing capabilities
 *
 * @deprecated NIP-26 is `unrecommended` upstream ("adds unnecessary burden for
 * little gain") and cannot revoke without time-bounding. Prefer NIP-46 remote
 * signing for acting on behalf of a key. Retained for compatibility only.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDelegation = createDelegation;
exports.verifyDelegation = verifyDelegation;
exports.checkDelegationConditions = checkDelegationConditions;
exports.addDelegationTag = addDelegationTag;
exports.extractDelegation = extractDelegation;
const sha2_js_1 = require("@noble/hashes/sha2.js");
const crypto_js_1 = require("../crypto.js");
const utils_js_1 = require("@noble/hashes/utils.js");
const secp256k1_js_1 = require("@noble/curves/secp256k1.js");
/**
 * Create a delegation token
 * @param delegatorPrivateKey Delegator's private key (used for signing only, never returned)
 * @param delegatee Delegatee's public key
 * @param conditions Delegation conditions
 * @returns Delegation token (delegator field contains the PUBLIC key, not the private key)
 */
function createDelegation(delegatorPrivateKey, delegatee, conditions) {
    const conditionsString = serializeConditions(conditions);
    const token = signDelegation(delegatorPrivateKey, delegatee, conditionsString);
    // Derive the public key from the private key — NEVER return the private key
    const delegatorPublicKey = (0, utils_js_1.bytesToHex)(secp256k1_js_1.schnorr.getPublicKey((0, utils_js_1.hexToBytes)(delegatorPrivateKey)));
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
async function verifyDelegation(delegation) {
    // Use the exact signed conditions string when available (preserves the
    // delegator's byte-for-byte ordering); only fall back to re-serialization
    // for delegations constructed without a raw string.
    const conditionsString = delegation.conditionsString ?? serializeConditions(delegation.conditions);
    return await verifyDelegationSignature(delegation.delegator, delegation.delegatee, conditionsString, delegation.token);
}
/**
 * Check if an event meets delegation conditions
 * @param event Event to check
 * @param conditions Delegation conditions
 * @returns True if conditions are met
 */
function checkDelegationConditions(event, conditions) {
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
function addDelegationTag(event, delegation) {
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
function extractDelegation(event) {
    const tag = event.tags.find(t => t[0] === 'delegation');
    if (!tag || tag.length !== 4) {
        return null;
    }
    // Unparseable conditions fail closed: the delegation is not recognized.
    let conditions;
    try {
        conditions = parseConditions(tag[2]);
    }
    catch {
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
function serializeConditions(conditions) {
    const parts = [];
    if (conditions.kinds !== undefined) {
        for (const k of conditions.kinds)
            parts.push(`kind=${k}`);
    }
    else if (conditions.kind !== undefined) {
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
function parseUint(raw) {
    if (!/^\d+$/.test(raw))
        throw new Error(`invalid delegation condition value: ${raw}`);
    return Number(raw);
}
/**
 * Parse a NIP-26 conditions string. Repeated `kind=` clauses form a set of
 * allowed kinds. Unknown or malformed clauses throw (fail closed).
 */
function parseConditions(conditionsString) {
    const conditions = {};
    if (typeof conditionsString !== 'string' || conditionsString === '')
        return conditions;
    const kinds = [];
    for (const part of conditionsString.split('&')) {
        if (part.startsWith('kind=')) {
            kinds.push(parseUint(part.slice(5)));
        }
        else if (part.startsWith('created_at>')) {
            conditions.since = parseUint(part.slice(11));
        }
        else if (part.startsWith('created_at<')) {
            conditions.until = parseUint(part.slice(11));
        }
        else {
            throw new Error(`unknown delegation condition: ${part}`);
        }
    }
    if (kinds.length === 1) {
        conditions.kind = kinds[0];
    }
    else if (kinds.length > 1) {
        conditions.kind = kinds[0];
        conditions.kinds = kinds;
    }
    return conditions;
}
function signDelegation(delegator, delegatee, conditions) {
    const message = `nostr:delegation:${delegatee}:${conditions}`;
    const hash = (0, sha2_js_1.sha256)(new TextEncoder().encode(message));
    const signature = (0, crypto_js_1.signSchnorr)(hash, (0, utils_js_1.hexToBytes)(delegator));
    return (0, utils_js_1.bytesToHex)(signature);
}
async function verifyDelegationSignature(delegator, delegatee, conditions, signature) {
    const msgHash = (0, sha2_js_1.sha256)(new TextEncoder().encode(`nostr:delegation:${delegatee}:${conditions}`));
    return (0, crypto_js_1.verifySchnorrSignature)((0, utils_js_1.hexToBytes)(signature), msgHash, (0, utils_js_1.hexToBytes)(delegator));
}
