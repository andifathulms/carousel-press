// Arsip family layout (docs/SPEC-arsip.md): cover, card, quote and end get plates; every other
// slide type is laid out by the editorial family with the arsip tokens.
import { slideRng } from '../../core/hash';
import { isEmptyRich } from '../../core/inline';
import type { Warning } from '../../core/types';
import type { StackResult } from '../../layout/stack';
import { CANVAS, CONTENT_W, ROWS, SAFE } from '../../render/safezone';
import { type LayoutInput, type SlideLayout, ctaLabel, resolveSurface, stackWarnings } from '../common';
import { layoutEditorial } from '../editorial/layout';
import type { Surface } from '../types';
import { babak, bleedBottom, cardPlate, chrome, emit, potretAtas, print, teks } from './cards';
import { type Block, type PlateName, brand, fitBlocks, footer, textBlock, trackedW, wrapPlain } from './plan';
import { type ArsipCtx, LABEL, PLATE, TYPE, labelBlock, labelFont, spec, tilt } from './type';

const PLATED = new Set(['cover', 'card', 'quote', 'end']);

export function layoutArsip(input: LayoutInput): SlideLayout {
  const { slide, deck, variant: v, measurer: m } = input;
  if (!PLATED.has(slide.type) || slide.attrs.verdict) return layoutEditorial(input);
  const warnings: Warning[] = [];
  // `surface=bata` picks the babak plate; any other surface name recolours the story slide.
  const plain = slide.attrs.surface === 'bata' ? { ...slide, attrs: { ...slide.attrs, surface: 'auto' } } : slide;
  const story = resolveSurface(v, plain, false, warnings);
  const photo = input.hasPhoto ? input.photoSize ?? { w: 3, h: 2 } : null;
  const A: ArsipCtx = {
    slide, deck, v, m, photo, credit: slide.attrs.credit ?? photo?.credit ?? '', story: story.surface, ops: [], boxes: [], warnings,
    rng: slideRng(deck.slug, slide.index), serif: v.fonts.serif ?? v.fonts.sans, sans: v.fonts.sans,
    label: v.fonts.label ?? v.fonts.sans, caption: 'Gentium Book Plus',
  };

  let plate: PlateName;
  let stack: StackResult;
  let surface: Surface = story.surface;
  let name = story.name;
  const deep = v.surfaces.deep;
  switch (slide.type) {
    case 'cover': plate = 'sampul'; stack = sampul(A); surface = deep; name = 'deep'; break;
    case 'quote': plate = 'naskah'; ({ stack, surface } = naskah(A)); name = v.quoteSurface ?? 'deep'; break;
    case 'end': plate = 'akhir'; stack = akhir(A); surface = deep; name = 'deep'; break;
    default: {
      plate = cardPlate(A);
      let s: StackResult | null = null;
      if (plate === 'potret-bawah' || plate === 'bentang') {
        s = bleedBottom(A, plate);
        if (!s) {
          A.ops.length = 0;
          A.boxes.length = 0;
          plate = 'potret-atas';
        }
      }
      if (plate === 'babak') ({ stack: s, surface, name } = babak(A));
      else if (plate === 'teks') s = teks(A);
      else if (plate === 'potret-atas') s = potretAtas(A);
      stack = s!;
    }
  }
  warnings.push(...stackWarnings(slide, stack));
  return {
    slide, deck, variant: v, surface, surfaceName: name, onPhoto: false, stack, icon: null, ctaLabel: ctaLabel(slide, deck),
    header: { handle: '', handleFont: { family: A.sans, weight: 600, size: 28 }, right: { kind: 'rule', x1: 0, x2: 0, y: 0, h: 0 } },
    footer: { swipe: null, counter: null }, boxes: A.boxes, warnings, arsip: { plate, ops: A.ops },
  };
}

