// Script helpers for word/table/compare (SPEC-script §4, §6). Pure given a measurer.
import { charScript, detectScript, needsTranslitFace, scriptRuns } from '../../core/script';
import type { Warning } from '../../core/types';
import type { FontSpec, TextMeasurer } from '../../layout/measure';
import { IPA_FACE } from './lexLayout';
import { uncoveredIpa } from '../../core/lexicon';

/** Arabic face in lexicon slides (Amiri Quran stays for [ayah]). */
export const ARABIC_FACE = 'Amiri';

export const ARABIC = {
  lh: 1.9,
  /** First baseline below the line top, in em (room for harakat above). */
  baseline: 1.22,
  /** Arabic table cells: drawn at 1.1 × the shared size, rows 2.3 × the size. */
  cellScale: 1.1,
  rowH: 2.3,
  /** Word highlight behind `*…*`: from 0.66 em above the baseline, 0.92 em tall. */
  marker: { padX: 8, rise: 0.66, h: 0.92, radius: 8 },
  /** Strike-through at 0.45 × the line box from its top (keeps the lower harakat visible). */
  strike: { at: 0.45, w: 3 },
};

/** Code points of the bundled Amiri files (@fontsource arabic subset). */
export const AMIRI_RANGES: readonly [number, number][] = [
  [0x0600, 0x06ff], [0x0750, 0x077f], [0x0870, 0x088e], [0x0890, 0x0891], [0x0897, 0x08e1], [0x08e3, 0x08ff],
  [0x200c, 0x200e], [0x2010, 0x2011], [0x204f, 0x204f], [0x2e41, 0x2e41], [0xfb50, 0xfdff], [0xfe70, 0xfe74], [0xfe76, 0xfefc],
];

/** Arabic characters Amiri can't draw (neutrals are drawn by the fallback face). */
export function uncoveredArabic(text: string): string[] {
  const out = new Set<string>();
  for (const ch of text) {
    if (charScript(ch) !== 'arab') continue;
    const cp = ch.codePointAt(0)!;
    if (!AMIRI_RANGES.some(([a, b]) => cp >= a && cp <= b)) out.add(ch);
  }
  return [...out];
}

export interface GlyphCtx {
  slideIndex: number;
  line: number;
  warnings: Warning[];
}

/** `script-glyph-missing` (blocking) for characters the assigned face lacks. */
export function checkGlyphs(c: GlyphCtx, text: string, face: 'arab' | 'translit'): void {
  const missing = face === 'arab' ? uncoveredArabic(text) : uncoveredIpa(text).filter((ch) => charScript(ch) === 'latin');
  if (!missing.length) return;
  c.warnings.push({
    code: 'script-glyph-missing', slideIndex: c.slideIndex, line: c.line, hard: true,
    message: `${face === 'arab' ? 'Amiri' : IPA_FACE} can't draw: ${missing.join(' ')}`,
  });
}

/** `script-overflow` (blocking, no override). */
export function scriptOverflow(c: GlyphCtx): void {
  if (c.warnings.some((w) => w.code === 'script-overflow' && w.slideIndex === c.slideIndex)) return;
  c.warnings.push({
    code: 'script-overflow', slideIndex: c.slideIndex, line: c.line, hard: true,
    message: 'Teks Arab/Mandarin terlalu panjang. Pendekkan atau pecah ke slide lain.',
  });
}

/** The face for a Latin value: the given family, or the transliteration face when it has letters the latin subset lacks. */
export function latinFace(text: string, family: string, weight: number): { family: string; weight: number; translit: boolean } {
  if (!needsTranslitFace(text)) return { family, weight, translit: false };
  return { family: IPA_FACE, weight: weight >= 600 ? 700 : 400, translit: true };
}

export const isArabic = (v: string | undefined): boolean => !!v && detectScript(v) === 'arab';

/**
 * `*…*` in an Arabic value must wrap whole space-separated words (SPEC-script §4). Returns the text
 * without markers, which words are highlighted, and whether a marker sat inside a word.
 */
export function arabicHighlight(src: string): { text: string; marked: boolean[]; split: boolean } {
  const words = src.split(' ').filter((w) => w !== '');
  const marked: boolean[] = [];
  const clean: string[] = [];
  let open = false;
  let split = false;
  for (const raw of words) {
    let w = raw;
    let starts = false;
    let ends = false;
    if (w.startsWith('*')) { starts = true; w = w.slice(1); }
    if (w.endsWith('*') && w.length > 0) { ends = true; w = w.slice(0, -1); }
    if (w.includes('*')) { split = true; w = w.replace(/\*/g, ''); }
    if (starts) { if (open) split = true; open = true; }
    marked.push(open);
    if (ends) { if (!open) split = true; open = false; }
    clean.push(w);
  }
  if (open) split = true;
  return { text: clean.join(' '), marked: split ? marked.map(() => false) : marked, split };
}

