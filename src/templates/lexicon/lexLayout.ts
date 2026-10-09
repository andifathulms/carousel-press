// Shared layout primitives for word/table/compare slides (SPEC-lexicon §4). Pure given a measurer.
import type { Rich } from '../../core/types';
import type { FontSpec, TextMeasurer } from '../../layout/measure';
import { type TextStyle, type WrappedLine, textHeight, wrapRich } from '../../layout/wrap';
import type { Box } from '../../render/safezone';

/** IPA face (SPEC-lexicon §3.1). Bundled for every family. */
export const IPA_FACE = 'Gentium Book Plus';

/** Positioned drawing primitives. Colours are resolved at layout time. */
export type LexEl =
  | {
    k: 'text'; x: number; y: number; lines: WrappedLine[]; size: number; lh: number; style: TextStyle;
    color: string; accent: string;
    /** Accent runs get a marker of this colour behind them and are drawn in `color`. */
    highlight?: string;
    /** Strike through each line (compare: wrong). */
    strike?: boolean;
  }
  | { k: 'label'; x: number; y: number; text: string; font: FontSpec; color: string; tracking: number }
  | { k: 'pill'; x: number; y: number; w: number; h: number; text: string; font: FontSpec; color: string; tracking: number; padX: number }
  | { k: 'badge'; x: number; y: number; w: number; h: number; text: string; font: FontSpec; bg: string; ink: string; radius: number }
  | { k: 'rect'; x: number; y: number; w: number; h: number; fill: string; radius: number }
  | { k: 'frame'; x: number; y: number; w: number; h: number; stroke: string; width: number; radius: number }
  | { k: 'clip'; x: number; y: number; w: number; h: number; radius: number }
  | { k: 'unclip' }
  | { k: 'icon'; name: 'x-circle' | 'check-circle'; x: number; y: number; size: number; color: string };

export interface LexLayout {
  els: LexEl[];
  bottom: number;
  overflow: boolean;
}

/** A sized text spec: max → min in steps. */
export interface Sized {
  max: number;
  min: number;
  step: number;
}

/** Mutable font sizes keyed by block name, stepped down in a priority order until the stack fits. */
export class SizeSet {
  private sizes = new Map<string, number>();
  private specs = new Map<string, Sized>();
  private cursor = 0;

  constructor(specs: Record<string, Sized>) {
    for (const [k, s] of Object.entries(specs)) {
      this.specs.set(k, s);
      this.sizes.set(k, s.max);
    }
  }

  get(k: string): number {
    return this.sizes.get(k)!;
  }

  /** Step the next block in `order` (round-robin) that can still shrink. False when none can. */
  stepDown(order: readonly string[], first?: string): boolean {
    if (first && this.canStep(first)) {
      this.step(first);
      return true;
    }
    for (let k = 0; k < order.length; k++) {
      const key = order[(this.cursor + k) % order.length]!;
      if (this.canStep(key)) {
        this.step(key);
        this.cursor = (this.cursor + k + 1) % order.length;
        return true;
      }
    }
    return false;
  }

  private canStep(k: string): boolean {
    const s = this.specs.get(k);
    return !!s && this.sizes.get(k)! > s.min;
  }

  private step(k: string): void {
    const s = this.specs.get(k)!;
    this.sizes.set(k, Math.max(s.min, this.sizes.get(k)! - s.step));
  }
}

/** Wrap rich text and measure it. */
export function wrapBlock(rich: Rich, width: number, style: TextStyle, lh: number, m: TextMeasurer): { lines: WrappedLine[]; h: number; w: number; charBroken: boolean } {
  const wrap = wrapRich(rich, width, style, m);
  const w = wrap.lines.reduce((a, l) => Math.max(a, l.width), 0);
  return { lines: wrap.lines, h: textHeight(wrap.lines, style.font.size, lh), w, charBroken: wrap.charBroken };
}

/** Width of tracked text. */
export function trackedW(text: string, font: FontSpec, tracking: number, m: TextMeasurer): number {
  return m.width(text, font) + tracking * Math.max(0, Array.from(text).length - 1);
}

/** Safe-zone boxes for every element that carries meaning. */
export function lexBoxes(els: readonly LexEl[]): Box[] {
  const out: Box[] = [];
  for (const e of els) {
    switch (e.k) {
      case 'text': {
        const w = e.lines.reduce((a, l) => Math.max(a, l.width), 0);
        out.push({ x: e.x, y: e.y, w, h: textHeight(e.lines, e.size, e.lh), kind: 'lex-text' });
        break;
      }
      case 'pill': case 'badge': case 'rect': case 'frame':
        out.push({ x: e.x, y: e.y, w: e.w, h: e.h, kind: `lex-${e.k}` });
        break;
      case 'icon':
        out.push({ x: e.x, y: e.y, w: e.size, h: e.size, kind: 'lex-icon' });
        break;
      default:
        break;
    }
  }
  return out;
}

/** Rich text for a raw string drawn verbatim (no inline rules), e.g. IPA. */
export function plainRich(text: string): Rich {
  return [[[{ text, style: 'plain' }]]];
}
