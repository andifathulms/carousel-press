import type { Rich, RichLine, RunStyle } from '../core/types';
import type { FontSpec, TextMeasurer } from './measure';

/** Inline-code pill (DESIGN §3.5): mono at 0.9×, padding 6×10, radius 8. */
export const PILL = { scale: 0.9, padX: 10, padY: 6, radius: 8 };
/** Extra gap between paragraphs, as a multiple of the font size. */
export const PARA_GAP = 0.6;

export interface TextStyle {
  font: FontSpec;
  mono: { family: string; weight: number };
}

interface Piece {
  text: string;
  style: RunStyle;
}
type Word = Piece[];

export interface PlacedRun {
  text: string;
  style: RunStyle;
  x: number;
  w: number;
}

export interface WrappedLine {
  runs: PlacedRun[];
  width: number;
  /** First line of a paragraph other than the first one (gets PARA_GAP above). */
  paraStart: boolean;
}

export interface WrapResult {
  lines: WrappedLine[];
  /** A word was wider than the region and had to be broken by characters. */
  charBroken: boolean;
}

export function monoFont(style: TextStyle): FontSpec {
  return { family: style.mono.family, weight: style.mono.weight, size: Math.round(style.font.size * PILL.scale) };
}

export function pieceWidth(p: Piece, style: TextStyle, m: TextMeasurer): number {
  if (p.style === 'code') return m.width(p.text, monoFont(style)) + PILL.padX * 2;
  return m.width(p.text, style.font);
}

function wordWidth(w: Word, style: TextStyle, m: TextMeasurer): number {
  let sum = 0;
  for (const p of w) sum += pieceWidth(p, style, m);
  return sum;
}

/** Split a hard line into words. Code spans never split at spaces. */
export function toWords(line: RichLine): Word[] {
  const words: Word[] = [];
  let cur: Word = [];
  const add = (text: string, style: RunStyle): void => {
    if (!text) return;
    const last = cur[cur.length - 1];
    if (last && last.style === style) last.text += text;
    else cur.push({ text, style });
  };
  for (const run of line) {
    if (run.style === 'code') {
      add(run.text, 'code');
      continue;
    }
    const parts = run.text.split(/( +)/);
    for (const part of parts) {
      if (/^ +$/.test(part)) {
        if (cur.length) words.push(cur);
        cur = [];
      } else add(part, run.style);
    }
  }
  if (cur.length) words.push(cur);
  return words;
}

/** Break one over-wide word into chunks that each fit maxWidth. */
function charBreak(word: Word, maxWidth: number, style: TextStyle, m: TextMeasurer): Word[] {
  const chunks: Word[] = [];
  let chunk: Word = [];
  for (const piece of word) {
    for (const ch of Array.from(piece.text)) {
      const last = chunk[chunk.length - 1];
      const trial: Word = last && last.style === piece.style
        ? [...chunk.slice(0, -1), { text: last.text + ch, style: piece.style }]
        : [...chunk, { text: ch, style: piece.style }];
      if (chunk.length && wordWidth(trial, style, m) > maxWidth) {
        chunks.push(chunk);
        chunk = [{ text: ch, style: piece.style }];
      } else chunk = trial;
    }
  }
  if (chunk.length || !chunks.length) chunks.push(chunk);
  return chunks;
}

interface LineWords {
  words: Word[];
  paraStart: boolean;
}

/**
 * Greedy word wrap of rich text. Optionally fixes one-word last lines in
 * headlines (moves one word down when the previous line has 3+ words).
 */
export function wrapRich(
  rich: Rich, maxWidth: number, style: TextStyle, m: TextMeasurer, opts: { widowFix?: boolean } = {},
): WrapResult {
  const space = m.width(' ', style.font);
  const lineW = (ws: Word[]): number =>
    ws.reduce((s, w, i) => s + wordWidth(w, style, m) + (i ? space : 0), 0);
  let charBroken = false;
  const out: LineWords[] = [];

  rich.forEach((para, pi) => {
    para.forEach((hard, hi) => {
      const group: LineWords[] = [];
      let cur: Word[] = [];
      for (const word of toWords(hard)) {
        const ww = wordWidth(word, style, m);
        if (ww > maxWidth) {
          charBroken = true;
          if (cur.length) group.push({ words: cur, paraStart: false });
          const chunks = charBreak(word, maxWidth, style, m);
          chunks.slice(0, -1).forEach((c) => group.push({ words: [c], paraStart: false }));
          cur = [chunks[chunks.length - 1]!];
          continue;
        }
        if (cur.length && lineW([...cur, word]) > maxWidth) {
          group.push({ words: cur, paraStart: false });
          cur = [word];
        } else cur.push(word);
      }
      group.push({ words: cur, paraStart: false });

      if (opts.widowFix && group.length >= 2) {
        const last = group[group.length - 1]!;
        const prev = group[group.length - 2]!;
        if (last.words.length === 1 && prev.words.length >= 3) {
          const moved = [prev.words[prev.words.length - 1]!, ...last.words];
          if (lineW(moved) <= maxWidth) {
            prev.words = prev.words.slice(0, -1);
            last.words = moved;
          }
        }
      }
      if (pi > 0 && hi === 0 && group[0]) group[0].paraStart = true;
      out.push(...group);
    });
  });

  const lines: WrappedLine[] = out.map((lw) => {
    const runs: PlacedRun[] = [];
    let x = 0;
    lw.words.forEach((word, wi) => {
      if (wi) x += space;
      for (const p of word) {
        const w = pieceWidth(p, style, m);
        runs.push({ text: p.text, style: p.style, x, w });
        x += w;
      }
    });
    return { runs, width: x, paraStart: lw.paraStart };
  });
  return { lines, charBroken };
}

/** Height of wrapped text: n line boxes plus paragraph gaps. */
export function textHeight(lines: readonly WrappedLine[], size: number, lh: number): number {
  if (!lines.length) return 0;
  const paras = lines.filter((l) => l.paraStart).length;
  return lines.length * size * lh + paras * PARA_GAP * size;
}

/** Baseline y of each line, given the block top (first baseline at top + 0.92·size). */
export function baselines(lines: readonly WrappedLine[], top: number, size: number, lh: number): number[] {
  const ys: number[] = [];
  let y = top + size * 0.92;
  lines.forEach((l, i) => {
    if (i > 0) y += size * lh;
    if (l.paraStart) y += PARA_GAP * size;
    ys.push(y);
  });
  return ys;
}
