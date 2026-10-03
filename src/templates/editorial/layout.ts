import { isEmptyRich } from '../../core/inline';
import { prepareCode } from '../../layout/codeFit';
import { type CodeSpec, type StackItem, type TextSpec, fitStack } from '../../layout/stack';
import { type Box, CONTENT_W } from '../../render/safezone';
import {
  CHROME, type LayoutInput, type SlideLayout, ctaLabel, ctaWidth, frameFrom, layoutFooter, layoutHeader,
  resolveSurface, stackBoxes, stackWarnings,
} from '../common';
import type { Warning } from '../../core/types';

type Spec = Omit<TextSpec, 'family' | 'mono'> & { face: 'serif' | 'sans' };

/** Editorial type scale (DESIGN §3.4). */
export const TYPE = {
  coverHeadline: { face: 'serif', weight: 700, max: 120, min: 84, step: 4, lh: 1.06, maxLines: 5, widowFix: true },
  coverSubtitle: { face: 'sans', weight: 400, max: 40, min: 32, step: 2, lh: 1.45, maxLines: 3 },
  cardHeadline: { face: 'serif', weight: 700, max: 92, min: 64, step: 4, lh: 1.12, maxLines: 6, widowFix: true },
  body: { face: 'sans', weight: 400, max: 42, min: 32, step: 2, lh: 1.5, maxLines: 8 },
  note: { face: 'sans', weight: 400, max: 32, min: 30, step: 2, lh: 1.45, maxLines: 3 },
  quote: { face: 'serif', weight: 600, max: 76, min: 52, step: 4, lh: 1.18, maxLines: 7, widowFix: true },
  endHeadline: { face: 'serif', weight: 700, max: 108, min: 76, step: 4, lh: 1.08, maxLines: 4, widowFix: true },
} satisfies Record<string, Spec>;

export const FIXED = {
  kicker: { size: 26, weight: 600, tracking: 3, h: 32 },
  attribution: { size: 32, weight: 500, lh: 1.3 },
  badge: { d: 120, digit: 54, weight: 600, opticalY: -2 },
  icon: 120,
  code: { max: 40, min: 28, step: 2, lh: 1.55, maxLines: 12, pad: 36, radius: 28 },
  quoteMark: { size: 240, weight: 700, alpha: 0.45, x: 84, top: 300 },
};

/** Stack anchors and gaps (DESIGN §5.2–5.6). */
export const STACK = {
  coverTop: 300,
  cardTop: 344,
  cardTopNoBadge: 380,
  quoteTop: 520,
  endTop: 560,
  kickerGap: 32,
  headlineGap: 40,
  cardGap: 48,
  iconGap: 72,
  noteGap: 32,
  attributionGap: 40,
  quoteBodyGap: 32,
};

