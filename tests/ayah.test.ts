import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { parse } from '../src/core/parser';
import { ayahMark, pipeLines, toArabicDigits } from '../src/core/ayah';
import { isBlocking, isHard } from '../src/core/types';
import { type TextMeasurer, fakeMeasurer, fontString } from '../src/layout/measure';
import { layoutSlide } from '../src/render/renderSlide';
import { ROWS, SAFE } from '../src/render/safezone';
import { getVariant, VARIANTS } from '../src/templates/registry';
import { wrapArabic } from '../src/templates/serene/arabicLayout';

// Test strings are built from code points (never typed Arabic): letters, harakat, tatweel U+0640, end-of-ayah U+06DD.
const cp = (...xs: number[]): string => String.fromCodePoint(...xs);
const WORD = cp(0x0628, 0x0650, 0x0633, 0x0652, 0x0645, 0x0650); // ba-kasra-sin-sukun-mim-kasra
const TATWEEL = cp(0x0627, 0x0644, 0x0644, 0x0640, 0x0647, 0x0650);
const SIGN = cp(0x06dd, 0x0661, 0x0662);
const ARAB = `${WORD} ${TATWEEL} ${SIGN} ${WORD}`;

const deck = (body: string, template = 'serene/fajr') => parse(`template: ${template}\nlang: id\n---\n${body}`);
const codes = (ws: { code: string }[]) => ws.map((w) => w.code);

describe('parser: ayah / hadith', () => {
  it('keeps arab byte-identical (combining marks, tatweel, U+06DD)', () => {
    const { deck: d, warnings } = deck(`[ayah]\narab: ${ARAB}\nterjemah: Terjemahan | baris dua\nref: QS. Contoh [1]: 28`);
    const s = d.slides[0]!;
    expect(s.type).toBe('ayah');
    expect(s.fields.arab).toBe(ARAB);
    expect(Array.from(s.fields.arab!).map((c) => c.codePointAt(0))).toEqual(Array.from(ARAB).map((c) => c.codePointAt(0)));
    expect(warnings).toEqual([]);
    expect(s.body).toEqual([[[{ text: 'Terjemahan', style: 'plain' }], [{ text: 'baris dua', style: 'plain' }]]]);
  });
  it('translation: only | breaks apply; \\| is a literal pipe; no accent/code markers', () => {
    expect(pipeLines('a *b* `c` \\| d')).toEqual([[[{ text: 'a *b* `c` | d', style: 'plain' }]]]);
  });
  it('missing required fields: hard missing-field, the slide stays an ayah/hadith', () => {
    const r = deck('[ayah]\narab: x\n---\n[hadith]\ntext: t\nref: HR. X');
    expect(r.deck.slides.map((s) => s.type)).toEqual(['ayah', 'hadith']);
    expect(codes(r.warnings)).toEqual(['missing-field', 'missing-field']);
    expect(r.warnings.every((w) => isBlocking(w) && isHard(w))).toBe(true);
  });
  it('compare missing-field stays soft (overridable)', () => {
    const w = parse('[cover]\nC\n---\n[compare]\nright: ok').warnings.find((x) => x.code === 'missing-field')!;
    expect(isBlocking(w)).toBe(false);
    expect(isHard(w)).toBe(false);
  });
  it('end-of-ayah mark: last number in ref, mark=N, mark=off', () => {
    expect(toArabicDigits('286')).toBe(cp(0x0662, 0x0668, 0x0666));
    expect(ayahMark({ ref: 'QS. Ar-Ra\'d [13]: 28' })).toBe(`﴿${cp(0x0662, 0x0668)}﴾`);
    expect(ayahMark({ ref: 'x', mark: '5' })).toBe(`﴿${cp(0x0665)}﴾`);
    expect(ayahMark({ ref: 'QS. [2]: 1', mark: 'off' })).toBeNull();
  });
  it('the spec sample (placeholders) parses cleanly', () => {
    const r = parse(readFileSync(new URL('./fixtures/serene-ayah.txt', import.meta.url), 'utf8'));
    expect(r.warnings).toEqual([]);
    expect(r.deck.template).toBe('serene/fajr');
  });
});

