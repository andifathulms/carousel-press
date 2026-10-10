import type { Ctx } from './ctx';
import { type FontSpec, fontString } from '../layout/measure';
import { PILL, type TextStyle, type WrappedLine, baselines, monoFont } from '../layout/wrap';

export interface TextColors {
  text: string;
  accent: string;
  codeBg: string;
  codeText: string;
}

/** Soft shadow for text on photos (DESIGN §3.5). */
export const PHOTO_SHADOW = { color: 'rgba(0,0,0,0.35)', blur: 24, offsetX: 0, offsetY: 2 };

export function setShadow(ctx: Ctx, on: boolean): void {
  ctx.shadowColor = on ? PHOTO_SHADOW.color : 'transparent';
  ctx.shadowBlur = on ? PHOTO_SHADOW.blur : 0;
  ctx.shadowOffsetX = on ? PHOTO_SHADOW.offsetX : 0;
  ctx.shadowOffsetY = on ? PHOTO_SHADOW.offsetY : 0;
}

export function setFont(ctx: Ctx, f: FontSpec): void {
  ctx.font = fontString(f);
  ctx.textBaseline = 'alphabetic';
}

/** Draw text glyph by glyph with extra tracking (no ctx.letterSpacing). Returns the advance. */
export function drawTracked(ctx: Ctx, text: string, x: number, y: number, trackingPx: number): number {
  let cx = x;
  const chars = Array.from(text);
  chars.forEach((ch, i) => {
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width + (i < chars.length - 1 ? trackingPx : 0);
  });
  return cx - x;
}

/** Width of tracked text in the current font. */
export function trackedWidth(ctx: Ctx, text: string, trackingPx: number): number {
  const chars = Array.from(text);
  return chars.reduce((w, ch) => w + ctx.measureText(ch).width, 0) + Math.max(0, chars.length - 1) * trackingPx;
}

/** Draw wrapped rich lines with their top at `top`. With `centerW`, each line is centred in [x, x + centerW]. */
export function drawWrapped(
  ctx: Ctx, lines: readonly WrappedLine[], x0: number, top: number, size: number, lh: number,
  style: TextStyle, colors: TextColors, centerW?: number,
): void {
  const ys = baselines(lines, top, size, lh);
  const mono = monoFont(style);
  lines.forEach((line, i) => {
    const y = ys[i]!;
    const x = centerW === undefined ? x0 : x0 + (centerW - line.width) / 2;
    for (const run of line.runs) {
      if (run.style === 'code') {
        const shadow = ctx.shadowColor;
        ctx.save();
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = colors.codeBg;
        ctx.beginPath();
        const h = mono.size + PILL.padY * 2;
        ctx.roundRect(x + run.x, y - mono.size * 0.78 - PILL.padY, run.w, h, PILL.radius);
        ctx.fill();
        ctx.restore();
        ctx.shadowColor = shadow;
        setFont(ctx, mono);
        ctx.fillStyle = colors.codeText;
        ctx.fillText(run.text, x + run.x + PILL.padX, y);
        continue;
      }
      setFont(ctx, style.font);
      ctx.fillStyle = run.style === 'accent' ? colors.accent : colors.text;
      ctx.fillText(run.text, x + run.x, y);
    }
  });
}

/** Truncate with "…" in the current font so the text fits maxWidth. */
export function truncateToWidth(ctx: Ctx, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  const chars = Array.from(text);
  while (chars.length && ctx.measureText(chars.join('') + '…').width > maxWidth) chars.pop();
  return chars.join('') + '…';
}
