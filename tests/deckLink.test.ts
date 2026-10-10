import { describe, expect, it } from 'vitest';
import {
  DECK_LINK_MAX_BYTES, base64urlDecode, base64urlEncode, decodeDeckLink, deckLinkParam, encodeDeckLink,
} from '../src/core/deckLink';
import { mulberry32 } from '../src/core/hash';
import { parse } from '../src/core/parser';
import { deckLinkError } from '../src/ui/deckLinkImport';

const BASE = 'https://andifathulms.github.io/carousel-press/';
const hashOf = (link: string) => link.slice(link.indexOf('#'));
const roundTrip = (text: string) => decodeDeckLink(hashOf(encodeDeckLink(text, BASE)));

describe('round trip', () => {
  const cases: Record<string, string> = {
    ascii: 'handle: @x\n---\nHello world\nA body line.',
    indonesian: '[cover kicker="SEJARAH"]\nKerajaan Kutai | Kerajaan Tertua di Nusantara\nYupa, prasasti, dan Mulawarman.',
    symbols: 'Simpan • Bagikan × 3 — kata *aksen* | baris `kode` \\| pipa',
    crlf: 'title: T\r\n---\r\nA\r\n---\r\n[end]\r\nB\r\n',
    emoji: 'Simpan dulu ⭐🤍 👩🏽‍💻 🇮🇩',
    empty: '',
  };
  for (const [name, text] of Object.entries(cases)) {
    it(name, () => {
      expect(roundTrip(text)).toEqual({ ok: true, text });
    });
  }
  it('uses only the base64url alphabet, without padding', () => {
    for (const text of Object.values(cases)) {
      expect(hashOf(encodeDeckLink(text, BASE))).toMatch(/^#deck=[A-Za-z0-9_-]*$/);
    }
  });
  it('replaces an existing fragment on the base', () => {
    expect(encodeDeckLink('A', `${BASE}#old`)).toBe(`${BASE}#deck=QQ`);
  });
  it('encodes and decodes every padding length', () => {
    for (let n = 0; n < 8; n++) {
      const bytes = Uint8Array.from({ length: n }, (_, i) => (i * 97 + 13) & 0xff);
      expect(base64urlDecode(base64urlEncode(bytes))).toEqual(bytes);
      expect(base64urlEncode(bytes)).toBe(Buffer.from(bytes).toString('base64url'));
    }
  });
});

describe('NusaStats compatibility', () => {
  const hash = '#deck=dGVtcGxhdGU6IGVkaXRvcmlhbC9taWRuaWdodAotLS0KW2NvdmVyIGtpY2tlcj0iREFUQSDigKIgQlBTIDIwMjUiXQpSYXRhLXJhdGEgTGFtYSBTZWtvbGFoIHwgNSBUZXJ0aW5nZ2kKMTMsMzcgw5cgbGlwYXQg4oCUIEJhbmRhIEFjZWgK';
  const text = 'template: editorial/midnight\n---\n[cover kicker="DATA • BPS 2025"]\nRata-rata Lama Sekolah | 5 Tertinggi\n13,37 × lipat — Banda Aceh\n';
  it('decodes the reference fragment to the exact text', () => {
    expect(decodeDeckLink(hash)).toEqual({ ok: true, text });
  });
  it('encodes the reference text to the exact fragment', () => {
    expect(hashOf(encodeDeckLink(text, BASE))).toBe(hash);
  });
  it('parses like any deck', () => {
    const r = parse(text);
    expect(r.warnings).toEqual([]);
    expect(r.deck.template).toBe('editorial/midnight');
    expect(r.deck.slides[0]!.attrs.kicker).toBe('DATA • BPS 2025');
  });
});

describe('rejects', () => {
  it('a + or / character (standard base64, not base64url)', () => {
    expect(decodeDeckLink('#deck=ab+c')).toEqual({ ok: false, reason: 'base64' });
    expect(decodeDeckLink('#deck=ab/c')).toEqual({ ok: false, reason: 'base64' });
  });
  it('padding, whitespace, percent-escapes and impossible lengths', () => {
    for (const bad of ['QQ==', 'Q Q', 'QQ%3D', 'Q', 'QUJDR']) {
      expect(decodeDeckLink(`#deck=${bad}`)).toEqual({ ok: false, reason: 'base64' });
    }
  });
  it('invalid UTF-8 bytes', () => {
    for (const bytes of [[0xff, 0xfe], [0xc3], [0xe2, 0x80], [0xed, 0xa0, 0x80], [0xc0, 0xaf]]) {
      expect(decodeDeckLink(`#deck=${base64urlEncode(Uint8Array.from(bytes))}`)).toEqual({ ok: false, reason: 'utf8' });
    }
  });
  it('over 100 KB of decoded text, but accepts exactly 100 KB', () => {
    expect(roundTrip('a'.repeat(DECK_LINK_MAX_BYTES))).toEqual({ ok: true, text: 'a'.repeat(DECK_LINK_MAX_BYTES) });
    expect(roundTrip('a'.repeat(DECK_LINK_MAX_BYTES + 1))).toEqual({ ok: false, reason: 'too-large' });
    // Multi-byte characters count by their UTF-8 bytes.
    expect(roundTrip('×'.repeat(DECK_LINK_MAX_BYTES / 2 + 1))).toEqual({ ok: false, reason: 'too-large' });
  });
  it('a hash without deck=', () => {
    for (const h of ['', '#', '#foo=bar', '#decks=QQ', '#xdeck=QQ']) {
      expect(decodeDeckLink(h)).toEqual({ ok: false, reason: 'missing' });
    }
  });
});

describe('fragment parsing', () => {
  it('finds deck= among other fragment params', () => {
    expect(deckLinkParam('#a=1&deck=QQ&b=2')).toBe('QQ');
    expect(decodeDeckLink('#a=1&deck=QQ')).toEqual({ ok: true, text: 'A' });
  });
});

describe('robustness', () => {
  it('never throws on random input (fuzz, 1,000 strings)', () => {
    const rng = mulberry32(2026);
    const alphabet = ['#', 'deck=', '&', '=', '+', '/', '-', '_', '%', 'A', 'z', '0', '9', 'QQ', '__', '8J-k', ' '];
    for (let n = 0; n < 1000; n++) {
      let s = rng() < 0.7 ? '#deck=' : '';
      const len = Math.floor(rng() * 120);
      for (let i = 0; i < len; i++) {
        s += rng() < 0.2 ? String.fromCharCode(Math.floor(rng() * 0xffff)) : alphabet[Math.floor(rng() * alphabet.length)];
      }
      expect(() => decodeDeckLink(s)).not.toThrow();
      const r = decodeDeckLink(s);
      if (r.ok) expect(() => parse(r.text)).not.toThrow();
    }
  });
});

describe('error message', () => {
  it('is Indonesian for id browsers, English otherwise', () => {
    expect(deckLinkError('id-ID')).toBe('Tautan deck tidak bisa dibaca');
    expect(deckLinkError('en-US')).toBe("Couldn't read the deck link");
    expect(deckLinkError(undefined)).toBe("Couldn't read the deck link");
  });
});