describe('Arabic wrap', () => {
  it('breaks only at spaces: every word survives whole and in order', () => {
    const text = Array.from({ length: 30 }, (_, i) => (i % 2 ? WORD : TATWEEL)).join(' ');
    const w = wrapArabic(text, 'Amiri Quran', 60, 400, fakeMeasurer, null);
    expect(w.lines.length).toBeGreaterThan(1);
    expect(w.lines.join(' ')).toBe(text);
    expect(w.lines.flatMap((l) => l.split(' '))).toEqual(text.split(' '));
    expect(w.fits).toBe(true);
  });
  it('the end-of-ayah mark stays on the last word\'s line', () => {
    const w = wrapArabic(`${WORD} ${WORD}`, 'Amiri Quran', 60, 4 * 60 * 0.52 + 2, fakeMeasurer, '﴿١﴾');
    expect(w.lines).toEqual([WORD, WORD]);
  });
  it('a word wider than the line does not fit (it is never split)', () => {
    const long = WORD.repeat(40);
    expect(wrapArabic(long, 'Amiri Quran', 48, 816, fakeMeasurer, null)).toMatchObject({ lines: [long], fits: false });
  });
});

describe('layout', () => {
  const ayahDeck = (arab: string, template = 'serene/fajr') =>
    deck(`[ayah]\narab: ${arab}\nterjemah: Terjemahan pendek.\nref: QS. Contoh [1]: 2\nsource: Terjemahan Kemenag RI`, template).deck;

  it('a short ayah fits in every template, inside SAFE, at the maximum Arabic size', () => {
    for (const v of VARIANTS) {
      const d = ayahDeck(ARAB, v.id);
      const L = layoutSlide(d.slides[0]!, d, v, fakeMeasurer, null, false);
      expect(L.warnings, v.id).toEqual([]);
      const ar = L.lex!.els.find((e) => e.k === 'arabic')!;
      expect(ar.k === 'arabic' && ar.size).toBe(76);
      for (const b of L.boxes.filter((x) => x.kind === 'arabic' || x.kind.startsWith('lex-'))) {
        expect(b.x).toBeGreaterThanOrEqual(SAFE.left - 0.5);
        expect(b.x + b.w).toBeLessThanOrEqual(SAFE.right + 0.5);
        expect(b.y + b.h).toBeLessThanOrEqual(ROWS.stackLimit + 0.5);
      }
    }
  });
  it('too much Arabic → arabic-too-long (hard), Arabic never shrinks below 48 and keeps every word', () => {
    const long = Array.from({ length: 160 }, () => WORD).join(' ');
    const d = ayahDeck(long);
    const L = layoutSlide(d.slides[0]!, d, getVariant('serene/fajr'), fakeMeasurer, null, false);
    expect(codes(L.warnings)).toContain('arabic-too-long');
    expect(L.warnings.some(isHard)).toBe(true);
    const ar = L.lex!.els.find((e) => e.k === 'arabic')!;
    expect(ar.k === 'arabic' && ar.size).toBe(48);
    expect(ar.k === 'arabic' && ar.lines.join(' ')).toBe(long);
  });
  it('a long translation drops the source first, then shrinks the translation, before the Arabic', () => {
    const d = deck(`[ayah]\narab: ${ARAB}\nterjemah: ${'kata '.repeat(50)}\nref: QS. Contoh [1]: 2\nsource: Terjemahan Kemenag RI`).deck;
    const L = layoutSlide(d.slides[0]!, d, getVariant('serene/fajr'), fakeMeasurer, null, false);
    const texts = L.lex!.els.filter((e) => e.k === 'text');
    expect(texts.some((e) => e.k === 'text' && e.lines.some((l) => l.runs.some((r) => r.text.includes('Kemenag'))))).toBe(false);
    const ar = L.lex!.els.find((e) => e.k === 'arabic')!;
    expect(ar.k === 'arabic' && ar.size).toBe(76);
  });
  it('arabic-font-missing when the face is not loaded', () => {
    const m: TextMeasurer = { ...fakeMeasurer, width: fakeMeasurer.width, hasFace: () => false };
    const d = ayahDeck(ARAB);
    const L = layoutSlide(d.slides[0]!, d, getVariant('serene/fajr'), m, null, false);
    expect(codes(L.warnings)).toEqual(['arabic-font-missing']);
    expect(L.warnings.every(isHard)).toBe(true);
  });
  it('hadith: label pill, right-aligned Arabic, grade badge', () => {
    const d = deck(`[hadith]\narab: ${ARAB}\ntext: Teks hadis.\nref: HR. Muslim no. 1\ngrade: Sahih`).deck;
    const L = layoutSlide(d.slides[0]!, d, getVariant('serene/isya'), fakeMeasurer, null, false);
    const kinds = L.lex!.els.map((e) => e.k);
    expect(kinds).toEqual(['pill', 'arabic', 'text', 'text', 'badge']);
    const ar = L.lex!.els[1]!;
    expect(ar.k === 'arabic' && ar.align).toBe('right');
    const badge = L.lex!.els[4]!;
    expect(badge.k === 'badge' && badge.text).toBe('Derajat: Sahih');
  });
});

