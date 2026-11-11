// Arsip display list, text fitting and chrome (docs/SPEC-arsip.md §4). Pure given a measurer.
import type { Deck, Slide } from '../../core/types';
import type { FontSpec, TextMeasurer } from '../../layout/measure';
import type { Placed, StackItem, StackResult, TextRole, TextSpec } from '../../layout/stack';
import { textHeight, wrapRich } from '../../layout/wrap';
import { type Box, ROWS, SAFE } from '../../render/safezone';
import type { Surface } from '../types';

/** Drawing ops, in paint order. `push`/`pop` rotate everything between them about (cx, cy). */
export type Op =
  | { op: 'fill'; x: number; y: number; w: number; h: number; color: string; shadow?: boolean }
  | { op: 'photo'; x: number; y: number; w: number; h: number }
  | { op: 'text'; p: Placed; surface: Surface }
  | { op: 'label'; text: string; x: number; y: number; font: FontSpec; color: string; tracking: number; align?: 'right' }
  | { op: 'rule'; x: number; y: number; w: number; h: number; color: string }
  | { op: 'mark'; x: number; y: number; size: number; color: string }
  | { op: 'arrow'; x: number; y: number; w: number; color: string }
  | { op: 'push'; cx: number; cy: number; rot: number }
  | { op: 'pop' };

export type PlateName = 'sampul' | 'babak' | 'potret-atas' | 'potret-bawah' | 'bentang' | 'teks' | 'naskah' | 'akhir';

export interface ArsipPlan {
  plate: PlateName;
  ops: Op[];
}

/** Chrome metrics and the body column (SPEC-arsip §3.3, §4). */
export const CHROME_A = {
  mark: { size: 40, gap: 14, top: 202 },
  handle: { size: 28, weight: 600 },
  folio: { size: 30, tracking: 2, arrowW: 76, arrowGap: 18 },
  /** The credit never runs into the folio's slot, whatever the folio says (counter on or off). */
  credit: { size: 24, lh: 1.3, maxLines: 2, maxW: 564 },
  chip: { padX: 14, padY: 8 },
  col: { x: 288, w: 624, ruleX: 252, ruleW: 3, ruleInset: 12 },
};

/** A text block to fit: its stack item, column and spacing. */
export interface TextBlock {
  item: Extract<StackItem, { kind: 'text' }>;
  x: number;
  width: number;
  gap: number;
  /** The block never starts above this y (e.g. below a print beside the headline). */
  minTop?: number;
}
/** A fixed-height block (tags, attribution, CTA plate). */
export interface FixedBlock {
  fixed: true;
  kind: string;
  label: string;
  x: number;
  w: number;
  h: number;
  gap: number;
}
export type Block = TextBlock | FixedBlock;

const PRIORITY: readonly TextRole[][] = [['body', 'note'], ['subtitle'], ['headline', 'quote']];

const isFixed = (b: Block): b is FixedBlock => 'fixed' in b;

/**
 * Lay blocks top-down from `top`. With `step`, text sizes step down (body → subtitle → headline,
 * round-robin, like DESIGN §3.3) until the last block ends at or above `limit`.
 */
export function fitBlocks(blocks: readonly Block[], top: number, limit: number, m: TextMeasurer, step = true): StackResult {
  const sizes = blocks.map((b) => (isFixed(b) ? 0 : b.item.spec.max));
  const run = (): { placed: Placed[]; bottom: number; tooMany: boolean; charBroken: boolean } => {
    const placed: Placed[] = [];
    let y = top;
    let tooMany = false;
    let charBroken = false;
    blocks.forEach((b, i) => {
      if (i > 0) y += b.gap;
      if (isFixed(b)) {
        placed.push({ item: { kind: 'kicker', h: b.h, w: b.w, gap: b.gap, label: b.label }, x: b.x, y, w: b.w, h: b.h, size: 0 });
        y += b.h;
        return;
      }
      if (b.minTop !== undefined) y = Math.max(y, b.minTop);
      const size = sizes[i]!;
      const s = b.item.spec;
      const wrap = wrapRich(b.item.rich, b.width, { font: { family: s.family, weight: s.weight, size }, mono: s.mono }, m, { widowFix: s.widowFix });
      const h = textHeight(wrap.lines, size, s.lh);
      const w = wrap.lines.reduce((a, l) => Math.max(a, l.width), 0);
      tooMany ||= wrap.lines.length > s.maxLines;
      charBroken ||= wrap.charBroken;
      placed.push({ item: b.item, x: b.x, y, w, h, size, wrap });
      y += h;
    });
    return { placed, bottom: y, tooMany, charBroken };
  };
  let res = run();
  let cursor = 0;
  for (let guard = 0; step && guard < 200 && (res.bottom > limit || res.tooMany); guard++) {
    let stepped = false;
    for (let k = 0; k < PRIORITY.length && !stepped; k++) {
      const roles = PRIORITY[(cursor + k) % PRIORITY.length]!;
      blocks.forEach((b, i) => {
        if (isFixed(b) || !roles.includes(b.item.role) || sizes[i]! <= b.item.spec.min) return;
        sizes[i] = Math.max(b.item.spec.min, sizes[i]! - b.item.spec.step);
        stepped = true;
      });
      if (stepped) cursor = (cursor + k + 1) % PRIORITY.length;
    }
    if (!stepped) break;
    res = run();
  }
  return {
    placed: res.placed, bottom: res.bottom, overflow: res.bottom > limit || res.tooMany,
    codeTooLong: false, charBroken: res.charBroken, droppedIcon: false,
  };
}

