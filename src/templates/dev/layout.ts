import { isEmptyRich } from '../../core/inline';
import { type Warning, isLexType } from '../../core/types';
import { layoutLexSlide } from '../lexicon/lexDispatch';
import { prepareCode } from '../../layout/codeFit';
import { type CodeSpec, type StackItem, type TextSpec, fitStack } from '../../layout/stack';
import { type Box, CONTENT_W } from '../../render/safezone';
import {
  CHROME, type LayoutInput, type SlideLayout, ctaLabel, ctaWidth, frameFrom, layoutFooter, layoutHeader,
  resolveSurface, stackBoxes, stackWarnings, withPrefix,
} from '../common';

type Spec = Omit<TextSpec, 'family' | 'mono'>;

/** Dev type scale (DESIGN §3.4). Headline weights may be overridden per variant (terminal). */
export const TYPE = {
  coverHeadline: { weight: 800, max: 116, min: 80, step: 4, lh: 1.05, maxLines: 5, widowFix: true },
  coverSubtitle: { weight: 400, max: 40, min: 32, step: 2, lh: 1.45, maxLines: 3 },
  cardHeadline: { weight: 700, max: 84, min: 60, step: 4, lh: 1.12, maxLines: 5, widowFix: true },
  codeHeadline: { weight: 700, max: 72, min: 56, step: 4, lh: 1.12, maxLines: 3, widowFix: true },
  body: { weight: 400, max: 40, min: 30, step: 2, lh: 1.5, maxLines: 6 },
  note: { weight: 400, max: 32, min: 30, step: 2, lh: 1.45, maxLines: 3 },
  quote: { weight: 600, max: 68, min: 48, step: 4, lh: 1.2, maxLines: 7, widowFix: true },
  endHeadline: { weight: 800, max: 108, min: 76, step: 4, lh: 1.06, maxLines: 4, widowFix: true },
} satisfies Record<string, Spec>;

export const FIXED = {
  number: { size: 44, weight: 600, h: 44, bar: { w: 48, h: 4, gap: 20 } },
  kicker: { size: 26, weight: 600, tracking: 2, padY: 14, padX: 22, border: 2, radius: 12 },
  attribution: { size: 30, weight: 500, lh: 1.3 },
  icon: 112,
  code: { max: 44, min: 28, step: 2, lh: 1.55, maxLines: 14, padX: 36, padY: 32, titleBar: 64, radius: 24 },
  quoteMark: { size: 200, weight: 700, x: 90, top: 330 },
};

/** Stack anchors and gaps (DESIGN §6.3). */
export const STACK = {
  coverTop: 360,
  cardTop: 344,
  quoteTop: 520,
  endTop: 580,
  gap: 40,
  codeNumberGap: 32,
  codeBodyGap: 28,
  codeGap: 48,
  noteGap: 32,
  iconGap: 64,
  quoteBodyGap: 32,
  endCtaGap: 72,
};

