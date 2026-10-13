import type { Ctx, ImageSource } from './ctx';
import { withAlpha } from '../core/color';
import { CANVAS } from './safezone';

export interface CoverRect {
  dx: number;
  dy: number;
  dw: number;
  dh: number;
}

/**
 * Cover crop with focal point (DESIGN §3.6): scale = max(W/iw, H/ih); offset
 * so the focal point lands at the canvas centre, clamped so the image always
 * covers the canvas.
 */
export function coverCrop(iw: number, ih: number, fx: number, fy: number, W = CANVAS.w, H = CANVAS.h): CoverRect {
  const scale = Math.max(W / iw, H / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));
  const dx = clamp(W / 2 - fx * dw, W - dw, 0);
  const dy = clamp(H / 2 - fy * dh, H - dh, 0);
  return { dx, dy, dw, dh };
}

/** Overlay strengths for a darkness value d ∈ [0, 1]. */
export function photoOverlay(d: number): { wash: number; stops: [number, number][] } {
  return {
    wash: 0.10 + 0.35 * d,
    stops: [[0, 0.30 + 0.35 * d], [0.38, 0.06], [0.62, 0.10], [1, 0.48 + 0.35 * d]],
  };
}

export interface PhotoInput {
  image: ImageSource;
  width: number;
  height: number;
  focalX: number;
  focalY: number;
}

/** Draw the photo, the tint wash and the vertical gradient. darkness ∈ [0, 100]. */
export function drawPhoto(ctx: Ctx, photo: PhotoInput, darkness: number, tint: string): void {
  const r = coverCrop(photo.width, photo.height, photo.focalX, photo.focalY);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(photo.image, r.dx, r.dy, r.dw, r.dh);

  const o = photoOverlay(Math.min(1, Math.max(0, darkness / 100)));
  ctx.fillStyle = withAlpha(tint, o.wash);
  ctx.fillRect(0, 0, CANVAS.w, CANVAS.h);

  const g = ctx.createLinearGradient(0, 0, 0, CANVAS.h);
  for (const [at, a] of o.stops) g.addColorStop(at, withAlpha(tint, a));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, CANVAS.w, CANVAS.h);
}