describe('serene family', () => {
  it('cards have no badge unless number=N is explicit', () => {
    const d = deck('[cover]\nC\n---\n[card]\nRenungan\nIsi.\n---\n[card number=3]\nTiga\n---\n[end]\nE').deck;
    expect(d.slides.map((s) => s.badge)).toEqual([null, null, 3, null]);
    const e = deck('[cover]\nC\n---\n[card]\nA', 'editorial/sage').deck;
    expect(e.slides[1]!.badge).toBe(1);
  });
  it('cover/card/end stacks are centred', () => {
    const d = deck('[cover]\nJudul\n---\n[card]\nRenungan\nSatu kalimat.\n---\n[end]\nSemoga bermanfaat.').deck;
    const v = getVariant('serene/fajr');
    for (const s of d.slides) {
      const L = layoutSlide(s, d, v, fakeMeasurer, null, false);
      expect(L.center).toBe(true);
      for (const p of L.stack.placed) expect(Math.abs(p.x + p.w / 2 - (SAFE.left + SAFE.right) / 2)).toBeLessThan(1);
    }
  });
  it('no auto icons in serene', () => {
    const d = deck('[cover]\nC\n---\n[card]\nA\n---\n[end]\nE').deck;
    for (const s of d.slides) expect(layoutSlide(s, d, getVariant('serene/fajr'), fakeMeasurer, null, false).icon).toBeNull();
  });
});

describe('honorifics (owner rule, Oct 2026)', () => {
  const dir = new URL('../src/samples/', import.meta.url);
  const decks = readdirSync(dir).filter((f) => /^(ayat|hadis)-.*\.txt$/.test(f));
  it('Ayat Harian decks use Arabic honorifics, never Swt./saw./as./ra.', () => {
    expect(decks.length).toBe(10);
    for (const f of decks) {
      const text = readFileSync(new URL(f, dir), 'utf8');
      expect(text, f).not.toMatch(/\b(swt|saw|a\.s|r\.a)\b/i);
    }
  });
  it('Latin faces fall back to Amiri, so Arabic honorifics never use a system font', () => {
    expect(fontString({ family: 'Lora', weight: 500, size: 40 })).toBe('500 40px "Lora", "Amiri", Georgia, "Times New Roman", serif');
    expect(fontString({ family: 'Amiri Quran', weight: 400, size: 40 })).not.toContain('"Amiri",');
  });
});
