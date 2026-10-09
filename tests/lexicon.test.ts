import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { parse } from '../src/core/parser';
import { IPA_RANGES, splitRow, uncoveredIpa } from '../src/core/lexicon';
import { contrast } from '../src/core/color';
import { fakeMeasurer } from '../src/layout/measure';
import { layoutSlide } from '../src/render/renderSlide';
import { ROWS } from '../src/render/safezone';
import { getVariant, VARIANTS } from '../src/templates/registry';
import { kamus, notebook } from '../src/templates/lexicon/variants';
import { lexTokens } from '../src/templates/lexicon/tokens';

const deck = (body: string, template = 'lexicon/notebook') => parse(`template: ${template}\nlang: id\n---\n[cover]\nCover\n---\n${body}`);
const slide = (body: string) => {
  const r = deck(body);
  return { s: r.deck.slides[1]!, warnings: r.warnings, deck: r.deck };
};
const codes = (ws: { code: string }[]) => ws.map((w) => w.code);

describe('parser: word', () => {
  it('reads fields in any order and keeps ipa verbatim', () => {
    const { s, warnings } = slide('[word]\nmeaning: berpikir | mengira\nipa: /θɔːt/ · /θɑːt/\nword: thought\npos: verb');
    expect(s.type).toBe('word');
    expect(s.fields).toMatchObject({ word: 'thought', pos: 'verb', ipa: '/θɔːt/ · /θɑːt/', meaning: 'berpikir | mengira' });
    expect(warnings).toEqual([]);
  });
  it('warns on unknown keys and non-field lines, and ignores them', () => {
    const { s, warnings } = slide('[word]\nword: x\ncolour: red\njust some text');
    expect(s.fields).toEqual({ word: 'x' });
    expect(codes(warnings)).toEqual(['unknown-field', 'unknown-field']);
  });
  it('missing word → card fallback + warning', () => {
    const { s, warnings } = slide('[word]\nmeaning: arti\nexample: contoh');
    expect(s.type).toBe('card');
    expect(s.headlineSrc).toBe('arti');
    expect(codes(warnings)).toContain('missing-word');
  });
  it('icon= is ignored silently on lexicon slides', () => {
    const { s, warnings } = slide('[word icon=star]\nword: x');
    expect(s.attrs.icon).toBeUndefined();
    expect(warnings).toEqual([]);
  });
});

describe('parser: compare', () => {
  it('reads wrong/right/why and custom labels', () => {
    const { s } = slide('[compare]\nwrong-label: Tidak baku\nright: Apa *risikonya*?\nwrong: Apa resikonya?\nwhy: KBBI.');
    expect(s.type).toBe('compare');
    expect(s.fields['wrong-label']).toBe('Tidak baku');
    expect(s.fields.right).toBe('Apa *risikonya*?');
  });
  it('missing wrong or right → card + missing-field', () => {
    const { s, warnings } = slide('[compare]\nright: ok\nwhy: because');
    expect(s.type).toBe('card');
    expect(codes(warnings)).toContain('missing-field');
  });
});

describe('parser: table', () => {
  it('headline, header row, body rows and note', () => {
    const { s, warnings } = slide('[table]\nPola *-ought*\n| V1 | V2 | Arti |\n| think | th*ought* | berpikir |\n| buy | b*ought* | membeli |\nBunyinya sama.');
    expect(s.headlineSrc).toBe('Pola *-ought*');
    expect(s.table).toEqual({ header: ['V1', 'V2', 'Arti'], rows: [['think', 'th*ought*', 'berpikir'], ['buy', 'b*ought*', 'membeli']] });
    expect(s.fields.note).toBe('Bunyinya sama.');
    expect(warnings).toEqual([]);
  });
  it('pipes split cells; \\| is a literal pipe', () => {
    expect(splitRow('| a \\| b | c |')).toEqual(['a \\| b', 'c']);
  });
  it('pads short rows; warns on rows with extra cells and on column counts', () => {
    const { s, warnings } = slide('[table]\nT\n| A | B |\n| 1 |\n| 1 | 2 | 3 |');
    expect(s.table!.rows).toEqual([['1', ''], ['1', '2']]);
    expect(codes(warnings)).toEqual(['table-shape']);
    expect(codes(slide('[table]\nT\n| A |\n| 1 |').warnings)).toContain('table-shape');
    expect(codes(slide('[table]\nT\n| A | B | C | D | E |').warnings)).toContain('table-shape');
  });
  it('too many rows is a blocking layout warning', () => {
    const rows = Array.from({ length: 10 }, (_, i) => `| r${i} | x |`).join('\n');
    const { s, deck: d } = slide(`[table]\nT\n| A | B |\n${rows}`);
    const L = layoutSlide(s, d, notebook, fakeMeasurer, null, false);
    expect(codes(L.warnings)).toContain('table-too-many-rows');
  });
});

