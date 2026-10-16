import type { Ctx } from './ctx';
import type { LexEl } from '../templates/lexicon/lexLayout';
import type { SlideLayout } from '../templates/common';
import { baselines } from '../layout/wrap';
import { drawIcon } from './icons';
import { drawTracked, drawWrapped, setFont, setShadow } from './text';
import { ARABIC } from '../templates/lexicon/lexScript';
import { HAN } from '../templates/lexicon/lexHanText';

/** 田字格 practice box (SPEC-script §10.2): 2 px border, dashed 1 px centre cross. */
export const TIANZIGE = { border: 2, cross: 1, dash: [8, 6] as [number, number] };

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
    { text: e.color, accent: e.highlight ? e.color : e.accent, codeBg: 'rgba(127,127,127,0.18)', codeText: e.color }, e.centerW);
  if (e.strike) {
    setShadow(ctx, false);
    ctx.fillStyle = e.color;
    const ys = baselines(e.lines, e.y, e.size, e.lh);
    e.lines.forEach((line, i) => ctx.fillRect(e.x, ys[i]! - e.size * STRIKE.rise - STRIKE.w / 2, line.width, STRIKE.w));
  }
}

/** Arabic lines, right-to-left and verbatim; the end-of-ayah mark sits left of the last line in the accent colour. */
function drawArabic(ctx: Ctx, e: Extract<LexEl, { k: 'arabic' }>, onPhoto: boolean): void {
  const rightOf = (i: number): number => {
    const markW = e.mark && i === e.lines.length - 1 ? e.mark.gap + e.mark.w : 0;
    const full = e.widths[i]! + markW;
    return e.align === 'center' ? e.x + (e.w + full) / 2 : e.x + e.w;
  };
  // Highlight behind whole words, mirrored from the logical prefix (SPEC-script §4).
  if (e.marks?.length && e.highlight) {
    setShadow(ctx, false);
    ctx.fillStyle = e.highlight;
    const M = ARABIC.marker;
    for (const mk of e.marks) {
      const base = e.y + mk.line * e.size * e.lh + e.size * e.baseline;
      ctx.beginPath();
      ctx.roundRect(rightOf(mk.line) - mk.from - mk.w - M.padX, base - e.size * M.rise, mk.w + M.padX * 2, e.size * M.h, M.radius);
      ctx.fill();
    }
  }
  setShadow(ctx, onPhoto);
  setFont(ctx, { family: e.family, weight: e.weight ?? 400, size: e.size, ...(e.fallback ? { fallback: e.fallback } : {}) });
  ctx.direction = 'rtl';
  e.lines.forEach((line, i) => {
    const last = i === e.lines.length - 1;
    const markW = e.mark && last ? e.mark.gap + e.mark.w : 0;
    const full = e.widths[i]! + markW;
    const right = rightOf(i);
    const y = e.y + i * e.size * e.lh + e.size * e.baseline;
    ctx.textAlign = 'right';
    ctx.fillStyle = e.color;
    ctx.fillText(line, right, y);
    if (e.mark && last) {
      ctx.textAlign = 'left';
      ctx.fillStyle = e.mark.color;
      ctx.fillText(e.mark.text, right - full, y);
    }
    // Strike at 0.45 × the line box, so the lower harakat stay visible (SPEC-script §7.4).
    if (e.strike) {
      ctx.fillStyle = e.strike;
      ctx.fillRect(right - e.widths[i]!, e.y + i * e.size * e.lh + e.size * e.lh * ARABIC.strike.at - ARABIC.strike.w / 2, e.widths[i]!, ARABIC.strike.w);
    }
  });
  ctx.direction = 'ltr';
  ctx.textAlign = 'left';
}

