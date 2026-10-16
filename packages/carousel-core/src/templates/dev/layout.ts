import { isEmptyRich, upperRich } from '../../core/inline';
import { type Warning, isArabicType, isLexType } from '../../core/types';
import { layoutLexSlide } from '../lexicon/lexDispatch';
import { layoutArabicSlide } from '../serene/arabicLayout';
import { diagramItem, verdictItem } from '../stamps';
import { sheetItem } from '../sheet';
import { prepareCode } from '../../layout/codeFit';
import { type CodeSpec, type StackItem, type TextSpec, fitStack } from '../../layout/stack';
import { legibleMin } from '../../layout/measure';
import { type Box, CONTENT_W, ROWS } from '../../render/safezone';
import {
  CHROME, type LayoutInput, type SlideLayout, ctaLabel, ctaWidth, centerStack, frameFrom, layoutFooter, layoutHeader,
  resolveSurface, stackBoxes, stackWarnings, withPrefix,
} from '../common';

type Spec = Omit<TextSpec, 'family' | 'mono'>;

/** Dev type scale (DESIGN §3.4). Headline weights may be overridden per variant (terminal). */
export const TYPE = {
  coverHeadline: { weight: 800, max: 116, min: 80, step: 4, lh: 1.05, maxLines: 5, widowFix: true },
  coverSubtitle: { weight: 400, max: 40, min: 32, step: 2, lh: 1.45, maxLines: 3 },
  cardHeadline: { weight: 700, max: 84, min: 60, step: 4, lh: 1.12, maxLines: 5, widowFix: true },
  codeHeadline: { weight: 700, max: 72, min: 56, step: 4, lh: 1.12, maxLines: 3, widowFix: true },
  // body min 30 → 32 for phone legibility (owner, Oct 2026).
  body: { weight: 400, max: 40, min: 32, step: 2, lh: 1.5, maxLines: 6 },
  note: { weight: 400, max: 32, min: 30, step: 2, lh: 1.45, maxLines: 3 },
  quote: { weight: 600, max: 68, min: 48, step: 4, lh: 1.2, maxLines: 7, widowFix: true },
  endHeadline: { weight: 800, max: 108, min: 76, step: 4, lh: 1.06, maxLines: 4, widowFix: true },
} satisfies Record<string, Spec>;

/** Sport headlines: Barlow Condensed capitals are ~25% narrower, so they run larger (DESIGN §6.6). */
export const SPORT_TYPE = {
  coverHeadline: { ...TYPE.coverHeadline, max: 136, min: 92 },
  cardHeadline: { ...TYPE.cardHeadline, max: 104, min: 72, lh: 1.02, maxLines: 6 },
  codeHeadline: { ...TYPE.codeHeadline, max: 88, min: 64, lh: 1.02 },
  endHeadline: { ...TYPE.endHeadline, max: 128, min: 88, lh: 1.0 },
} satisfies Record<string, Spec>;