export function layoutEditorial(input: LayoutInput): SlideLayout {
  const { slide, deck, variant: v, measurer: m } = input;
  const serif = v.fonts.serif ?? v.fonts.sans;
  const sans = v.fonts.sans;
  const mono = v.fonts.mono;
  const warnings: Warning[] = [];
  const boxes: Box[] = [];
  const { surface, name, onPhoto } = resolveSurface(v, slide, input.hasPhoto, warnings);

  const spec = (s: Spec): TextSpec => ({
    ...s, family: s.face === 'serif' ? serif : sans, mono: { family: mono, weight: s.weight >= 600 ? 600 : 400 },
  });
  const items: StackItem[] = [];
  const push = (it: StackItem): void => {
    items.push({ ...it, gap: items.length ? it.gap : 0 } as StackItem);
  };
  const cta = ctaLabel(slide, deck);
  const pushIconAndCta = (iconGap: number): void => {
    if (input.icon) push({ kind: 'icon', h: FIXED.icon, w: FIXED.icon, gap: iconGap });
    if (cta) push({ kind: 'cta', h: CHROME.cta.h, w: ctaWidth(cta, sans, m), gap: CHROME.cta.gapBefore, label: cta });
  };
  let top: number = STACK.cardTop;

  switch (slide.type) {
    case 'cover': {
      top = STACK.coverTop;
      if (slide.attrs.kicker) push({ kind: 'kicker', h: FIXED.kicker.h, w: 0, gap: 0, label: slide.attrs.kicker.toUpperCase() });
      push({ kind: 'text', role: 'headline', rich: slide.headline, spec: spec(TYPE.coverHeadline), gap: STACK.kickerGap, tone: 'ink' });
      if (!isEmptyRich(slide.body)) push({ kind: 'text', role: 'subtitle', rich: slide.body, spec: spec(TYPE.coverSubtitle), gap: STACK.headlineGap, tone: 'body' });
      break;
    }
    case 'card':
    case 'code': {
      if (slide.badge !== null) push({ kind: 'badge', h: FIXED.badge.d, w: FIXED.badge.d, gap: 0, label: String(slide.badge) });
      else top = STACK.cardTopNoBadge;
      push({ kind: 'text', role: 'headline', rich: slide.headline, spec: spec(TYPE.cardHeadline), gap: STACK.cardGap, tone: 'ink' });
      if (!isEmptyRich(slide.body)) push({ kind: 'text', role: 'body', rich: slide.body, spec: spec(TYPE.body), gap: STACK.cardGap, tone: 'body' });
      if (slide.type === 'code' && slide.code) {
        const c = FIXED.code;
        const codeSpec: CodeSpec = {
          family: mono, weight: 400, max: c.max, min: c.min, step: c.step, lh: c.lh, maxLines: c.maxLines,
          padX: c.pad, padTop: c.pad, padBottom: c.pad, titleBar: 0,
        };
        push({ kind: 'code', lines: prepareCode(slide.code.text, slide.code.lang), lang: slide.code.lang, spec: codeSpec, gap: STACK.iconGap });
        if (!isEmptyRich(slide.note)) push({ kind: 'text', role: 'note', rich: slide.note, spec: spec(TYPE.note), gap: STACK.noteGap, tone: 'muted' });
        if (cta) push({ kind: 'cta', h: CHROME.cta.h, w: ctaWidth(cta, sans, m), gap: CHROME.cta.gapBefore, label: cta });
      } else pushIconAndCta(STACK.iconGap);
      break;
    }
    case 'quote': {
      top = STACK.quoteTop;
      push({ kind: 'text', role: 'quote', rich: slide.headline, spec: spec(TYPE.quote), gap: 0, tone: 'ink' });
      if (slide.attribution) {
        const a = FIXED.attribution;
        push({ kind: 'attribution', h: a.size * a.lh, w: 0, gap: STACK.attributionGap, label: `— ${slide.attribution}` });
      }
      if (!isEmptyRich(slide.body)) push({ kind: 'text', role: 'body', rich: slide.body, spec: spec(TYPE.body), gap: STACK.quoteBodyGap, tone: 'body' });
      pushIconAndCta(STACK.iconGap);
      break;
    }
    case 'end': {
      top = STACK.endTop;
      push({ kind: 'text', role: 'headline', rich: slide.headline, spec: spec(TYPE.endHeadline), gap: 0, tone: 'ink' });
      if (!isEmptyRich(slide.body)) push({ kind: 'text', role: 'body', rich: slide.body, spec: spec(TYPE.body), gap: STACK.headlineGap, tone: 'body' });
      pushIconAndCta(STACK.iconGap);
      const last = items[items.length - 1];
      if (last?.kind === 'cta' && items.length > 1) last.gap = STACK.iconGap;
      break;
    }
  }

  // Fixed items need their real widths for the safe-zone boxes.
  for (const it of items) {
    if (it.kind === 'kicker' && it.label) {
      it.w = m.width(it.label, { family: sans, weight: FIXED.kicker.weight, size: FIXED.kicker.size }) +
        FIXED.kicker.tracking * Math.max(0, Array.from(it.label).length - 1);
    }
    if (it.kind === 'attribution' && it.label) {
      it.w = Math.min(CONTENT_W, m.width(it.label, { family: sans, weight: FIXED.attribution.weight, size: FIXED.attribution.size }));
    }
  }

  const stack = fitStack(items, frameFrom(top), m);
  const header = layoutHeader(input, sans, mono, boxes);
  const footer = layoutFooter(input, sans, mono, boxes, true);
  boxes.push(...stackBoxes(stack));
  warnings.push(...stackWarnings(slide, stack));
  const icon = stack.placed.some((p) => p.item.kind === 'icon') ? input.icon : null;
  return {
    slide, deck, variant: v, surface, surfaceName: name, onPhoto, stack, icon, ctaLabel: cta, header, footer, boxes, warnings,
  };
}
