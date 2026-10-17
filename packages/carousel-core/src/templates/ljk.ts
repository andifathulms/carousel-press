// LJK (lembar jawaban komputer) treatment for lexicon/lembar (DESIGN §6.8): body lines "A. …" to
// "E. …" become circled-letter option rows, and a "Jawaban X" verdict gets a bubble row with X filled.
import type { Rich, RichLine, Slide } from '../core/types';
import type { TextMeasurer } from '../layout/measure';
import type { LjkOption, StackItem } from '../layout/stack';
import type { Ctx } from '../render/ctx';
import { CONTENT_W } from '../render/safezone';
import { setFont, setShadow } from '../render/text';
import type { Surface, Variant } from './types';

export const LJK = {
  /** Option rows: text size steps down until every row fits one line. */
  option: { max: 56, min: 38, step: 2, weight: 500, letterWeight: 700, rowLh: 1.62, bubble: 1.18, gap: 0.55, stroke: 4 },
  /** Answer bubbles under a verdict stamp. */
  bubbles: { d: 68, gap: 24, size: 32, weight: 700, stroke: 4 },
  /** Solution cards: the working lines (one calculation per line) a step larger than body text. */
  working: { max: 48, min: 36 },
  letters: ['A', 'B', 'C', 'D', 'E'] as const,
};

const OPTION = /^([A-E])\.\s+(.*)$/;

const lineText = (line: RichLine): string => line.map((r) => r.text).join('');

/** Split a body into text before the options, the A–E options, and text after. Null when there are fewer than two. */
export function splitOptions(body: Rich): { pre: Rich; options: LjkOption[]; post: Rich } | null {
  // One contiguous run of option lines; text before it stays above, text after it goes below.
  const pre: Rich = [];
  const post: Rich = [];
  const options: LjkOption[] = [];
  let phase: 'pre' | 'options' | 'post' = 'pre';
  for (const para of body) {
    let cur: RichLine[] = [];
    const flush = (): void => {
      if (cur.length) (phase === 'pre' ? pre : post).push(cur);
      cur = [];
    };
    for (const line of para) {
      const m = phase !== 'post' ? OPTION.exec(lineText(line).trim()) : null;
      if (m) {
        if (phase === 'pre') flush();
        phase = 'options';
        options.push({ letter: m[1]!, text: m[2]! });
        continue;
      }
      if (phase === 'options') phase = 'post';
      cur.push(line);
    }
    flush();
  }
  return options.length >= 2 ? { pre, options, post } : null;
}

/** The option list as one fixed stack item, or null when the rows can't fit one line each at the minimum size. */
export function optionsItem(options: LjkOption[], v: Variant, m: TextMeasurer, gap: number): StackItem | null {
  const o = LJK.option;
  for (let size = o.max; size >= o.min; size -= o.step) {
    const textX = size * o.bubble + size * o.gap;
    const widest = Math.max(...options.map((op) => m.width(op.text, { family: v.fonts.sans, weight: o.weight, size })));
    if (textX + widest <= CONTENT_W) {
      return { kind: 'options', h: Math.round(options.length * size * o.rowLh), w: Math.ceil(textX + widest), gap, options, size };
    }
  }
  return null;
}

/** "1 · Jawaban D" → a row of A–E bubbles with D filled. */
export function bubblesItem(slide: Slide, gap: number): StackItem | null {
  const m = /JAWABAN\s+([A-E])\b/i.exec(slide.attrs.verdict ?? '');
  if (!m) return null;
  const b = LJK.bubbles;
  return { kind: 'bubbles', h: b.d, w: b.d * 5 + b.gap * 4, gap, label: m[1]!.toUpperCase() };
}

interface PlacedLike { item: StackItem; x: number; y: number }

export function drawLjkItem(ctx: Ctx, p: PlacedLike, v: Variant, s: Surface, onPhoto: boolean): boolean {
  const it = p.item;
  setShadow(ctx, onPhoto);
  if (it.kind === 'options') {
    const o = LJK.option;
    const size = it.size;
    const rowH = size * o.rowLh;
    const d = size * o.bubble;
    it.options.forEach((op, i) => {
      const cy = p.y + rowH * i + rowH / 2;
      ctx.strokeStyle = s.accent;
      ctx.lineWidth = o.stroke;
      ctx.beginPath();
      ctx.arc(p.x + d / 2, cy, d / 2 - o.stroke / 2, 0, Math.PI * 2);
      ctx.stroke();
      setFont(ctx, { family: v.fonts.sans, weight: o.letterWeight, size: Math.round(size * 0.62) });
      ctx.fillStyle = s.accent;
      ctx.textAlign = 'center';
      ctx.fillText(op.letter, p.x + d / 2, cy + size * 0.62 * 0.36);
      ctx.textAlign = 'left';
      setFont(ctx, { family: v.fonts.sans, weight: o.weight, size });
      ctx.fillStyle = s.ink;
      ctx.fillText(op.text, p.x + d + size * o.gap, cy + size * 0.35);
    });
    return true;
  }
  if (it.kind === 'bubbles') {
    const b = LJK.bubbles;
    LJK.letters.forEach((letter, i) => {
      const cx = p.x + b.d / 2 + i * (b.d + b.gap);
      const cy = p.y + b.d / 2;
      const filled = letter === it.label;
      ctx.beginPath();
      ctx.arc(cx, cy, b.d / 2 - b.stroke / 2, 0, Math.PI * 2);
      if (filled) {
        ctx.fillStyle = s.ink;
        ctx.fill();
      } else {
        ctx.strokeStyle = s.muted;
        ctx.lineWidth = b.stroke;
        ctx.stroke();
      }
      setFont(ctx, { family: v.fonts.sans, weight: b.weight, size: b.size });
      ctx.fillStyle = filled ? s.bg : s.muted;
      ctx.textAlign = 'center';
      ctx.fillText(letter, cx, cy + b.size * 0.36);
      ctx.textAlign = 'left';
    });
    return true;
  }
  return false;
}
