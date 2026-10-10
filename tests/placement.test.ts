import { describe, expect, it } from 'vitest';
import { parse } from '../src/core/parser';
import { fakeMeasurer } from '../src/layout/measure';
import { layoutSlide } from '../src/render/renderSlide';
import { ROWS } from '../src/render/safezone';
import { getVariant } from '../src/templates/registry';

// Vertical placement (owner, Oct 2026): fitting stacks are centred in the content band; photo slides stay top-anchored.
const deck = (template: string) => parse(`template: ${template}\nlang: id\n---\n[cover]\nJudul\n---\n[card]\nSatu hal kecil\nBadan teks pendek.\n---\n[quote]\nKutipan singkat.\n---\n[word]\nword: thought\nmeaning: berpikir\n---\n[end]\nSelesai`).deck;
const middle = (ROWS.stackTopCard + ROWS.stackLimit) / 2;

describe('vertical placement', () => {
  for (const id of ['editorial/rose-dusk', 'dev/github-dark', 'lexicon/notebook', 'serene/fajr'] as const) {
    it(`${id}: short card/quote/word/end stacks are centred in the band, on the 8 px grid`, () => {
      const d = deck(id);
      const v = getVariant(id);
      for (const s of d.slides.slice(1)) {
        const L = layoutSlide(s, d, v, fakeMeasurer, null, false);
        const top = L.lex ? Math.min(...L.lex.els.flatMap((e) => ('y' in e ? [e.y] : []))) : L.stack.placed[0]!.y;
        const bottom = L.lex ? L.lex.bottom : L.stack.bottom;
        expect(Math.abs((top + bottom) / 2 - middle), `${s.type}`).toBeLessThanOrEqual(8);
        expect(top).toBeGreaterThanOrEqual(ROWS.stackTopCard);
      }
    });
  }
  it('photo slides stay top-anchored', () => {
    const d = deck('editorial/sage');
    const L = layoutSlide(d.slides[1]!, d, getVariant('editorial/sage'), fakeMeasurer, null, true);
    expect(L.stack.placed[0]!.y).toBe(344);
  });
  it('an overflowing stack is not moved', () => {
    const d = parse(`template: editorial/sage\n---\n[cover]\nC\n---\n[card]\nJudul\n${'kata yang panjang sekali '.repeat(80)}`).deck;
    const L = layoutSlide(d.slides[1]!, d, getVariant('editorial/sage'), fakeMeasurer, null, false);
    expect(L.stack.overflow).toBe(true);
    expect(L.stack.placed[0]!.y).toBe(344);
  });
  it('the footer row sits 32 px higher than DESIGN §2, with the stack limit above it', () => {
    expect(ROWS.footerBaseline).toBe(1440);
    expect(ROWS.stackLimit).toBe(1376);
  });
});
