// Hanzi text helpers for word/table/compare (SPEC-script §5). Pure given a measurer.
import { hanziChars, normalizePinyin, pinyinSyllables } from '../../core/pinyin';
import type { FontSpec, TextMeasurer } from '../../layout/measure';
import { wrapHan } from '../../layout/wrapHan';
import type { LexTokens } from '../types';
import { bundledCoverage } from '../../fonts/fontSources';
import { IPA_FACE, type LexEl } from './lexLayout';
import type { GlyphCtx, MixedSeg } from './lexScript';

export const HAN_SANS = 'Noto Sans SC';
export const HAN_SERIF = 'Noto Serif SC';

/** Hanzi blocks: lh 1.45; the glyph box (0.88 em above, 0.12 below the baseline) is centred in the line. */
export const HAN = {
  lh: 1.45,
  /** First baseline below the line top, in em: half the line box + 0.38 em. */
  baseline: 1.45 / 2 + 0.38,
  /** Hanzi table cells are drawn at 0.92 × the shared size (SPEC-script §7.3). */
  cellScale: 0.92,
  marker: { padX: 4, rise: 0.92, h: 1.08, radius: 6 },
  strike: { at: 0.52, w: 3 },
};

export const hasHan = (v: string | undefined): boolean => !!v && /\p{Script=Han}/u.test(v);

/** `script-glyph-missing` (blocking) when a CJK face isn't loaded for the characters (real fonts only). */
export function checkHanGlyphs(c: GlyphCtx & { m: TextMeasurer }, text: string, family: string): void {
  const chars = [...new Set(hanziChars(text))];
  if (!chars.length) return;
  const ranges = bundledCoverage(family);
  const uncovered = ranges.length ? chars.filter((ch) => { const cp = ch.codePointAt(0)!; return !ranges.some(([a, b]) => cp >= a && cp <= b); }) : [];
  const unloaded = c.m.hasFace && !c.m.hasFace(family, chars.join(''));
  if (!uncovered.length && !unloaded) return;
  if (c.warnings.some((w) => w.code === 'script-glyph-missing' && w.slideIndex === c.slideIndex)) return;
  c.warnings.push({
    code: 'script-glyph-missing', slideIndex: c.slideIndex, line: c.line, hard: true,
    message: uncovered.length ? `${family} has no glyph for: ${uncovered.join('')}` : `${family} isn't loaded for: ${chars.join('')}`,
  });
}

/** `*…*` around hanzi: highlight per character (SPEC-script §7.2). Returns the text and a flag per character. */
export function hanHighlight(src: string): { text: string; marked: boolean[] } {
  const marked: boolean[] = [];
  let text = '';
  let on = false;
  for (const ch of src) {
    if (ch === '*') { on = !on; continue; }
    text += ch;
    marked.push(on);
  }
  return { text, marked };
}

export function toneColor(tok: LexTokens, tone: number): string | null {
  return tok.tones?.[Math.min(5, Math.max(1, tone)) - 1] ?? null;
}

/**
 * Tones per hanzi when the pinyin has exactly one syllable per hanzi (SPEC-script §5.4), else null.
 */
export function tonesFor(hanzi: string, pinyin: string | undefined): number[] | null {
  if (!pinyin) return null;
  const n = hanziChars(hanzi).length;
  const { syllables, invalid } = pinyinSyllables(pinyin);
  return !invalid.length && syllables.length === n && n > 0 ? syllables.map((s) => s.tone) : null;
}

/** A wrapped hanzi block with per-unit offsets, colours (tones) and highlight rects. */
export function hanBlock(
  text: string, font: FontSpec & { fallback: string }, width: number, m: TextMeasurer,
  opts: { color: string; marked?: boolean[]; tones?: number[] | null; tok?: LexTokens; highlight?: string; strike?: string },
): { el: Omit<Extract<LexEl, { k: 'han' }>, 'x' | 'y'>; fits: boolean; h: number } {
  const wrap = wrapHan(text, font, width, m);
  // Character index of each unit's first character, to map per-character flags onto units.
  const startOf: number[] = [];
  let ci = 0;
  for (const u of wrap.units) { startOf.push(ci); ci += Array.from(u).length; }
  let hanIndex = -1;
  const unitTone = wrap.units.map((u) => (/\p{Script=Han}/u.test(u) ? opts.tones?.[++hanIndex] ?? null : null));
  const units = wrap.ranges.map(([a, b]) => wrap.units.slice(a, b));
  const offs = wrap.ranges.map(([a, b]) => {
    const o: number[] = [];
    for (let i = a; i < b; i++) o.push(i === a ? 0 : m.width(wrap.units.slice(a, i).join(''), font));
    return o;
  });
  const colors = opts.tones && opts.tok?.tones
    ? wrap.ranges.map(([a, b]) => unitTone.slice(a, b).map((t) => (t === null ? null : toneColor(opts.tok!, t))))
    : undefined;
  const marks: { line: number; from: number; w: number }[] = [];
  if (opts.marked?.some(Boolean)) {
    wrap.ranges.forEach(([a, b], line) => {
      for (let i = a; i < b; i++) {
        if (!opts.marked![startOf[i]!]) continue;
        let j = i;
        while (j + 1 < b && opts.marked![startOf[j + 1]!]) j++;
        marks.push({ line, from: offs[line]![i - a]!, w: m.width(wrap.units.slice(i, j + 1).join(''), font) });
        i = j;
      }
    });
  }
  const el: Omit<Extract<LexEl, { k: 'han' }>, 'x' | 'y'> = {
    k: 'han', lines: wrap.lines, widths: wrap.widths, size: font.size, lh: HAN.lh, baseline: HAN.baseline,
    family: font.family, weight: font.weight, fallback: font.fallback, color: opts.color,
    ...(colors || marks.length ? { units, offs } : {}), ...(colors ? { colors } : {}),
    ...(marks.length ? { marks, highlight: opts.highlight } : {}), ...(opts.strike ? { strike: opts.strike } : {}),
  };
  return { el, fits: wrap.fits, h: wrap.lines.length * font.size * HAN.lh };
}

/** Pinyin as segments, one per syllable in its tone colour, in the transliteration face (single line). */
export function pinyinSegs(pinyin: string, size: number, tok: LexTokens, base: string, m: TextMeasurer): { segs: MixedSeg[]; w: number } {
  const norm = normalizePinyin(pinyin).normalize('NFC');
  const { syllables } = pinyinSyllables(norm);
  const font: FontSpec = { family: IPA_FACE, weight: 400, size };
  const segs: MixedSeg[] = [];
  let dx = 0;
  let rest = norm;
  for (const s of syllables) {
    const at = rest.toLowerCase().indexOf(s.text.toLowerCase());
    if (at > 0) {
      const gap = rest.slice(0, at);
      const w = m.width(gap, font);
      segs.push({ text: gap, font, color: base, dx, w, rtl: false });
      dx += w;
    }
    const text = rest.slice(Math.max(0, at), Math.max(0, at) + s.text.length);
    const w = m.width(text, font);
    segs.push({ text, font, color: toneColor(tok, s.tone) ?? base, dx, w, rtl: false });
    dx += w;
    rest = rest.slice(Math.max(0, at) + s.text.length);
  }
  if (rest) {
    const w = m.width(rest, font);
    segs.push({ text: rest, font, color: base, dx, w, rtl: false });
    dx += w;
  }
  return { segs, w: dx };
}