export const FIXED = {
  number: { size: 44, weight: 600, h: 44, bar: { w: 48, h: 4, gap: 20 } },
  kicker: { size: 26, weight: 600, tracking: 2, padY: 14, padX: 22, border: 2, radius: 12 },
  attribution: { size: 30, weight: 500, lh: 1.3 },
  icon: 112,
  // Short blocks are the payoff: up to 56 px when the block has ≤ shortLines lines (Oct 2026 review).
  code: { max: 44, maxShort: 56, shortLines: 4, min: 28, step: 2, lh: 1.55, maxLines: 14, padX: 36, padY: 32, titleBar: 64, radius: 24 },
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
  if (isArabicType(input.slide.type)) return layoutArabicSlide(input);
  const { slide, deck, variant: v, measurer: m } = input;
  const sans = v.fonts.sans;
  const mono = v.fonts.mono;
  const warnings: Warning[] = [];
  const boxes: Box[] = [];
  const { surface, name, onPhoto } = resolveSurface(v, slide, input.hasPhoto, warnings);

  const hw = v.headlineWeight;
  // Sport: headlines in the display face (fonts.serif slot), body stays in the sans.
  const display = v.family === 'sport' ? v.fonts.serif ?? sans : sans;
  const spec = (s: Spec, headline = false): TextSpec => {
    const weight = headline && hw ? hw : s.weight;
    const family = headline ? display : sans;
    return { ...s, min: legibleMin(s.min, family), weight, family, mono: { family: mono, weight: weight >= 600 ? 600 : 400 } };
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
  const T = v.family === 'sport' ? { ...TYPE, ...SPORT_TYPE } : TYPE;
  const kickerItem = (): boolean => {
    if (!slide.attrs.kicker) return false;
    const k = FIXED.kicker;
    const label = slide.attrs.kicker.toUpperCase();
    const w = m.width(label, { family: mono, weight: k.weight, size: k.size }) +
      k.tracking * Math.max(0, Array.from(label).length - 1) + k.padX * 2;
    push({ kind: 'kicker', h: k.size + k.padY * 2, w: Math.min(w, CONTENT_W), gap: 0, label });
    return true;
  };
  const prefixed = (rich: typeof slide.headline): typeof slide.headline =>
    withPrefix(v.headlineUpper ? upperRich(rich) : rich, v.headlinePrefix);
  let top: number = STACK.cardTop;

  switch (slide.type) {
    case 'cover': {
      top = STACK.coverTop;
      kickerItem();
      push({ kind: 'text', role: 'headline', rich: prefixed(slide.headline), spec: spec(T.coverHeadline, true), gap: STACK.gap, tone: 'ink' });
      if (!isEmptyRich(slide.body)) push({ kind: 'text', role: 'subtitle', rich: slide.body, spec: spec(TYPE.coverSubtitle), gap: STACK.gap, tone: 'muted' });
      break;
    }
    case 'card': {
      // A card kicker replaces the number (PRD §4.3).
      const kicked = kickerItem();
      const verdict = verdictItem(slide, v, m, STACK.gap);
      if (verdict) push(verdict);
      else if (!kicked) numberItem(0);
      push({ kind: 'text', role: 'headline', rich: prefixed(slide.headline), spec: spec(T.cardHeadline, true), gap: STACK.gap, tone: 'ink' });
      if (!isEmptyRich(slide.body)) push({ kind: 'text', role: 'body', rich: slide.body, spec: spec(TYPE.body), gap: STACK.gap, tone: 'body' });
      pushIcon();
      pushCta(CHROME.cta.gapBefore);
      break;
    }
    case 'code': {
      numberItem(0);
      push({ kind: 'text', role: 'headline', rich: prefixed(slide.headline), spec: spec(T.codeHeadline, true), gap: STACK.codeNumberGap, tone: 'ink' });
      if (!isEmptyRich(slide.body)) push({ kind: 'text', role: 'body', rich: slide.body, spec: spec(TYPE.body), gap: STACK.codeBodyGap, tone: 'muted' });
      if (slide.code) {
        const c = FIXED.code;
        const lines = prepareCode(slide.code.text, slide.code.lang);
        const codeSpec: CodeSpec = {
          family: mono, weight: 400, max: lines.length <= c.shortLines ? c.maxShort : c.max, min: c.min, step: c.step, lh: c.lh, maxLines: c.maxLines,
          padX: c.padX, padTop: c.padY, padBottom: c.padY, titleBar: v.code.dots ? c.titleBar : 0,
        };
        push({ kind: 'code', lines, lang: slide.code.lang, spec: codeSpec, gap: STACK.codeGap });
      }
      if (!isEmptyRich(slide.note)) push({ kind: 'text', role: 'note', rich: slide.note, spec: spec(TYPE.note), gap: STACK.noteGap, tone: 'muted' });
      pushCta(CHROME.cta.gapBefore);
      break;
    }
    case 'diagram': {
      const verdict = verdictItem(slide, v, m, 0);
      if (verdict) push(verdict);
      else numberItem(0);
      const d = diagramItem(slide, STACK.codeNumberGap);
      if (d) push(d);
      push({ kind: 'text', role: 'headline', rich: prefixed(slide.headline), spec: spec(T.codeHeadline, true), gap: STACK.codeGap, tone: 'ink' });
      if (!isEmptyRich(slide.body)) push({ kind: 'text', role: 'body', rich: slide.body, spec: spec(TYPE.body), gap: STACK.codeBodyGap, tone: 'body' });
      if (!isEmptyRich(slide.note)) push({ kind: 'text', role: 'note', rich: slide.note, spec: spec(TYPE.note), gap: STACK.noteGap, tone: 'muted' });
      pushCta(CHROME.cta.gapBefore);
      break;
    }
    case 'sheet': {
      numberItem(0);
      push({ kind: 'text', role: 'headline', rich: prefixed(slide.headline), spec: spec(T.codeHeadline, true), gap: STACK.codeNumberGap, tone: 'ink' });
      if (!isEmptyRich(slide.body)) push({ kind: 'text', role: 'body', rich: slide.body, spec: spec(TYPE.body), gap: STACK.codeBodyGap, tone: 'muted' });
      const sh = sheetItem(slide, v, m, STACK.codeGap, warnings);
      if (sh) push(sh);
      if (!isEmptyRich(slide.note)) push({ kind: 'text', role: 'note', rich: slide.note, spec: spec(TYPE.note), gap: STACK.noteGap, tone: 'muted' });
      pushCta(CHROME.cta.gapBefore);
      break;
    }
    case 'quote': {
      top = STACK.quoteTop;
      kickerItem();
      push({ kind: 'text', role: 'quote', rich: slide.headline, spec: spec(TYPE.quote), gap: STACK.gap, tone: 'ink' });
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
      push({ kind: 'text', role: 'headline', rich: v.headlineUpper ? upperRich(slide.headline) : slide.headline, spec: spec(T.endHeadline, true), gap: 0, tone: 'ink' });
      if (!isEmptyRich(slide.body)) push({ kind: 'text', role: 'body', rich: slide.body, spec: spec(TYPE.body), gap: STACK.gap, tone: 'muted' });
      pushIcon();
      pushCta(STACK.endCtaGap);
      break;
    }
  }

  const stack = fitStack(items, frameFrom(top), m);
  centerStack(stack, slide.type === 'cover' ? top : ROWS.stackTopCard, onPhoto);
  const header = layoutHeader(input, sans, mono, boxes);
  const footer = layoutFooter(input, sans, mono, boxes, false);
  boxes.push(...stackBoxes(stack));
  warnings.push(...stackWarnings(slide, stack));
  const icon = stack.placed.some((p) => p.item.kind === 'icon') ? input.icon : null;
  return {
    slide, deck, variant: v, surface, surfaceName: name, onPhoto, stack, icon, ctaLabel: cta, header, footer, boxes, warnings,
  };
}