describe('layout', () => {
  it('word: shrinks translation (low priority) before the headword (last)', () => {
    const mid = 'kata yang cukup panjang untuk mengisi baris '.repeat(2);
    const { s, deck: d } = slide(`[word]\npos: verb\nword: thought\nipa: /θɔːt/\nsay: thot\nmeaning: ${mid}\nexample: I *thought* so. ${mid}\ntranslation: ${mid}\norigin: Old English\nnote: catatan`);
    const L = layoutSlide(s, d, notebook, fakeMeasurer, null, false);
    const texts = L.lex!.els.filter((e) => e.k === 'text');
    const size = (i: number) => (texts[i]!.k === 'text' ? texts[i]!.size : 0);
    const [head, , , , , translation] = [0, 1, 2, 3, 4, 5].map(size);
    // Round-robin from the low-priority end (like DESIGN §3.3): translation hits its minimum, the headword keeps most of its size.
    expect(translation).toBe(28);
    expect(head).toBeGreaterThan(120);
    expect(L.stack.overflow).toBe(false);
  });
  it('table: shared row size, columns fill the content width', () => {
    const { s, deck: d } = slide('[table]\nT\n| V1 | V2 / V3 | Arti |\n| think | thought | berpikir |\n| bring | brought | membawa |');
    const L = layoutSlide(s, d, notebook, fakeMeasurer, null, false);
    const cells = L.lex!.els.filter((e) => e.k === 'text').slice(1);
    expect(new Set(cells.map((c) => c.k === 'text' && c.size)).size).toBe(1);
    expect(L.warnings).toEqual([]);
  });
  it('table: cells too wide at the minimum size get an ellipsis + table-too-wide', () => {
    const wide = 'x'.repeat(80);
    const { s, deck: d } = slide(`[table]\nT\n| A | B |\n| ${wide} | ${wide} |`);
    const L = layoutSlide(s, d, notebook, fakeMeasurer, null, false);
    expect(codes(L.warnings)).toContain('table-too-wide');
    const cell = L.lex!.els.filter((e) => e.k === 'text').at(-1)!;
    expect(cell.k === 'text' && cell.lines[0]!.runs.at(-1)!.text.endsWith('…')).toBe(true);
  });
  it('compare: right box sits below the wrong box; everything above the stack limit', () => {
    const { s, deck: d } = slide('[compare]\nwrong: Yesterday I thinked about it.\nright: Yesterday I *thought* about it.\nwhy: Think tidak pakai -ed.');
    const L = layoutSlide(s, d, kamus, fakeMeasurer, null, false);
    const boxes = L.lex!.els.filter((e) => e.k === 'rect');
    expect(boxes).toHaveLength(2);
    expect(boxes[1]!.k === 'rect' && boxes[0]!.k === 'rect' && boxes[1]!.y).toBeGreaterThan((boxes[0] as { y: number; h: number }).y + (boxes[0] as { h: number }).h);
    expect(L.lex!.bottom).toBeLessThanOrEqual(ROWS.stackLimit);
  });
  it('word/table/compare render in every family without overflow', () => {
    const { deck: d } = deck('[word]\npos: verb\nword: thought\nipa: /θɔːt/\nmeaning: berpikir\nexample: I *thought* so.\n---\n[table]\nT\n| A | B |\n| a | b |\n---\n[compare]\nwrong: a\nright: b');
    for (const v of VARIANTS) {
      for (const s of d.slides.slice(1)) {
        const L = layoutSlide(s, d, v, fakeMeasurer, null, false);
        expect(L.lex, `${v.id} ${s.type}`).toBeDefined();
        expect(L.stack.overflow, `${v.id} ${s.type}`).toBe(false);
      }
    }
  });
});

describe('contrast: lexicon extra tokens (SPEC-lexicon §3.2)', () => {
  for (const v of [kamus, notebook]) {
    it(v.id, () => {
      const t = v.lex!;
      const paper = v.surfaces[v.rotation[0]!]!;
      expect(contrast(t.okInk, t.okBg)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(t.badInk, t.badBg)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(paper.ink, t.highlight)).toBeGreaterThanOrEqual(4.5);
    });
  }
  it('derived ok/bad pairs pass on every family surface', () => {
    for (const v of VARIANTS) {
      for (const s of Object.values(v.surfaces)) {
        const t = lexTokens(v, s, false);
        expect(contrast(t.okInk, t.okBg), `${v.id} ok`).toBeGreaterThanOrEqual(4.5);
        expect(contrast(t.badInk, t.badBg), `${v.id} bad`).toBeGreaterThanOrEqual(4.5);
      }
    }
  });
});

describe('IPA glyph coverage (SPEC-lexicon §3.1)', () => {
  it('covers common IPA symbols', () => {
    expect(uncoveredIpa('/θɔːt/ (UK) · /θɑːt/ (US) ˈwɔːkt ʃ ʒ ŋ ð æ ɪ ʊ ə ɜː')).toEqual([]);
    expect(uncoveredIpa('漢')).toEqual(['漢']);
    expect(IPA_RANGES.length).toBeGreaterThan(5);
  });
  it('every ipa field in the shipped samples is covered', () => {
    const dir = new URL('../src/samples/', import.meta.url);
    for (const f of readdirSync(dir).filter((n) => n.endsWith('.txt'))) {
      for (const s of parse(readFileSync(new URL(f, dir), 'utf8')).deck.slides) {
        if (s.fields.ipa) expect(uncoveredIpa(s.fields.ipa), f).toEqual([]);
      }
    }
  });
  it('the lexicon templates exist', () => {
    expect(getVariant('lexicon/kamus').family).toBe('lexicon');
    expect(getVariant('lexicon/notebook').fonts.serif).toBe('Lora');
  });
});