export function layoutDev(input: LayoutInput): SlideLayout {
  if (isLexType(input.slide.type)) return layoutLexSlide(input);
  const { slide, deck, variant: v, measurer: m } = input;
  const sans = v.fonts.sans;
  const mono = v.fonts.mono;
  const warnings: Warning[] = [];
  const boxes: Box[] = [];
  const { surface, name, onPhoto } = resolveSurface(v, slide, input.hasPhoto, warnings);

  const hw = v.headlineWeight;
  const spec = (s: Spec, headline = false): TextSpec => {
    const weight = headline && hw ? hw : s.weight;
    return { ...s, weight, family: sans, mono: { family: mono, weight: weight >= 600 ? 600 : 400 } };
  };
  const items: StackItem[] = [];
  const push = (it: StackItem): void => {
    items.push({ ...it, gap: items.length ? it.gap : 0 } as StackItem);
  };
  const cta = ctaLabel(slide, deck);
  const pushCta = (gap: number): void => {
    if (cta) push({ kind: 'cta', h: CHROME.cta.h, w: ctaWidth(cta, sans, m), gap, label: cta });
  };
  const pushIcon = (): void => {
    if (input.icon) push({ kind: 'icon', h: FIXED.icon, w: FIXED.icon, gap: STACK.iconGap });
  };
  const numberItem = (gap: number): void => {
    if (slide.badge === null) return;
    const n = FIXED.number;
    const label = String(slide.badge).padStart(2, '0');
    const w = m.width(label, { family: mono, weight: n.weight, size: n.size }) + n.bar.gap + n.bar.w;
    push({ kind: 'number', h: n.h, w, gap, label });
  };
  const prefixed = (rich: typeof slide.headline): typeof slide.headline => withPrefix(rich, v.headlinePrefix);
  let top: number = STACK.cardTop;

  switch (slide.type) {
    case 'cover': {
      top = STACK.coverTop;
      if (slide.attrs.kicker) {
        const k = FIXED.kicker;
        const label = slide.attrs.kicker.toUpperCase();
        const w = m.width(label, { family: mono, weight: k.weight, size: k.size }) +
          k.tracking * Math.max(0, Array.from(label).length - 1) + k.padX * 2;
        push({ kind: 'kicker', h: k.size + k.padY * 2, w: Math.min(w, CONTENT_W), gap: 0, label });
      }
      push({ kind: 'text', role: 'headline', rich: prefixed(slide.headline), spec: spec(TYPE.coverHeadline, true), gap: STACK.gap, tone: 'ink' });
      if (!isEmptyRich(slide.body)) push({ kind: 'text', role: 'subtitle', rich: slide.body, spec: spec(TYPE.coverSubtitle), gap: STACK.gap, tone: 'muted' });
      break;
    }
    case 'card': {
      numberItem(0);
      push({ kind: 'text', role: 'headline', rich: prefixed(slide.headline), spec: spec(TYPE.cardHeadline, true), gap: STACK.gap, tone: 'ink' });
      if (!isEmptyRich(slide.body)) push({ kind: 'text', role: 'body', rich: slide.body, spec: spec(TYPE.body), gap: STACK.gap, tone: 'body' });
      pushIcon();
      pushCta(CHROME.cta.gapBefore);
      break;
    }
    case 'code': {
      numberItem(0);
      push({ kind: 'text', role: 'headline', rich: prefixed(slide.headline), spec: spec(TYPE.codeHeadline, true), gap: STACK.codeNumberGap, tone: 'ink' });
      if (!isEmptyRich(slide.body)) push({ kind: 'text', role: 'body', rich: slide.body, spec: spec(TYPE.body), gap: STACK.codeBodyGap, tone: 'muted' });
      if (slide.code) {
        const c = FIXED.code;
        const codeSpec: CodeSpec = {
          family: mono, weight: 400, max: c.max, min: c.min, step: c.step, lh: c.lh, maxLines: c.maxLines,
          padX: c.padX, padTop: c.padY, padBottom: c.padY, titleBar: v.code.dots ? c.titleBar : 0,
        };
        push({ kind: 'code', lines: prepareCode(slide.code.text, slide.code.lang), lang: slide.code.lang, spec: codeSpec, gap: STACK.codeGap });
      }
      if (!isEmptyRich(slide.note)) push({ kind: 'text', role: 'note', rich: slide.note, spec: spec(TYPE.note), gap: STACK.noteGap, tone: 'muted' });
      pushCta(CHROME.cta.gapBefore);
      break;
    }
    case 'quote': {
      top = STACK.quoteTop;
      push({ kind: 'text', role: 'quote', rich: slide.headline, spec: spec(TYPE.quote), gap: 0, tone: 'ink' });
      if (slide.attribution) {
        const a = FIXED.attribution;
        const label = `— ${slide.attribution}`;
        const w = Math.min(CONTENT_W, m.width(label, { family: mono, weight: a.weight, size: a.size }));
        push({ kind: 'attribution', h: a.size * a.lh, w, gap: STACK.gap, label });
      }
      if (!isEmptyRich(slide.body)) push({ kind: 'text', role: 'body', rich: slide.body, spec: spec(TYPE.body), gap: STACK.quoteBodyGap, tone: 'body' });
      pushIcon();
      pushCta(CHROME.cta.gapBefore);
      break;
    }
    case 'end': {
      top = STACK.endTop;
      push({ kind: 'text', role: 'headline', rich: slide.headline, spec: spec(TYPE.endHeadline, true), gap: 0, tone: 'ink' });
      if (!isEmptyRich(slide.body)) push({ kind: 'text', role: 'body', rich: slide.body, spec: spec(TYPE.body), gap: STACK.gap, tone: 'muted' });
      pushIcon();
      pushCta(STACK.endCtaGap);
      break;
    }
  }

  const stack = fitStack(items, frameFrom(top), m);
  const header = layoutHeader(input, sans, mono, boxes);
  const footer = layoutFooter(input, sans, mono, boxes, false);
  boxes.push(...stackBoxes(stack));
  warnings.push(...stackWarnings(slide, stack));
  const icon = stack.placed.some((p) => p.item.kind === 'icon') ? input.icon : null;
  return {
    slide, deck, variant: v, surface, surfaceName: name, onPhoto, stack, icon, ctaLabel: cta, header, footer, boxes, warnings,
  };
}
