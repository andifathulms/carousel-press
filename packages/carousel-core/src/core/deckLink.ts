// Deck links: `#deck=<base64url of the UTF-8 deck text>` (RFC 4648 §5, no
// padding). The deck travels in the URL fragment, which never reaches a server.
// Pure: no DOM.

/** Decoded deck text over this many UTF-8 bytes is rejected. */
export const DECK_LINK_MAX_BYTES = 100 * 1024;
export const DECK_LINK_KEY = 'deck';

export type DeckLinkResult =
  | { ok: true; text: string }
  | { ok: false; reason: 'missing' | 'base64' | 'utf8' | 'too-large' };

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const VALUE = new Map<string, number>([...ALPHABET].map((ch, i) => [ch, i]));

export function base64urlEncode(bytes: Uint8Array): string {
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const n = (bytes[i]! << 16) | ((bytes[i + 1] ?? 0) << 8) | (bytes[i + 2] ?? 0);
    const chars = Math.min(4, Math.ceil(((bytes.length - i) * 8) / 6));
    for (let k = 0; k < chars; k++) out += ALPHABET[(n >> (18 - 6 * k)) & 63];
  }
  return out;
}

/** Strict base64url: only `A–Z a–z 0–9 - _`, no padding. Returns null when invalid. */
export function base64urlDecode(s: string): Uint8Array | null {
  if (s.length % 4 === 1) return null;
  const out = new Uint8Array(Math.floor((s.length * 6) / 8));
  let acc = 0;
  let bits = 0;
  let o = 0;
  for (const ch of s) {
    const v = VALUE.get(ch);
    if (v === undefined) return null;
    acc = ((acc << 6) | v) & 0xffffff;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out[o++] = (acc >> bits) & 0xff;
    }
  }
  return out;
}

/** `base` (its own fragment dropped) + `#deck=<data>`. */
export function encodeDeckLink(text: string, base: string): string {
  const data = base64urlEncode(new TextEncoder().encode(text));
  return `${base.replace(/#.*$/s, '')}#${DECK_LINK_KEY}=${data}`;
}

/** The raw `deck=` value of a fragment (`#a=1&deck=…`), or null when absent. */
export function deckLinkParam(hash: string): string | null {
  const body = hash.startsWith('#') ? hash.slice(1) : hash;
  for (const part of body.split('&')) {
    if (part.startsWith(`${DECK_LINK_KEY}=`)) return part.slice(DECK_LINK_KEY.length + 1);
  }
  return null;
}

/** Decode a location hash. Never throws. */
export function decodeDeckLink(hash: string): DeckLinkResult {
  try {
    const data = deckLinkParam(String(hash));
    if (data === null) return { ok: false, reason: 'missing' };
    // Cheap size check before decoding: 4 chars carry 3 bytes.
    if (Math.floor((data.length * 3) / 4) > DECK_LINK_MAX_BYTES) return { ok: false, reason: 'too-large' };
    const bytes = base64urlDecode(data);
    if (!bytes) return { ok: false, reason: 'base64' };
    if (bytes.length > DECK_LINK_MAX_BYTES) return { ok: false, reason: 'too-large' };
    const text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes);
    return { ok: true, text };
  } catch {
    return { ok: false, reason: 'utf8' };
  }
}
