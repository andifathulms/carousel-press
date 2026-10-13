// Verdict stamp and diagram panel (DESIGN §6.7): fixed stack items shared by every family.
import { displayFamily } from './traits';
import type { Slide, VerdictTone } from '../core/types';
import type { FontSpec, TextMeasurer } from '../layout/measure';
import type { StackItem } from '../layout/stack';
import { CONTENT_W } from '../render/safezone';
import type { Surface, Variant } from './types';

export const VERDICT = { size: 88, border: 8, padX: 28, padY: 14, radius: 14, capHeight: 0.7 };

export const DIAGRAM = {
  h: 520, radius: 24, pad: 24,
  line: { width: 3, alpha: 0.55, goal: 8 },
  dot: { r: 26, label: 30, stroke: 4 },
  ball: { r: 12, ring: 4 },
  offside: { width: 4, dash: [14, 10] as [number, number] },
  arrow: { width: 4, dash: [12, 10] as [number, number], head: 18 },
  zoneAlpha: 0.22,
  label: { size: 28, weight: 600, gap: 10 },
};

/** The stamp's font: the variant's card-headline face and weight, so it is always loaded. */
export function verdictFont(v: Variant): FontSpec {
  return { family: displayFamily(v), weight: v.headlineWeight ?? 700, size: VERDICT.size };
}

export function verdictItem(slide: Slide, v: Variant, m: TextMeasurer, gap: number): StackItem | null {
  const raw = slide.attrs.verdict;
  if (!raw) return null;
  const label = raw.toUpperCase();
  const w = Math.min(CONTENT_W, m.width(label, verdictFont(v)) + VERDICT.padX * 2 + VERDICT.border * 2);
  const h = Math.round(VERDICT.size * VERDICT.capHeight + VERDICT.padY * 2 + VERDICT.border * 2);
  return { kind: 'verdict', h, w, gap, label };
}

export function diagramItem(slide: Slide, gap: number): StackItem | null {
  return slide.diagram ? { kind: 'diagram', h: DIAGRAM.h, w: CONTENT_W, gap } : null;
}

/** ok / warn / bad colour on a surface: semantic tokens when the variant has them, else derived. */
export function toneColor(v: Variant, s: Surface, tone: VerdictTone | undefined): string {
  const t = tone ?? 'ok';
  if (v.semantic) return v.semantic[t];
  return t === 'bad' ? s.ink : s.accent;
}
