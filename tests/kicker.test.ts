// `kicker=` on cover, card and quote (PRD §4.3).
import { describe, expect, it } from 'vitest';
import { parse } from '../src/core/parser';
import { fakeMeasurer } from '../src/layout/measure';
import { deckIcons, layoutSlide } from '../src/render/renderSlide';
import { VARIANTS } from '../src/templates/registry';

const text = '---\n[cover kicker="Ayat"]\nHook\n---\n[card kicker="Renungan"]\nA reflection.\n---\n[quote kicker="Tafsir" icon=none]\nA quote.\n— Tafsir Ringkas Kemenag RI\n---\n[end]\nBye';

describe('kicker', () => {
  it('parses on cover, card and quote without warnings', () => {
    const { deck, warnings } = parse(text);
    expect(warnings).toEqual([]);
    expect(deck.slides.slice(0, 3).map((s) => s.attrs.kicker)).toEqual(['Ayat', 'Renungan', 'Tafsir']);
  });
  it('is dropped with a warning elsewhere', () => {
    const { warnings } = parse('A\n---\n[end kicker="x"]\nBye');
    expect(warnings.map((w) => w.code)).toEqual(['unknown-attr']);
  });
  it('lays out a kicker box (and no badge) on cards and quotes in every template', () => {
    const { deck } = parse(text);
    for (const v of VARIANTS) {
      const icons = deckIcons(deck, v);
      for (const i of [1, 2]) {
        const L = layoutSlide(deck.slides[i]!, deck, v, fakeMeasurer, icons[i] ?? null, false);
        expect(L.boxes.some((b) => b.kind === 'kicker'), `${v.id} slide ${i}`).toBe(true);
        expect(L.boxes.some((b) => b.kind === 'badge' || b.kind === 'number'), `${v.id} slide ${i}`).toBe(false);
      }
    }
  });
});

describe('fillUnjoined', () => {
  it('draws code with joinable pairs one character at a time, plain text in one call', async () => {
    const { fillUnjoined } = await import('../src/render/text');
    const calls: string[] = [];
    const ctx = { fillText: (t: string) => { calls.push(t); }, measureText: () => ({ width: 10 }) as TextMetrics };
    fillUnjoined(ctx, 'a === b', 0, 0);
    expect(calls).toEqual(['a', ' ', '=', '=', '=', ' ', 'b']);
    calls.length = 0;
    fillUnjoined(ctx, 'a = b', 0, 0);
    expect(calls).toEqual(['a = b']);
  });
});