/** Move every placed block by dy. */
export function shift(stack: StackResult, dy: number): void {
  for (const p of stack.placed) p.y += dy;
  stack.bottom += dy;
}

export const textBlock = (role: TextRole, rich: Extract<StackItem, { kind: 'text' }>['rich'], spec: TextSpec, tone: 'ink' | 'body' | 'muted', x: number, width: number, gap: number, minTop?: number): TextBlock => ({
  item: { kind: 'text', role, rich, spec, gap, tone }, x, width, gap, ...(minTop !== undefined ? { minTop } : {}),
});

/** Bottom of the last placed text block whose role is one of `roles`. */
export function bottomOf(stack: StackResult, ...roles: TextRole[]): number {
  let b = -Infinity;
  for (const p of stack.placed) if (p.item.kind === 'text' && roles.includes(p.item.role)) b = Math.max(b, p.y + p.h);
  return b;
}

export interface ChromeOpts {
  /** Colour of the mark + handle. */
  ink: string;
  /** Chip behind the handle when it sits on a photo. */
  chip?: string;
}

/** Split-gate mark + handle at the top-left (SPEC-arsip §4). Returns the right edge. */
export function brand(deck: Deck, sans: string, m: TextMeasurer, o: ChromeOpts, ops: Op[], boxes: Box[]): number {
  const c = CHROME_A;
  const font: FontSpec = { family: sans, weight: c.handle.weight, size: c.handle.size };
  const text = deck.handle;
  const tw = text ? m.width(text, font) : 0;
  const right = SAFE.left + c.mark.size + (text ? c.mark.gap + tw : 0);
  if (o.chip) {
    ops.push({ op: 'fill', x: SAFE.left - c.chip.padX, y: c.mark.top - c.chip.padY, w: right - SAFE.left + c.chip.padX * 2, h: c.mark.size + c.chip.padY * 2, color: o.chip });
  }
  ops.push({ op: 'mark', x: SAFE.left, y: c.mark.top, size: c.mark.size, color: o.ink });
  if (text) {
    const x = SAFE.left + c.mark.size + c.mark.gap;
    ops.push({ op: 'label', text, x, y: ROWS.headerBaseline, font, color: o.ink, tracking: 0 });
    boxes.push({ x, y: ROWS.headerBaseline - c.handle.size, w: tw, h: c.handle.size * 1.25, kind: 'handle' });
  }
  boxes.push({ x: SAFE.left, y: c.mark.top, w: c.mark.size, h: c.mark.size, kind: 'mark' });
  return right;
}

export interface FooterOpts {
  credit: string;
  creditColor: string;
  folioColor: string;
  /** Chips behind credit and folio when they sit on a photo. */
  chip?: string;
}

