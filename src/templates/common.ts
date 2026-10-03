import type { Deck, Rich, Slide, Warning } from '../core/types';
import type { PoolIcon } from '../core/iconNames';
import { splitArrow, t } from '../core/strings';
import type { FontSpec, TextMeasurer } from '../layout/measure';
import type { StackResult } from '../layout/stack';
import { type Box, CONTENT_W, ROWS, SAFE } from '../render/safezone';
import type { Surface, Variant } from './types';

export interface LayoutInput {
  slide: Slide;
  deck: Deck;
  variant: Variant;
  icon: PoolIcon | null;
  hasPhoto: boolean;
  measurer: TextMeasurer;
}

export interface HeaderLayout {
  handle: string;
  handleFont: FontSpec;
  right: { kind: 'rule'; x1: number; x2: number; y: number; h: number } | { kind: 'path'; text: string; font: FontSpec };
}

export interface FooterLayout {
  swipe: { text: string; arrow: boolean; leadIcon: 'circle-arrow' | null; font: FontSpec; w: number } | null;
  counter: { text: string; font: FontSpec; w: number };
}

export interface SlideLayout {
  slide: Slide;
  deck: Deck;
  variant: Variant;
  surface: Surface;
  surfaceName: string;
  onPhoto: boolean;
  stack: StackResult;
  icon: PoolIcon | null;
  ctaLabel: string | null;
  header: HeaderLayout;
  footer: FooterLayout;
  boxes: Box[];
  warnings: Warning[];
}

/** Shared header/footer/CTA metrics (DESIGN §3.1, §3.2, §3.8). */
export const CHROME = {
  handleSize: 30,
  handleWeight: 500,
  handleMax: 480,
  pathSize: 26,
  pathMax: 300,
  rule: { x1: 832, x2: 912, y: 226, h: 2 },
  footerSize: 30,
  counterSize: 28,
  arrowSize: 28,
  arrowGap: 12,
  circleArrowSize: 32,
  circleArrowGap: 14,
  cta: { h: 96, radius: 48, padX: 40, icon: 36, gap: 16, size: 34, weight: 600, gapBefore: 64 },
};

/** Pick the slide's surface (DESIGN §4.2) and report unknown `surface=` names. */
export function resolveSurface(v: Variant, slide: Slide, hasPhoto: boolean, warnings: Warning[]): { surface: Surface; name: string; onPhoto: boolean } {
  if (hasPhoto) return { surface: v.onPhoto, name: 'onPhoto', onPhoto: true };
  const isContent = slide.contentIndex >= 0;
  let name = isContent ? v.rotation[slide.contentIndex % v.rotation.length]! : 'deep';
  const req = slide.attrs.surface;
  if (req && req !== 'auto') {
    if (v.surfaces[req]) name = req;
    else {
      warnings.push({
        code: 'unknown-attr', slideIndex: slide.index, line: slide.lines[0],
        message: `Unknown surface "${req}" for ${v.id} (has: ${Object.keys(v.surfaces).join(', ')})`,
      });
    }
  }
  return { surface: v.surfaces[name]!, name, onPhoto: false };
}

/** Truncate text with "…" to fit maxWidth. */
export function truncate(text: string, maxWidth: number, font: FontSpec, m: TextMeasurer): string {
  if (m.width(text, font) <= maxWidth) return text;
  const chars = Array.from(text);
  while (chars.length && m.width(chars.join('') + '…', font) > maxWidth) chars.pop();
  return chars.join('') + '…';
}

export function layoutHeader(input: LayoutInput, sans: string, mono: string, boxes: Box[]): HeaderLayout {
  const m = input.measurer;
  const handleFont: FontSpec = { family: sans, weight: CHROME.handleWeight, size: CHROME.handleSize };
  const handle = truncate(input.deck.handle, CHROME.handleMax, handleFont, m);
  const top = ROWS.headerBaseline - CHROME.handleSize;
  if (handle) boxes.push({ x: SAFE.left, y: top, w: m.width(handle, handleFont), h: CHROME.handleSize * 1.25, kind: 'handle' });

  if (input.variant.family === 'dev') {
    const font: FontSpec = { family: mono, weight: 500, size: CHROME.pathSize };
    const text = truncate(`~/${input.deck.slug}`, CHROME.pathMax, font, m);
    const w = m.width(text, font);
    boxes.push({ x: SAFE.right - w, y: ROWS.headerBaseline - CHROME.pathSize, w, h: CHROME.pathSize * 1.25, kind: 'path' });
    return { handle, handleFont, right: { kind: 'path', text, font } };
  }
  const r = CHROME.rule;
  boxes.push({ x: r.x1, y: r.y, w: r.x2 - r.x1, h: r.h, kind: 'rule' });
  return { handle, handleFont, right: { kind: 'rule', ...r } };
}

