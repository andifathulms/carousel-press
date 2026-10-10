import type { Ctx } from './ctx';
import type { Placed } from '../layout/stack';
import { CHROME, type SlideLayout } from '../templates/common';
import type { Surface } from '../templates/types';
import { drawIcon } from './icons';
import { CANVAS, ROWS, SAFE } from './safezone';
import { drawWrapped, setFont, setShadow } from './text';

/** Handle (left) and rule / path tag (right). */
export function drawHeader(ctx: Ctx, L: SlideLayout, handleColor: string, rightColor: string): void {
  const { header } = L;
  setShadow(ctx, L.onPhoto);
  if (header.handle) {
    setFont(ctx, header.handleFont);
    ctx.fillStyle = handleColor;
    ctx.fillText(header.handle, SAFE.left, ROWS.headerBaseline);
  }
  const r = header.right;
  ctx.fillStyle = rightColor;
  if (r.kind === 'rule') {
    ctx.fillRect(r.x1, r.y, r.x2 - r.x1, r.h);
  } else {
    setFont(ctx, r.font);
    ctx.textAlign = 'right';
    ctx.fillText(r.text, SAFE.right, ROWS.headerBaseline);
    ctx.textAlign = 'left';
  }
}

/** Swipe hint (left, arrow drawn as an icon) and tabular counter (right). */
export function drawFooter(ctx: Ctx, L: SlideLayout, swipeColor: string, counterColor: string): void {
  const y = ROWS.footerBaseline;
  setShadow(ctx, L.onPhoto);
  const sw = L.footer.swipe;
  if (sw) {
    let x = SAFE.left;
    const iconTop = (size: number): number => y - sw.font.size * 0.36 - size / 2;
    if (sw.leadIcon) {
      drawIcon(ctx, sw.leadIcon, x, iconTop(CHROME.circleArrowSize), CHROME.circleArrowSize, swipeColor);
      x += CHROME.circleArrowSize + CHROME.circleArrowGap;
    }
    setFont(ctx, sw.font);
    ctx.fillStyle = swipeColor;
    ctx.fillText(sw.text, x, y);
    x += ctx.measureText(sw.text).width;
    if (sw.arrow) drawIcon(ctx, 'arrow-right', x + CHROME.arrowGap, iconTop(CHROME.arrowSize), CHROME.arrowSize, swipeColor);
  }
  const c = L.footer.counter;
  if (!c) return;
  setFont(ctx, c.font);
  ctx.fillStyle = counterColor;
  ctx.textAlign = 'right';
  ctx.fillText(c.text, SAFE.right, y);
  ctx.textAlign = 'left';
}

/** CTA pill: bookmark icon + label (DESIGN §3.8). */
export function drawCta(ctx: Ctx, p: Placed, label: string, s: Surface, sans: string): void {
  const c = CHROME.cta;
  ctx.save();
  setShadow(ctx, false);
  ctx.fillStyle = s.badgeBg;
  ctx.beginPath();
  ctx.roundRect(p.x, p.y, p.w, c.h, c.radius);
  ctx.fill();
  const cy = p.y + c.h / 2;
  drawIcon(ctx, 'bookmark', p.x + c.padX, cy - c.icon / 2, c.icon, s.badgeInk);
  setFont(ctx, { family: sans, weight: c.weight, size: c.size });
  ctx.fillStyle = s.badgeInk;
  ctx.fillText(label, p.x + c.padX + c.icon + c.gap, cy + c.size * 0.35);
  ctx.restore();
}

/** A placed text block in its tone colour. */
export function drawTextBlock(ctx: Ctx, p: Placed, s: Surface, onPhoto: boolean): void {
  if (p.item.kind !== 'text' || !p.wrap) return;
  const it = p.item;
  setShadow(ctx, onPhoto);
  drawWrapped(ctx, p.wrap.lines, p.x, p.y, p.size, it.spec.lh,
    { font: { family: it.spec.family, weight: it.spec.weight, size: p.size }, mono: it.spec.mono },
    { text: s[it.tone], accent: s.accent, codeBg: s.inlineCodeBg, codeText: s.ink });
}

/** Clip everything below the stack limit when the slide overflows. */
export function clipToStack(ctx: Ctx): void {
  ctx.beginPath();
  ctx.rect(0, 0, CANVAS.w, ROWS.stackLimit);
  ctx.clip();
}