/** Credit caption (left, ≤ 2 lines) and folio + arrow (right) on the footer baseline. */
export function footer(slide: Slide, deck: Deck, fonts: { label: string; caption: string }, m: TextMeasurer, o: FooterOpts, ops: Op[], boxes: Box[]): void {
  const c = CHROME_A;
  const y = ROWS.footerBaseline;
  const last = slide.type === 'end' || slide.counter.i >= slide.counter.total;
  const cover = slide.type === 'cover';
  const folioFont: FontSpec = { family: fonts.label, weight: 700, size: c.folio.size };
  const num = deck.counter === false ? '' : `${pad(slide.counter.i)}/${pad(slide.counter.total)}`;
  const folio = cover ? (deck.lang === 'en' ? 'SWIPE' : 'GESER') : num;
  const arrow = !last;
  const textW = folio ? trackedW(folio, folioFont, c.folio.tracking, m) : 0;
  const arrowSpace = arrow ? c.folio.arrowW + (folio ? c.folio.arrowGap : 0) : 0;
  const folioLeft = SAFE.right - arrowSpace - textW;
  const chip = (x: number, top: number, w: number, h: number): void => {
    if (o.chip && w > 0) ops.push({ op: 'fill', x: x - c.chip.padX, y: top - c.chip.padY, w: w + c.chip.padX * 2, h: h + c.chip.padY * 2, color: o.chip });
  };
  if (textW || arrow) {
    chip(folioLeft, y - c.folio.size, SAFE.right - folioLeft, c.folio.size * 1.1);
    if (folio) ops.push({ op: 'label', text: folio, x: folioLeft, y, font: folioFont, color: o.folioColor, tracking: c.folio.tracking });
    if (arrow) ops.push({ op: 'arrow', x: SAFE.right - c.folio.arrowW, y: y - c.folio.size * 0.36, w: c.folio.arrowW, color: o.folioColor });
    // The page number is the counter (gone with `counter: off`); GESER and the arrow are the swipe hint.
    const h = c.folio.size * 1.25;
    if (folio) boxes.push({ x: folioLeft, y: y - c.folio.size, w: textW, h, kind: cover ? 'swipe' : 'counter' });
    if (arrow) boxes.push({ x: SAFE.right - c.folio.arrowW, y: y - c.folio.size, w: c.folio.arrowW, h, kind: 'swipe' });
  }
  if (!o.credit) return;
  const font: FontSpec = { family: fonts.caption, weight: 400, size: c.credit.size };
  const maxW = c.credit.maxW;
  const lines = wrapPlain(o.credit, maxW, font, m, c.credit.maxLines);
  const lh = c.credit.size * c.credit.lh;
  const w = Math.max(...lines.map((l) => m.width(l, font)));
  const top = y - c.credit.size - (lines.length - 1) * lh;
  chip(SAFE.left, top, w, (lines.length - 1) * lh + c.credit.size * 1.1);
  lines.forEach((l, i) => ops.push({ op: 'label', text: l, x: SAFE.left, y: y - (lines.length - 1 - i) * lh, font, color: o.creditColor, tracking: 0 }));
  boxes.push({ x: SAFE.left, y: top, w, h: (lines.length - 1) * lh + c.credit.size * 1.25, kind: 'credit' });
}

/** The margin rule beside a body block (SPEC-arsip §4). */
export function marginRule(p: Placed | undefined, color: string, ops: Op[]): void {
  if (!p || p.h <= 0) return;
  const c = CHROME_A.col;
  ops.push({ op: 'rule', x: c.ruleX, y: p.y + c.ruleInset, w: c.ruleW, h: Math.max(0, p.h - c.ruleInset * 2), color });
}

const pad = (n: number): string => String(n).padStart(2, '0');

export function trackedW(text: string, font: FontSpec, tracking: number, m: TextMeasurer): number {
  const chars = Array.from(text);
  return chars.reduce((w, ch) => w + m.width(ch, font), 0) + Math.max(0, chars.length - 1) * tracking;
}

/** Greedy word wrap of a plain string (optionally tracked); the last allowed line is cut with "…". */
export function wrapPlain(text: string, maxW: number, font: FontSpec, m: TextMeasurer, maxLines: number, tracking = 0): string[] {
  const width = (t: string): number => (tracking ? trackedW(t, font, tracking, m) : m.width(t, font));
  const lines: string[] = [];
  let cur = '';
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const next = cur ? `${cur} ${word}` : word;
    if (cur && width(next) > maxW) {
      lines.push(cur);
      cur = word;
    } else cur = next;
  }
  if (cur) lines.push(cur);
  if (lines.length <= maxLines) return lines;
  const kept = lines.slice(0, maxLines);
  let lastLine = `${kept[maxLines - 1]} ${lines.slice(maxLines).join(' ')}`;
  while (lastLine.length > 1 && width(`${lastLine}…`) > maxW) lastLine = lastLine.slice(0, -1);
  kept[maxLines - 1] = `${lastLine.trimEnd()}…`;
  return kept;
}
