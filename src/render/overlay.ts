import type { Ctx } from './ctx';
import { CANVAS, GRID, SAFE, UI_ZONES } from './safezone';
import { setFont } from './text';

/** DESIGN §2.1–2.2 */
export const OVERLAY = {
  zoneFill: 'rgba(255, 64, 64, 0.22)',
  labelColor: 'rgba(255,255,255,0.85)',
  labelSize: 28,
  labelPad: 16,
  safeStroke: '#FF4040',
  safeWidth: 3,
  safeDash: [16, 12],
  test: { bg: '#FFFFFF', grid: 40, gridColor: '#E5E5E5', major: 200, majorColor: '#B0B0B0', label: '#555555' },
  baseline: 'rgba(80,160,255,0.22)',
};

const LABEL_FONT = { family: 'Inter', weight: 600, size: OVERLAY.labelSize };

/** Translucent UI zones + dashed SAFE outline. Preview/test image only, never in exports. */
export function drawSafeOverlay(ctx: Ctx): void {
  ctx.save();
  for (const [name, z] of Object.entries(UI_ZONES)) {
    ctx.fillStyle = OVERLAY.zoneFill;
    ctx.fillRect(z.x, z.y, z.w, z.h);
    setFont(ctx, LABEL_FONT);
    ctx.fillStyle = OVERLAY.labelColor;
    ctx.fillText(name, z.x + OVERLAY.labelPad, z.y + OVERLAY.labelPad + OVERLAY.labelSize);
  }
  drawSafeOutline(ctx);
  ctx.restore();
}

export function drawSafeOutline(ctx: Ctx): void {
  ctx.save();
  ctx.setLineDash(OVERLAY.safeDash);
  ctx.strokeStyle = OVERLAY.safeStroke;
  ctx.lineWidth = OVERLAY.safeWidth;
  ctx.strokeRect(SAFE.left, SAFE.top, SAFE.right - SAFE.left, SAFE.bottom - SAFE.top);
  ctx.restore();
}

/** 8 px baseline grid (debug toggle). */
export function drawBaselineGrid(ctx: Ctx): void {
  ctx.save();
  ctx.fillStyle = OVERLAY.baseline;
  for (let y = 0; y < CANVAS.h; y += GRID) ctx.fillRect(0, y, CANVAS.w, y % (GRID * 8) === 0 ? 2 : 1);
  ctx.restore();
}

/** The safe-zone test image the owner posts privately to check margins on a phone. */
export function drawTestImage(ctx: Ctx): void {
  const T = OVERLAY.test;
  ctx.save();
  ctx.fillStyle = T.bg;
  ctx.fillRect(0, 0, CANVAS.w, CANVAS.h);
  for (let x = 0; x <= CANVAS.w; x += T.grid) {
    ctx.fillStyle = x % T.major === 0 ? T.majorColor : T.gridColor;
    ctx.fillRect(x, 0, 1, CANVAS.h);
  }
  for (let y = 0; y <= CANVAS.h; y += T.grid) {
    ctx.fillStyle = y % T.major === 0 ? T.majorColor : T.gridColor;
    ctx.fillRect(0, y, CANVAS.w, 1);
  }
  setFont(ctx, { family: 'JetBrains Mono', weight: 500, size: 20 });
  ctx.fillStyle = T.label;
  for (let x = T.major; x < CANVAS.w; x += T.major) ctx.fillText(String(x), x + 6, 200 + 24);
  for (let y = T.major; y < CANVAS.h; y += T.major) ctx.fillText(String(y), 400 + 6, y - 6);
  drawSafeOverlay(ctx);

  setFont(ctx, { family: 'Inter', weight: 600, size: 30 });
  ctx.fillStyle = '#16181D';
  ctx.textAlign = 'center';
  const cx = (SAFE.left + SAFE.right) / 2;
  ctx.fillText('Carousel Press safe-zone test', cx, CANVAS.h / 2 - 22);
  setFont(ctx, { family: 'Inter', weight: 400, size: 26 });
  ctx.fillText('post privately and check on your phone', cx, CANVAS.h / 2 + 22);
  ctx.textAlign = 'left';
  ctx.restore();
}