/** Cover: indigo band, the photo below it, a catalogue card with the region · year tab across the seam. */
function sampul(A: ArsipCtx): StackResult {
  const P = PLATE.sampul;
  const nila = A.v.surfaces.deep;
  const card = A.v.surfaces.lembar!;
  if (A.photo) A.ops.push({ op: 'photo', x: 0, y: P.band, w: CANVAS.w, h: CANVAS.h - P.band });
  brand(A.deck, A.sans, A.m, { ink: nila.ink }, A.ops, A.boxes);
  const x = P.cardX + P.padX;
  const w = P.cardW - P.padX * 2;
  const blocks: Block[] = [textBlock('headline', A.slide.headline, spec(A, TYPE.coverHeadline), 'ink', x, w, 0)];
  if (!isEmptyRich(A.slide.body)) blocks.push(textBlock('subtitle', A.slide.body, spec(A, TYPE.coverSubtitle), 'body', x, w, P.subGap));
  const stack = fitBlocks(blocks, P.cardTop + P.padTop, P.maxBottom - P.padBottom, A.m);
  const kicker = A.slide.attrs.kicker?.toUpperCase();
  if (kicker) {
    // A long region · year label steps down to minSize, then warns like any kicker past SAFE.
    const t = LABEL.tab;
    const x = P.cardX + t.padX;
    let size: number = t.size;
    let tw = trackedW(kicker, labelFont(A, size), t.tracking, A.m);
    while (x + tw > SAFE.right && size > t.minSize) tw = trackedW(kicker, labelFont(A, (size -= 2)), t.tracking, A.m);
    const bata = A.v.surfaces.bata!;
    A.ops.push({ op: 'fill', x: P.cardX, y: P.tabTop, w: tw + t.padX * 2, h: t.h, color: bata.bg });
    A.ops.push({ op: 'label', text: kicker, x, y: P.tabTop + t.baseline, font: labelFont(A, size), color: bata.ink, tracking: t.tracking });
    A.boxes.push({ x, y: P.tabTop + t.baseline - size, w: tw, h: size * 1.25, kind: 'kicker' });
    if (x + tw > SAFE.right) {
      A.warnings.push({ code: 'overflow', slideIndex: A.slide.index, line: A.slide.lines[0], message: `Slide ${A.slide.index + 1}: the kicker is too long, shorten it` });
    }
  }
  A.ops.push({ op: 'fill', x: P.cardX, y: P.cardTop, w: P.cardW, h: stack.bottom + P.padBottom - P.cardTop, color: card.bg, shadow: true });
  emit(A, blocks, stack, card);
  footer(A.slide, A.deck, A, A.m, { credit: A.photo ? A.credit : '', creditColor: nila.muted, folioColor: nila.ink, ...(A.photo ? { chip: nila.bg } : {}) }, A.ops, A.boxes);
  return stack;
}

