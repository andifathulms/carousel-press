import type { Ctx } from './ctx';
import type { Deck, Slide, Warning } from '../core/types';
import type { PoolIcon } from '../core/iconNames';
import { resolveIcons } from '../core/iconNames';
import { type TextMeasurer, createCanvasMeasurer } from '../layout/measure';
import type { SlideLayout } from '../templates/common';
import { getFamily } from '../templates/registry';
import type { Variant } from '../templates/types';
import { type PhotoInput, drawPhoto } from './photo';
import { type Box, CANVAS, CONTENT_W, ROWS, SAFE } from './safezone';

export interface RenderAssets {
  photo: PhotoInput | null;
  /** 0–100 */
  darkness: number;
  icon: PoolIcon | null;
  /** Preview only: outline overflowing slides in red. Never set for export. */
  preview?: boolean;
}

export interface RenderResult {
  warnings: Warning[];
  boxes: Box[];
  overflow: boolean;
  layout: SlideLayout;
}

/** Overflow outline drawn in the preview only. */
export const OVERFLOW_OUTLINE = { color: '#FF3B30', width: 6, dash: [18, 12] };

/** Pure layout of one slide (no drawing). */
export function layoutSlide(
  slide: Slide, deck: Deck, variant: Variant, measurer: TextMeasurer, icon: PoolIcon | null, hasPhoto: boolean,
): SlideLayout {
  return getFamily(variant.family).layout({ slide, deck, variant, icon, hasPhoto, measurer });
}

/** Icons for every slide of a deck under a variant's family. */
export function deckIcons(deck: Deck, variant: Variant): (PoolIcon | null)[] {
  return resolveIcons(deck.slides, deck.slug, variant.family);
}

/**
 * The one render path: draws a slide onto any 1080×1920 context. Preview and
 * export both call this, on different canvases.
 */
export function renderSlide(ctx: Ctx, slide: Slide, deck: Deck, variant: Variant, assets: RenderAssets): RenderResult {
  const measurer = createCanvasMeasurer(ctx);
  const L = layoutSlide(slide, deck, variant, measurer, assets.icon, !!assets.photo);

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  ctx.fillStyle = L.onPhoto ? variant.onPhoto.tint : L.surface.bg;
  ctx.fillRect(0, 0, CANVAS.w, CANVAS.h);
  if (assets.photo) drawPhoto(ctx, assets.photo, assets.darkness, variant.onPhoto.tint);

  getFamily(variant.family).draw(ctx, L);

  if (assets.preview && L.stack.overflow) {
    const top = L.stack.placed[0]?.y ?? ROWS.stackTopCard;
    ctx.setLineDash(OVERFLOW_OUTLINE.dash);
    ctx.strokeStyle = OVERFLOW_OUTLINE.color;
    ctx.lineWidth = OVERFLOW_OUTLINE.width;
    ctx.strokeRect(SAFE.left, top, CONTENT_W, ROWS.stackLimit - top);
    ctx.setLineDash([]);
  }
  ctx.restore();

  return { warnings: L.warnings, boxes: L.boxes, overflow: L.stack.overflow, layout: L };
}
