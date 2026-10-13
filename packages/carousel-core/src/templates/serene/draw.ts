import type { Ctx } from '../../render/ctx';
import { withAlpha } from '../../core/color';
import { CANVAS } from '../../render/safezone';
import { drawStar } from '../../render/lexDraw';
import { setShadow } from '../../render/text';
import type { SlideLayout } from '../common';
import { drawEditorial } from '../editorial/draw';
import { AYAH } from './arabicLayout';

/** Serene decoration (SPEC-ayah §4). Decorative only: nothing here carries meaning. */
export const SERENE_DECO = {
  frame: { inset: 40, width: 2, alpha: 0.35, radius: 24 },
};

function drawFrame(ctx: Ctx, L: SlideLayout): void {
  const f = SERENE_DECO.frame;
  setShadow(ctx, false);
  ctx.strokeStyle = withAlpha(L.surface.accent, f.alpha);
  ctx.lineWidth = f.width;
  ctx.beginPath();
  ctx.roundRect(f.inset, f.inset, CANVAS.w - f.inset * 2, CANVAS.h - f.inset * 2, f.radius);
  ctx.stroke();
}

/** The end slide carries the same star ornament as the ayah slide, centred above its stack. */
function drawEndStar(ctx: Ctx, L: SlideLayout): void {
  const first = L.stack.placed[0];
  if (L.slide.type !== 'end' || !first) return;
  const s = AYAH.star;
  drawStar(ctx, CANVAS.w / 2, first.y - s.gap - s.size / 2, s.size, withAlpha(L.surface.accent, s.alpha), s.width);
}

export function drawSerene(ctx: Ctx, L: SlideLayout): void {
  if (L.variant.deco.frame) drawFrame(ctx, L);
  drawEndStar(ctx, L);
  drawEditorial(ctx, L);
}
