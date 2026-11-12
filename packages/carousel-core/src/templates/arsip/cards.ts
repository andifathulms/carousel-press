// Card plates (docs/SPEC-arsip.md §5): babak, potret atas/bawah, bentang, teks.
import { isEmptyRich } from '../../core/inline';
import type { StackResult } from '../../layout/stack';
import { CANVAS, CONTENT_W, ROWS, SAFE, UI_ZONES } from '../../render/safezone';
import { centeredShift } from '../common';
import type { Surface } from '../types';
import { type Block, CHROME_A, type PlateName, bottomOf, brand, fitBlocks, footer, marginRule, shift, textBlock } from './plan';
import { type ArsipCtx, LABEL, PLATE, TYPE, labelBlock, labelFont, spec, tilt } from './type';

const COL = CHROME_A.col;

/** Optional kicker, headline and body (in the margin column) as blocks. */
function storyBlocks(A: ArsipCtx, head: keyof typeof TYPE, headW: number, bodyGap: number, bodyMinTop?: number): Block[] {
  const { slide } = A;
  const out: Block[] = [];
  if (slide.attrs.kicker) out.push(labelBlock(A, 'kicker', slide.attrs.kicker.toUpperCase(), LABEL.kicker, SAFE.left, 0));
  out.push(textBlock('headline', slide.headline, spec(A, TYPE[head]), 'ink', SAFE.left, headW, out.length ? 24 : 0));
  if (!isEmptyRich(slide.body)) out.push(textBlock('body', slide.body, spec(A, TYPE.body), 'body', COL.x, COL.w, bodyGap, bodyMinTop));
  return out;
}

/** Paint the fitted blocks: text in the surface's tones, labels in its accent, the margin rule beside the body. */
export function emit(A: ArsipCtx, blocks: readonly Block[], stack: StackResult, s: Surface): void {
  stack.placed.forEach((p, i) => {
    const b = blocks[i]!;
    if ('fixed' in b) {
      const l = b.kind === 'attribution' ? LABEL.attribution : b.kind === 'tag' ? LABEL.tag : LABEL.kicker;
      const color = b.kind === 'attribution' ? s.muted : s.accent;
      A.ops.push({ op: 'label', text: b.label, x: p.x, y: p.y + l.size * 0.92, font: labelFont(A, l.size), color, tracking: l.tracking });
      A.boxes.push({ x: p.x, y: p.y, w: p.w, h: p.h, kind: b.kind });
      return;
    }
    A.ops.push({ op: 'text', p, surface: s });
    A.boxes.push({ x: p.x, y: p.y, w: p.w, h: p.h, kind: b.item.role });
    if (b.item.role === 'body' && b.x === COL.x) marginRule(p, s.accent, A.ops);
  });
}

/** A photo as a print: a paper border and the photo inset, optionally tilted about its centre. */
export function print(A: ArsipCtx, r: { x: number; y: number; w: number; h: number; border: number }, rot: number, bleedRight = false): void {
  const b = r.border;
  if (rot) A.ops.push({ op: 'push', cx: r.x + r.w / 2, cy: r.y + r.h / 2, rot });
  A.ops.push({ op: 'fill', x: r.x, y: r.y, w: r.w, h: r.h, color: A.v.surfaces.kertas!.bg, shadow: true });
  A.ops.push({ op: 'photo', x: r.x + b, y: r.y + b, w: r.w - b - (bleedRight ? 0 : b), h: r.h - b * 2 });
  if (rot) A.ops.push({ op: 'pop' });
}

/** Credit + folio. The folio is in the accent on story surfaces, in the ink on brick. */
export function chrome(A: ArsipCtx, s: Surface, opts: { credit: boolean; chip?: string; folio?: string } = { credit: true }): void {
  footer(A.slide, A.deck, A, A.m, {
    credit: opts.credit ? A.credit : '', creditColor: s.muted, folioColor: opts.folio ?? s.accent, ...(opts.chip ? { chip: opts.chip } : {}),
  }, A.ops, A.boxes);
}

/** Hook moment and the turn: brick surface, statement headline, the photo as a print. */
export function babak(A: ArsipCtx): { stack: StackResult; surface: Surface; name: string } {
  const s = A.v.surfaces.bata!;
  const P = PLATE.babak;
  brand(A.deck, A.sans, A.m, { ink: s.ink }, A.ops, A.boxes);
  const portrait = !!A.photo && A.photo.h / A.photo.w >= 1.1;
  let stack: StackResult;
  if (portrait) {
    const blocks = storyBlocks(A, 'narrowHeadline', P.headW, P.bodyGap, P.print.y + P.print.h + P.bodyGap);
    stack = fitBlocks(blocks, PLATE.top, ROWS.stackLimit, A.m);
    print(A, { ...P.print }, tilt(A, P.print.rot));
    emit(A, blocks, stack, s);
  } else {
    const blocks = storyBlocks(A, 'bigHeadline', CONTENT_W, P.gap);
    stack = fitBlocks(blocks, PLATE.top, ROWS.stackLimit, A.m);
    // The print bleeds off the right and bottom (into the caption zone) when at least landMin of it shows above it.
    const y = stack.bottom + P.landGap;
    const shown = !!A.photo && UI_ZONES.caption.y - y >= P.landMin;
    if (shown) print(A, { x: SAFE.left, y, w: CANVAS.w - SAFE.left, h: CANVAS.h - y, border: P.print.border }, 0, true);
    else if (!stack.overflow) shift(stack, centeredShift(PLATE.top, stack.bottom, PLATE.top));
    emit(A, blocks, stack, s);
    chrome(A, s, { credit: shown, folio: s.ink, ...(shown ? { chip: s.bg } : {}) });
    return { stack, surface: s, name: 'bata' };
  }
  chrome(A, s, { credit: true, folio: s.ink });
  return { stack, surface: s, name: 'bata' };
}