/** Hanzi lines, left-aligned; per unit when units carry tone colours (SPEC-script §5.4). */
function drawHan(ctx: Ctx, e: Extract<LexEl, { k: 'han' }>, onPhoto: boolean): void {
  if (e.marks?.length && e.highlight) {
    setShadow(ctx, false);
    ctx.fillStyle = e.highlight;
    const M = HAN.marker;
    for (const mk of e.marks) {
      const base = e.y + mk.line * e.size * e.lh + e.size * e.baseline;
      ctx.beginPath();
      ctx.roundRect(e.x + mk.from - M.padX, base - e.size * M.rise, mk.w + M.padX * 2, e.size * M.h, M.radius);
      ctx.fill();
    }
  }
  setShadow(ctx, onPhoto);
  setFont(ctx, { family: e.family, weight: e.weight, size: e.size, fallback: e.fallback });
  e.lines.forEach((line, i) => {
    const y = e.y + i * e.size * e.lh + e.size * e.baseline;
    const colors = e.colors?.[i];
    if (colors && e.units && e.offs) {
      e.units[i]!.forEach((u, k) => {
        ctx.fillStyle = colors[k] ?? e.color;
        ctx.fillText(u, e.x + e.offs![i]![k]!, y);
      });
    } else {
      ctx.fillStyle = e.color;
      ctx.fillText(line, e.x, y);
    }
    if (e.strike) {
      ctx.fillStyle = e.strike;
      ctx.fillRect(e.x, e.y + i * e.size * e.lh + e.size * e.lh * HAN.strike.at - HAN.strike.w / 2, e.widths[i]!, HAN.strike.w);
    }
  });
}

function drawTianzige(ctx: Ctx, e: Extract<LexEl, { k: 'tianzige' }>): void {
  setShadow(ctx, false);
  const T = TIANZIGE;
  ctx.strokeStyle = e.color;
  ctx.lineWidth = T.border;
  ctx.strokeRect(e.x + T.border / 2, e.y + T.border / 2, e.size - T.border, e.size - T.border);
  ctx.lineWidth = T.cross;
  ctx.setLineDash(T.dash);
  ctx.beginPath();
  ctx.moveTo(e.x + e.size / 2, e.y + T.border);
  ctx.lineTo(e.x + e.size / 2, e.y + e.size - T.border);
  ctx.moveTo(e.x + T.border, e.y + e.size / 2);
  ctx.lineTo(e.x + e.size - T.border, e.y + e.size / 2);
  ctx.stroke();
  ctx.setLineDash([]);
}

/** One line of mixed scripts: each segment in its face, Arabic segments right-to-left (SPEC-script §6.2). */
function drawMixed(ctx: Ctx, e: Extract<LexEl, { k: 'mixed' }>, onPhoto: boolean): void {
  setShadow(ctx, onPhoto);
  const y = e.y + e.baseline;
  for (const s of e.segs) {
    setFont(ctx, s.font);
    ctx.fillStyle = s.color;
    ctx.direction = s.rtl ? 'rtl' : 'ltr';
    ctx.textAlign = s.rtl ? 'right' : 'left';
    ctx.fillText(s.text, s.rtl ? e.x + s.dx + s.w : e.x + s.dx, y);
  }
  ctx.direction = 'ltr';
  ctx.textAlign = 'left';
}

/** Original 8-point star: two squares, one turned 45° (SPEC-ayah §4). */
export function drawStar(ctx: Ctx, cx: number, cy: number, size: number, color: string, width: number): void {
  setShadow(ctx, false);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineJoin = 'miter';
  const r = size / 2;
  for (const turn of [0, Math.PI / 4]) {
    ctx.beginPath();
    for (let k = 0; k < 4; k++) {
      const a = turn + (k * Math.PI) / 2;
      const px = cx + r * Math.cos(a);
      const py = cy + r * Math.sin(a);
      if (k === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
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
      case 'arabic':
        drawArabic(ctx, e, L.onPhoto);
        break;
      case 'mixed':
        drawMixed(ctx, e, L.onPhoto);
        break;
      case 'han':
        drawHan(ctx, e, L.onPhoto);
        break;
      case 'tianzige':
        drawTianzige(ctx, e);
        break;
      case 'star':
        drawStar(ctx, e.cx, e.cy, e.size, e.color, e.width);
        break;
    }
  }
  ctx.restore();
}
