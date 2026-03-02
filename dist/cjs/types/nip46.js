"use strict";
/**
 * @module types/nip46
 * @description Type definitions for NIP-46 (Nostr Connect / Remote Signing)
 * @see https://github.com/nostr-protocol/nips/blob/master/46.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nip46Method = void 0;
/**
 * NIP-46 remote signing methods
 */
var Nip46Method;
(function (Nip46Method) {
    Nip46Method["CONNECT"] = "connect";
    Nip46Method["PING"] = "ping";
    Nip46Method["GET_PUBLIC_KEY"] = "get_public_key";
    Nip46Method["SIGN_EVENT"] = "sign_event";
    Nip46Method["NIP04_ENCRYPT"] = "nip04_encrypt";
    Nip46Method["NIP04_DECRYPT"] = "nip04_decrypt";
    Nip46Method["NIP44_ENCRYPT"] = "nip44_encrypt";
    Nip46Method["NIP44_DECRYPT"] = "nip44_decrypt";
    Nip46Method["GET_RELAYS"] = "get_relays";
})(Nip46Method || (exports.Nip46Method = Nip46Method = {}));
//# sourceMappingURL=nip46.js.map