/** Quote: the photo as a band at the top, the quote on a tilted manuscript sheet, the note in the margin column. */
function naskah(A: ArsipCtx): { stack: StackResult; surface: Surface } {
  const P = PLATE.naskah;
  const s = A.v.surfaces[A.v.quoteSurface ?? 'deep'] ?? A.v.surfaces.deep;
  const sheet = A.v.surfaces.naskah!;
  if (A.photo) A.ops.push({ op: 'photo', x: 0, y: 0, w: CANVAS.w, h: P.band });
  brand(A.deck, A.sans, A.m, { ink: s.ink, ...(A.photo ? { chip: s.bg } : {}) }, A.ops, A.boxes);
  const top = A.photo ? P.topPhoto : P.topPlain;
  const x = P.sheetX + P.padX;
  const w = P.sheetW - P.padX * 2;
  const tag = A.slide.attrs.kicker?.toUpperCase() ?? (A.deck.lang === 'en' ? 'QUOTE' : 'KUTIPAN');
  const blocks: Block[] = [
    labelBlock(A, 'tag', tag, LABEL.tag, x, 0),
    textBlock('quote', A.slide.headline, spec(A, TYPE.quote), 'ink', x, w, P.quoteGap),
  ];
  if (A.slide.attribution) {
    // Sources are never cut short: up to two lines, then "…".
    const a = LABEL.attribution;
    const lines = wrapPlain(`— ${A.slide.attribution}`.toUpperCase(), w, labelFont(A, a.size), A.m, 2, a.tracking);
    lines.forEach((text, i) => blocks.push(labelBlock(A, 'attribution', text, a, x, i ? 0 : P.attrGap)));
  }
  const sheetBody = blocks.length;
  if (!isEmptyRich(A.slide.body)) blocks.push(textBlock('body', A.slide.body, spec(A, TYPE.body), 'body', 288, 624, P.padBottom + P.bodyGap));
  const stack = fitBlocks(blocks, top + P.padTop, ROWS.stackLimit, A.m);
  const sheetBottom = (stack.placed[sheetBody - 1]?.y ?? top) + (stack.placed[sheetBody - 1]?.h ?? 0) + P.padBottom;
  const rot = P.rot * (Math.PI / 180);
  A.ops.push({ op: 'push', cx: P.sheetX + P.sheetW / 2, cy: (top + sheetBottom) / 2, rot });
  A.ops.push({ op: 'fill', x: P.sheetX, y: top, w: P.sheetW, h: sheetBottom - top, color: sheet.bg, shadow: true });
  const inSheet: Block[] = blocks.slice(0, sheetBody);
  emit(A, inSheet, { ...stack, placed: stack.placed.slice(0, sheetBody) }, sheet);
  A.ops.push({ op: 'pop' });
  emit(A, blocks.slice(sheetBody), { ...stack, placed: stack.placed.slice(sheetBody) }, s);
  chrome(A, s, { credit: !!A.photo, folio: s.ink });
  return { stack, surface: s };
}

/** End: the cover photo returns as a tilted print, the ask, and the CTA on a paper plate. */
function akhir(A: ArsipCtx): StackResult {
  const P = PLATE.akhir;
  const s = A.v.surfaces.deep;
  brand(A.deck, A.sans, A.m, { ink: s.ink }, A.ops, A.boxes);
  if (A.photo) print(A, { ...P.print }, tilt(A, P.print.rot));
  const blocks: Block[] = [textBlock('headline', A.slide.headline, spec(A, TYPE.endHeadline), 'ink', SAFE.left, CONTENT_W, 0)];
  if (!isEmptyRich(A.slide.body)) blocks.push(textBlock('body', A.slide.body, spec(A, TYPE.body), 'body', SAFE.left, CONTENT_W, P.bodyGap));
  const cta = ctaLabel(A.slide, A.deck)?.toUpperCase();
  const c = LABEL.cta;
  if (cta) {
    const b = labelBlock(A, 'cta', cta, c, SAFE.left, P.ctaGap);
    blocks.push({ ...b, w: Math.min(CONTENT_W, b.w + c.padX * 2), h: c.h });
  }
  const stack = fitBlocks(blocks, A.photo ? P.topPhoto : P.topPlain, ROWS.stackLimit, A.m);
  const ctaAt = cta ? stack.placed[blocks.length - 1] : undefined;
  emit(A, cta ? blocks.slice(0, -1) : blocks, { ...stack, placed: cta ? stack.placed.slice(0, -1) : stack.placed }, s);
  if (ctaAt && cta) {
    const card = A.v.surfaces.lembar!;
    A.ops.push({ op: 'fill', x: ctaAt.x, y: ctaAt.y, w: ctaAt.w, h: ctaAt.h, color: card.bg });
    const font = labelFont(A, c.size);
    A.ops.push({ op: 'label', text: cta, x: ctaAt.x + c.padX, y: ctaAt.y + ctaAt.h / 2 + c.size * 0.36, font, color: card.accent, tracking: c.tracking });
    A.boxes.push({ x: ctaAt.x, y: ctaAt.y, w: ctaAt.w, h: ctaAt.h, kind: 'cta' });
  }
  chrome(A, s, { credit: !!A.photo, folio: s.ink });
  return stack;
}
