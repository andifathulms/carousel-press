// `[sheet]` panel geometry (PRD §4.10): a formula bar over a small grid with column letters and
// row numbers. Pure given a TextMeasurer, so layout, drawing and tests share the same numbers.
import type { Sheet } from '../core/sheet';
import type { Slide, Warning } from '../core/types';
import type { FontSpec, TextMeasurer } from '../layout/measure';
import type { StackItem } from '../layout/stack';
import { CONTENT_W } from '../render/safezone';
import type { Variant } from './types';

export const SHEET = {
  radius: 20,
  // Sizes raised for phone legibility (Jago Kantoran review, Oct 2026): cells 30 → 38, header 22 → 26, formula 30 → 36.
  bar: { h: 88, name: 104, fx: 64, padX: 20, max: 36, min: 20, step: 2, gap: 16 },
  head: { h: 52, size: 26, gutter: 62 },
  cell: { max: 38, min: 22, step: 2, padX: 16, lh: 1.8, minW: 72 },
  line: { grid: 2, ref: 4, result: 6, mark: 4 },
  markDash: [12, 8],
  refAlpha: 0.12,
  headAlpha: 0.06,
};

export interface SheetGeom {
  /** Cell font size. */
  size: number;
  colW: number[];
  rowH: number;
  /** Cell text after "…" truncation. */
  texts: string[][];
  /** Formula bar: font size and the (possibly truncated) formula; null when the sheet has no formula. */
  bar: { size: number; text: string } | null;
  h: number;
  truncated: boolean;
}

export interface SheetFonts {
  sans: string;
  mono: string;
}

export const cellFont = (f: SheetFonts, size: number, bold: boolean): FontSpec => ({ family: f.sans, weight: bold ? 600 : 400, size });
export const barFont = (f: SheetFonts, size: number): FontSpec => ({ family: f.mono, weight: 400, size });

function cut(text: string, maxW: number, font: FontSpec, m: TextMeasurer): string {
  if (m.width(text, font) <= maxW) return text;
  const chars = Array.from(text);
  while (chars.length && m.width(chars.join('') + '…', font) > maxW) chars.pop();
  return chars.join('') + '…';
}

export function sheetGeometry(sheet: Sheet, f: SheetFonts, m: TextMeasurer, width: number = CONTENT_W): SheetGeom {
  const C = SHEET.cell;
  const avail = width - SHEET.head.gutter;
  const natural = (size: number): number[] => {
    const w = Array.from({ length: sheet.cols }, () => C.minW);
    sheet.rows.forEach((row, r) => row.forEach((t, c) => {
      w[c] = Math.max(w[c]!, Math.ceil(m.width(t, cellFont(f, size, r === 0))) + C.padX * 2);
    }));
    return w;
  };
  let size: number = C.max;
  let colW = natural(size);
  while (colW.reduce((a, b) => a + b, 0) > avail && size > C.min) {
    size -= C.step;
    colW = natural(size);
  }
  const total = colW.reduce((a, b) => a + b, 0);
  let truncated = false;
  if (total > avail) {
    // Still too wide at the smallest size: shrink every column in proportion and cut its text.
    truncated = true;
    colW = colW.map((w) => Math.floor((w * avail) / total));
  } else if (total < avail) {
    // Fill the panel: spread the spare width evenly.
    const extra = Math.floor((avail - total) / sheet.cols);
    colW = colW.map((w) => w + extra);
  }
  const texts = sheet.rows.map((row, r) => row.map((t, c) => cut(t, colW[c]! - C.padX * 2, cellFont(f, size, r === 0), m)));
  if (texts.some((row, r) => row.some((t, c) => t !== sheet.rows[r]![c]))) truncated = true;

  let bar: SheetGeom['bar'] = null;
  if (sheet.formula) {
    const B = SHEET.bar;
    const room = width - B.name - B.fx - B.padX;
    let bs: number = B.max;
    while (m.width(sheet.formula.text, barFont(f, bs)) > room && bs > B.min) bs -= B.step;
    const text = cut(sheet.formula.text, room, barFont(f, bs), m);
    if (text !== sheet.formula.text) truncated = true;
    bar = { size: bs, text };
  }
  const rowH = Math.round(size * C.lh);
  const h = (bar ? SHEET.bar.h + SHEET.bar.gap : 0) + SHEET.head.h + rowH * sheet.rows.length;
  return { size, colW, rowH, texts, bar, h, truncated };
}

export function sheetFonts(v: Variant): SheetFonts {
  return { sans: v.fonts.sans, mono: v.fonts.mono };
}

/** The panel as a stack item; adds `table-too-wide` when cells had to be cut. */
export function sheetItem(slide: Slide, v: Variant, m: TextMeasurer, gap: number, warnings: Warning[]): StackItem | null {
  if (!slide.sheet) return null;
  const g = sheetGeometry(slide.sheet, sheetFonts(v), m);
  if (g.truncated) {
    warnings.push({
      code: 'table-too-wide', slideIndex: slide.index, line: slide.lines[0],
      message: 'Sheet cells or the formula are too wide and were cut with "…"',
    });
  }
  return { kind: 'sheet', h: g.h, w: CONTENT_W, gap };
}
