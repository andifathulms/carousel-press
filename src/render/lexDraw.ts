import type { Ctx } from './ctx';
import type { LexEl } from '../templates/lexicon/lexLayout';
import type { SlideLayout } from '../templates/common';
import { baselines } from '../layout/wrap';
import { drawIcon } from './icons';
import { drawTracked, drawWrapped, setFont, setShadow } from './text';

/** Marker behind `*word*` (SPEC-lexicon §4.1): 6 px side padding, 0.62 × size tall, radius 6. */
export const MARKER = { padX: 6, h: 0.62, rise: 0.5, radius: 6 };
/** Strike line through wrong text: 3 px through each line's middle. */
export const STRIKE = { w: 3, rise: 0.32 };

function drawText(ctx: Ctx, e: Extract<LexEl, { k: 'text' }>, onPhoto: boolean): void {
  if (e.highlight) {
    setShadow(ctx, false);
    ctx.fillStyle = e.highlight;
    const ys = baselines(e.lines, e.y, e.size, e.lh);
    e.lines.forEach((line, i) => {
      for (const r of line.runs) {
        if (r.style !== 'accent') continue;
        ctx.beginPath();
        ctx.roundRect(e.x + r.x - MARKER.padX, ys[i]! - e.size * MARKER.rise, r.w + MARKER.padX * 2, e.size * MARKER.h, MARKER.radius);
        ctx.fill();
      }
    });
  }
  setShadow(ctx, onPhoto && !e.highlight);
  drawWrapped(ctx, e.lines, e.x, e.y, e.size, e.lh, e.style,
    { text: e.color, accent: e.highlight ? e.color : e.accent, codeBg: 'rgba(127,127,127,0.18)', codeText: e.color });
  if (e.strike) {
    setShadow(ctx, false);
    ctx.fillStyle = e.color;
    const ys = baselines(e.lines, e.y, e.size, e.lh);
    e.lines.forEach((line, i) => ctx.fillRect(e.x, ys[i]! - e.size * STRIKE.rise - STRIKE.w / 2, line.width, STRIKE.w));
  }
}

/** Draw word/table/compare elements. Header, footer and background are drawn by the family. */
export function drawLex(ctx: Ctx, L: SlideLayout): void {
  if (!L.lex) return;
  ctx.save();
  for (const e of L.lex.els) {
    switch (e.k) {
      case 'text':
        drawText(ctx, e, L.onPhoto);
        break;
      case 'label':
        setShadow(ctx, L.onPhoto);
        setFont(ctx, e.font);
        ctx.fillStyle = e.color;
        drawTracked(ctx, e.text, e.x, e.y + e.font.size * 1.3 * 0.78, e.tracking);
        break;
      case 'pill':
        setShadow(ctx, false);
        ctx.strokeStyle = e.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(e.x + 1, e.y + 1, e.w - 2, e.h - 2, e.h / 2);
        ctx.stroke();
        setFont(ctx, e.font);
        ctx.fillStyle = e.color;
        drawTracked(ctx, e.text, e.x + e.padX, e.y + e.h / 2 + e.font.size * 0.36, e.tracking);
        break;
      case 'badge':
        setShadow(ctx, false);
        ctx.fillStyle = e.bg;
        ctx.beginPath();
        ctx.roundRect(e.x, e.y, e.w, e.h, e.radius);
        ctx.fill();
        setFont(ctx, e.font);
        ctx.fillStyle = e.ink;
        ctx.textAlign = 'center';
        ctx.fillText(e.text, e.x + e.w / 2, e.y + e.h / 2 + e.font.size * 0.36);
        ctx.textAlign = 'left';
        break;
      case 'rect':
        setShadow(ctx, false);
        ctx.fillStyle = e.fill;
        ctx.beginPath();
        if (e.radius) ctx.roundRect(e.x, e.y, e.w, e.h, e.radius);
        else ctx.rect(e.x, e.y, e.w, e.h);
        ctx.fill();
        break;
      case 'frame':
        setShadow(ctx, false);
        ctx.strokeStyle = e.stroke;
        ctx.lineWidth = e.width;
        ctx.beginPath();
        ctx.roundRect(e.x + e.width / 2, e.y + e.width / 2, e.w - e.width, e.h - e.width, e.radius);
        ctx.stroke();
        break;
      case 'clip':
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(e.x, e.y, e.w, e.h, e.radius);
        ctx.clip();
        break;
      case 'unclip':
        ctx.restore();
        break;
      case 'icon':
        setShadow(ctx, false);
        drawIcon(ctx, e.name, e.x, e.y, e.size, e.color);
        break;
    }
  }
  ctx.restore();
}