export interface ArabicLines {
  lines: string[];
  widths: number[];
  /** [first word, last word + 1] per line. */
  ranges: [number, number][];
  /** Every word fits the width on its own. */
  fits: boolean;
}

/** Greedy wrap at spaces only; words measured whole with their marks (SPEC-script §4). */
export function wrapArabicWords(text: string, font: FontSpec, width: number, m: TextMeasurer): ArabicLines {
  const words = text.split(' ').filter((w) => w !== '');
  const space = m.width(' ', font);
  const out: ArabicLines = { lines: [], widths: [], ranges: [], fits: true };
  let start = 0;
  let curW = 0;
  words.forEach((word, i) => {
    const w = m.width(word, font);
    if (w > width) out.fits = false;
    if (i > start && curW + space + w > width) {
      out.lines.push(words.slice(start, i).join(' '));
      out.widths.push(curW);
      out.ranges.push([start, i]);
      start = i;
      curW = 0;
    }
    curW += (i > start ? space : 0) + w;
  });
  if (words.length) {
    out.lines.push(words.slice(start).join(' '));
    out.widths.push(curW);
    out.ranges.push([start, words.length]);
  }
  return out;
}

/** Highlight rects per line for marked words, measured as logical prefixes from the right edge. */
export function arabicMarks(text: string, marked: readonly boolean[], wrap: ArabicLines, font: FontSpec, m: TextMeasurer): { line: number; from: number; w: number }[] {
  const words = text.split(' ').filter((w) => w !== '');
  const space = m.width(' ', font);
  const out: { line: number; from: number; w: number }[] = [];
  wrap.ranges.forEach(([a, b], line) => {
    for (let i = a; i < b; i++) {
      if (!marked[i]) continue;
      let j = i;
      while (j + 1 < b && marked[j + 1]) j++;
      const from = i > a ? m.width(words.slice(a, i).join(' '), font) + space : 0;
      out.push({ line, from, w: m.width(words.slice(i, j + 1).join(' '), font) });
      i = j;
    }
  });
  return out;
}

export interface MixedSeg {
  text: string;
  font: FontSpec;
  color: string;
  dx: number;
  w: number;
  rtl: boolean;
}

/**
 * One line of mixed scripts in visual order (SPEC-script §6.2): runs keep their logical order inside,
 * and the run order is reversed when the base direction (first strong character) is RTL.
 */
export function mixedSegs(
  text: string, size: number, faces: { latin: string; latinWeight: number; arabWeight: number; fallback: string }, colors: { latin: string; arab: string },
  m: TextMeasurer,
): { segs: MixedSeg[]; w: number } {
  const rtl = detectScript(text) === 'arab';
  // In an LTR value, neutrals after an Arabic run ("kitāb (كِتَاب)") belong to the LTR flow, not the RTL run.
  const runs = scriptRuns(text).flatMap((r) => {
    if (rtl || r.script !== 'arab') return [r];
    const m2 = /^([\s\S]*?)([\s\p{P}\p{S}]*)$/u.exec(r.text)!;
    return m2[2] ? [{ text: m2[1]!, script: r.script }, { text: m2[2], script: 'latin' as const }] : [r];
  });
  const ordered = rtl ? [...runs].reverse() : runs;
  let dx = 0;
  const segs = ordered.map((r) => {
    const runText = rtl ? r.text.trim() : r.text;
    const font: FontSpec = r.script === 'arab'
      ? { family: ARABIC_FACE, weight: faces.arabWeight, size, fallback: faces.fallback }
      : { ...latinFace(runText, faces.latin, faces.latinWeight), size };
    const w = m.width(runText, font);
    const seg: MixedSeg = { text: runText, font, color: r.script === 'arab' ? colors.arab : colors.latin, dx, w, rtl: r.script === 'arab' };
    dx += w + (rtl ? m.width(' ', font) : 0);
    return seg;
  });
  const w = segs.length ? segs[segs.length - 1]!.dx + segs[segs.length - 1]!.w : 0;
  return { segs, w };
}

/** True when the value mixes Arabic with Latin letters (needs per-run fonts). */
export function isMixed(text: string): boolean {
  const scripts = new Set(scriptRuns(text).map((r) => r.script));
  return scripts.size > 1;
}
