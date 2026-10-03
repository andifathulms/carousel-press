import type { Ctx } from './ctx';
import { withAlpha } from '../core/color';
import { CANVAS } from './safezone';
import { setFont } from './text';

/** DESIGN §6.1 decoration constants. */
export const DECO = {
  dotGrid: { spacing: 48, r: 2 },
  glow: { x: 980, y: 260, r: 520 },
  scanlines: { every: 6, h: 2, color: 'rgba(0,0,0,0.18)' },
  bigGlyph: { size: 560, weight: 700, alpha: 0.05, right: 1140, baseline: 1980 },
};

export function drawDotGrid(ctx: Ctx, color: string): void {
  const { spacing, r } = DECO.dotGrid;
  ctx.fillStyle = color;
  for (let y = spacing / 2; y < CANVAS.h; y += spacing) {
    for (let x = spacing / 2; x < CANVAS.w; x += spacing) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

export function drawGlow(ctx: Ctx, accent: string, alpha: number): void {
  const { x, y, r } = DECO.glow;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, withAlpha(accent, alpha));
  g.addColorStop(1, withAlpha(accent, 0));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, CANVAS.w, CANVAS.h);
}

export function drawScanlines(ctx: Ctx): void {
  const { every, h, color } = DECO.scanlines;
  ctx.fillStyle = color;
  for (let y = 0; y < CANVAS.h; y += every) ctx.fillRect(0, y, CANVAS.w, h);
}

/** Big faint glyph bleeding off the bottom-right. */
export function drawBigGlyph(ctx: Ctx, glyph: string, mono: string, ink: string): void {
  const g = DECO.bigGlyph;
  setFont(ctx, { family: mono, weight: g.weight, size: g.size });
  ctx.fillStyle = withAlpha(ink, g.alpha);
  ctx.textAlign = 'right';
  ctx.fillText(glyph, g.right, g.baseline);
  ctx.textAlign = 'left';
}