/**
 * Photo bleeding off the top (portraits: top-right; landscapes: full width, handle on a chip);
 * the headline on a plate bites its bottom-left corner.
 */
export function potretAtas(A: ArsipCtx): StackResult {
  const s = A.story;
  const P = PLATE.atas;
  const wide = !!A.photo && A.photo.h / A.photo.w < 1.1;
  const right = brand(A.deck, A.sans, A.m, { ink: s.accent }, [], []);
  const left = wide ? 0 : Math.max(P.photoLeft, right + P.brandGap);
  const blocks = storyBlocks(A, 'headline', P.headW, P.bodyGap);
  let ph: number = P.maxH;
  let stack = fitBlocks(blocks, ph - P.headOverlap, ROWS.stackLimit, A.m, false);
  if (stack.bottom > ROWS.stackLimit) {
    const dy = stack.bottom - ROWS.stackLimit;
    if (ph - dy >= P.minH) {
      ph -= dy;
      stack = fitBlocks(blocks, ph - P.headOverlap, ROWS.stackLimit, A.m, false);
    } else {
      ph = P.minH;
      stack = fitBlocks(blocks, ph - P.headOverlap, ROWS.stackLimit, A.m);
    }
  }
  A.ops.push({ op: 'photo', x: left, y: 0, w: CANVAS.w - left, h: ph });
  const [pt, pr, pb, pl] = P.platePad;
  const heads = stack.placed.filter((p) => p.item.kind !== 'text' || p.item.role === 'headline');
  const headW = Math.max(...heads.map((p) => p.w));
  const headBottom = bottomOf(stack, 'headline');
  const plateTop = (stack.placed[0]?.y ?? ph) - pt;
  A.ops.push({ op: 'fill', x: P.plateX, y: plateTop, w: pl + headW + pr, h: headBottom + pb - plateTop, color: s.bg });
  brand(A.deck, A.sans, A.m, wide ? { ink: s.accent, chip: s.bg } : { ink: s.accent }, A.ops, A.boxes);
  emit(A, blocks, stack, s);
  chrome(A, s);
  return stack;
}

/** Text first, then the photo bleeding off the bottom (and right, for portraits) into TikTok's caption zone. */
export function bleedBottom(A: ArsipCtx, plate: 'potret-bawah' | 'bentang'): StackResult | null {
  const s = A.story;
  const P = plate === 'bentang' ? PLATE.bentang : PLATE.bawah;
  const blocks = storyBlocks(A, 'headline', CONTENT_W, PLATE.bawah.bodyGap);
  const stack = fitBlocks(blocks, PLATE.top, ROWS.stackLimit, A.m, false);
  const top = Math.max(stack.bottom + P.photoGap, P.minTop);
  if (top > P.maxTop) return null;
  const x = plate === 'bentang' ? 0 : PLATE.bawah.photoLeft;
  A.ops.push({ op: 'photo', x, y: top, w: CANVAS.w - x, h: CANVAS.h - top });
  brand(A.deck, A.sans, A.m, { ink: s.accent }, A.ops, A.boxes);
  emit(A, blocks, stack, s);
  chrome(A, s, { credit: true, chip: s.bg });
  return stack;
}

/** No photo: big headline and the body column, centred in the band. */
export function teks(A: ArsipCtx): StackResult {
  const s = A.story;
  brand(A.deck, A.sans, A.m, { ink: s.accent }, A.ops, A.boxes);
  const blocks = storyBlocks(A, 'bigHeadline', CONTENT_W, PLATE.teks.bodyGap);
  const stack = fitBlocks(blocks, PLATE.top, ROWS.stackLimit, A.m);
  if (!stack.overflow) shift(stack, centeredShift(PLATE.top, stack.bottom, PLATE.top));
  emit(A, blocks, stack, s);
  chrome(A, s, { credit: !!A.slide.attrs.credit });
  return stack;
}

/** Which card plate a slide gets (SPEC-arsip §6). */
export function cardPlate(A: ArsipCtx): PlateName {
  const { slide, photo } = A;
  if (slide.attrs.layout) return slide.attrs.layout;
  if (slide.attrs.surface === 'bata') return 'babak';
  if (slide.contentIndex === 0) return 'babak';
  if (!photo) return 'teks';
  // Alternate top and bottom bleeds so no plate runs three slides in a row (SPEC-arsip §6).
  const top = slide.contentIndex % 2 === 1;
  if (photo.h / photo.w < 1.1) return top ? 'potret-atas' : 'bentang';
  return top ? 'potret-atas' : 'potret-bawah';
}