export function layoutFooter(input: LayoutInput, sans: string, mono: string, boxes: Box[], circleOnCover: boolean): FooterLayout {
  const m = input.measurer;
  const { slide, deck } = input;
  const top = ROWS.footerBaseline - CHROME.footerSize;
  const h = CHROME.footerSize * 1.25;
  let swipe: FooterLayout['swipe'] = null;
  if (slide.swipe) {
    const font: FontSpec = { family: sans, weight: 500, size: CHROME.footerSize };
    const s = splitArrow(t(slide.swipe, deck.lang));
    const leadIcon = slide.swipe === 'coverSwipe' && circleOnCover ? 'circle-arrow' as const : null;
    let w = m.width(s.text, font);
    if (s.arrow) w += CHROME.arrowGap + CHROME.arrowSize;
    if (leadIcon) w += CHROME.circleArrowSize + CHROME.circleArrowGap;
    swipe = { text: s.text, arrow: s.arrow, leadIcon, font, w };
    boxes.push({ x: SAFE.left, y: top, w, h, kind: 'swipe' });
  }
  const font: FontSpec = { family: mono, weight: 500, size: CHROME.counterSize };
  const text = `${slide.counter.i}/${slide.counter.total}`;
  const w = m.width(text, font);
  boxes.push({ x: SAFE.right - w, y: top, w, h, kind: 'counter' });
  return { swipe, counter: { text, font, w } };
}

/** CTA label for a slide, or null when the slide has no CTA. */
export function ctaLabel(slide: Slide, deck: Deck): string | null {
  if (!slide.showCta) return null;
  return typeof slide.attrs.cta === 'string' && slide.attrs.cta ? slide.attrs.cta : t('cta', deck.lang);
}

export function ctaWidth(label: string, sans: string, m: TextMeasurer): number {
  const c = CHROME.cta;
  const w = c.padX * 2 + c.icon + c.gap + m.width(label, { family: sans, weight: c.weight, size: c.size });
  return Math.min(w, CONTENT_W);
}

/** Prepend an accent prefix (terminal `> `) to the first line of a headline. */
export function withPrefix(rich: Rich, prefix: string | undefined): Rich {
  if (!prefix || !rich.length) return rich;
  const [first, ...rest] = rich;
  const [line, ...lines] = first!;
  return [[[{ text: prefix.trimEnd(), style: 'accent' }, { text: ' ', style: 'plain' }, ...(line ?? [])], ...lines], ...rest];
}

/** Content-stack frame from a top anchor. */
export function frameFrom(top: number): { x: number; width: number; top: number; limit: number } {
  return { x: SAFE.left, width: CONTENT_W, top, limit: ROWS.stackLimit };
}

/** Renderer warnings derived from a stack result. */
export function stackWarnings(slide: Slide, stack: StackResult): Warning[] {
  const out: Warning[] = [];
  const line = slide.lines[0];
  if (stack.codeTooLong) {
    out.push({ code: 'code-line-too-long', slideIndex: slide.index, line, message: `Slide ${slide.index + 1}: a code line is too long and gets clipped` });
  }
  if (stack.overflow) {
    out.push({ code: 'overflow', slideIndex: slide.index, line, message: `Slide ${slide.index + 1}: text doesn't fit` });
  }
  if (stack.charBroken) {
    out.push({ code: 'long-word', slideIndex: slide.index, line, message: `Slide ${slide.index + 1}: a word is too long and was broken` });
  }
  return out;
}

/** Boxes of every placed stack block. */
export function stackBoxes(stack: StackResult): Box[] {
  return stack.placed.map((p) => ({ x: p.x, y: p.y, w: p.item.kind === 'code' ? CONTENT_W : p.w, h: p.h, kind: p.item.kind === 'text' ? p.item.role : p.item.kind }));
}
