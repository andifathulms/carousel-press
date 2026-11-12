// Arsip type scale and the context every plate builder gets (docs/SPEC-arsip.md §3.3).
import type { Deck, Slide, Warning } from '../../core/types';
import type { FontSpec, TextMeasurer } from '../../layout/measure';
import type { TextSpec } from '../../layout/stack';
import type { Box } from '../../render/safezone';
import type { PhotoSize } from '../common';
import type { Surface, Variant } from '../types';
import type { FixedBlock, Op } from './plan';

type Spec = Omit<TextSpec, 'family' | 'mono'> & { face: 'serif' | 'sans' };

export const TYPE = {
  coverHeadline: { face: 'serif', weight: 700, max: 88, min: 68, step: 4, lh: 1.06, maxLines: 4, widowFix: true },
  coverSubtitle: { face: 'sans', weight: 400, max: 38, min: 32, step: 2, lh: 1.45, maxLines: 4 },
  headline: { face: 'serif', weight: 700, max: 70, min: 56, step: 2, lh: 1.1, maxLines: 3, widowFix: true },
  bigHeadline: { face: 'serif', weight: 700, max: 84, min: 64, step: 4, lh: 1.08, maxLines: 4, widowFix: true },
  /** Babak with a portrait print: the headline shares the top with the print. */
  narrowHeadline: { face: 'serif', weight: 700, max: 72, min: 56, step: 4, lh: 1.08, maxLines: 4, widowFix: true },
  // 45–55-word bodies (owner, Nov 2026: slides read empty at ~25 words).
  body: { face: 'sans', weight: 400, max: 38, min: 34, step: 2, lh: 1.45, maxLines: 12 },
  quote: { face: 'serif', weight: 600, max: 58, min: 44, step: 2, lh: 1.2, maxLines: 6, widowFix: true },
  endHeadline: { face: 'serif', weight: 700, max: 76, min: 60, step: 4, lh: 1.08, maxLines: 4, widowFix: true },
} satisfies Record<string, Spec>;

/** Tags and labels in the condensed face, 700 (the only weight bundled). */
export const LABEL = {
  tab: { size: 30, minSize: 22, tracking: 4, h: 56, padX: 26, baseline: 39 },
  kicker: { size: 26, tracking: 3, h: 32 },
  tag: { size: 28, tracking: 4, h: 28 },
  attribution: { size: 26, tracking: 2, h: 34 },
  cta: { size: 34, tracking: 3, h: 96, padX: 40 },
};

/** Plate geometry (SPEC-arsip §5). */
export const PLATE = {
  top: 344,
  sampul: { band: 760, cardX: 72, cardW: 864, cardTop: 428, tabTop: 372, padX: 48, padTop: 44, padBottom: 52, subGap: 36, maxBottom: 1300 },
  babak: { gap: 56, print: { x: 576, y: 300, w: 336, h: 380, border: 14, rot: 1.5 }, headW: 456, bodyGap: 64, landGap: 72, landMin: 300 },
  atas: { photoLeft: 396, brandGap: 40, maxH: 840, minH: 520, headOverlap: 116, headW: 680, plateX: 72, platePad: [24, 40, 20, 24] as const, bodyGap: 80 },
  bawah: { photoLeft: 396, bodyGap: 40, photoGap: 80, minTop: 960, maxTop: 1180 },
  bentang: { photoGap: 80, minTop: 960, maxTop: 1180 },
  teks: { bodyGap: 48 },
  naskah: { band: 720, sheetX: 84, sheetW: 840, topPhoto: 600, topPlain: 380, padX: 52, padTop: 40, padBottom: 48, quoteGap: 24, attrGap: 28, bodyGap: 72, rot: -1.2 },
  akhir: { print: { x: 96, y: 310, w: 440, h: 420, border: 14, rot: 1.5 }, topPhoto: 800, topPlain: 420, bodyGap: 32, ctaGap: 56 },
};

export interface ArsipCtx {
  slide: Slide;
  deck: Deck;
  v: Variant;
  m: TextMeasurer;
  photo: PhotoSize | null;
  credit: string;
  story: Surface;
  ops: Op[];
  boxes: Box[];
  warnings: Warning[];
  rng: () => number;
  serif: string;
  sans: string;
  label: string;
  caption: string;
}

export function spec(A: ArsipCtx, s: Spec): TextSpec {
  return { ...s, family: s.face === 'serif' ? A.serif : A.sans, mono: { family: A.v.fonts.mono, weight: s.weight >= 600 ? 600 : 400 } };
}

export function labelFont(A: ArsipCtx, size: number): FontSpec {
  return { family: A.label, weight: 700, size };
}

/** A fixed block holding one tracked label line. */
export function labelBlock(A: ArsipCtx, kind: string, text: string, l: { size: number; tracking: number; h: number }, x: number, gap: number): FixedBlock {
  const chars = Array.from(text);
  const w = chars.reduce((a, ch) => a + A.m.width(ch, labelFont(A, l.size)), 0) + Math.max(0, chars.length - 1) * l.tracking;
  return { fixed: true, kind, label: text, x, w, h: l.h, gap };
}

/** Degrees → radians, signed by the slide's seeded PRNG. */
export function tilt(A: ArsipCtx, deg: number): number {
  return (A.rng() < 0.5 ? -1 : 1) * deg * (Math.PI / 180);
}
