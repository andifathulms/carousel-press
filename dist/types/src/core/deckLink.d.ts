/** Decoded deck text over this many UTF-8 bytes is rejected. */
export declare const DECK_LINK_MAX_BYTES: number;
export declare const DECK_LINK_KEY = "deck";
export type DeckLinkResult = {
    ok: true;
    text: string;
} | {
    ok: false;
    reason: 'missing' | 'base64' | 'utf8' | 'too-large';
};
export declare function base64urlEncode(bytes: Uint8Array): string;
/** Strict base64url: only `A–Z a–z 0–9 - _`, no padding. Returns null when invalid. */
export declare function base64urlDecode(s: string): Uint8Array | null;
/** `base` (its own fragment dropped) + `#deck=<data>`. */
export declare function encodeDeckLink(text: string, base: string): string;
/** The raw `deck=` value of a fragment (`#a=1&deck=…`), or null when absent. */
export declare function deckLinkParam(hash: string): string | null;
/** Decode a location hash. Never throws. */
export declare function decodeDeckLink(hash: string): DeckLinkResult;
