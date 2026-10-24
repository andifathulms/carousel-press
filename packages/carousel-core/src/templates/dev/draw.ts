import type { Ctx } from '../../render/ctx';
import { drawCodeBlock } from '../../render/codeBlock';
import { drawBigGlyph, drawDotGrid, drawGlow, drawGrid, drawScanlines } from '../../render/deco';
import { drawIcon } from '../../render/icons';
import { clipToStack, drawCta, drawFooter, drawHeader, drawTextBlock } from '../../render/parts';
import { CANVAS, CONTENT_W } from '../../render/safezone';
import { drawTracked, setFont, setShadow, truncateToWidth } from '../../render/text';
import type { SlideLayout } from '../common';
import { drawStampItem } from '../stampsDraw';
import { drawMatch } from '../matchPanel';
import { drawKeycaps } from '../keycaps';
import { drawLex } from '../../render/lexDraw';
import { FIXED, STACK } from './layout';

/** Draw a dev slide whose background (flat colour or photo) is already painted. */
export function drawDev(ctx: Ctx, L: SlideLayout): void {
  const { slide, variant: v, surface: s, onPhoto } = L;
  const sans = v.fonts.sans;
  const mono = v.fonts.mono;

  if (!onPhoto) {
    if (v.deco.dotGrid && v.deco.dotColor) drawDotGrid(ctx, v.deco.dotColor);
    if (v.deco.grid && v.deco.gridColor) drawGrid(ctx, v.deco.grid, v.deco.gridColor);
    if (v.deco.glow) drawGlow(ctx, s.accent, v.deco.glowAlpha ?? 0.08);
    if (v.deco.bigGlyph && (slide.type === 'cover' || slide.type === 'end')) drawBigGlyph(ctx, v.deco.bigGlyph, mono, s.ink);
  }
  // dev/kabar: decoration only, above the header row (no content there).
  if (v.deco.newsBand) drawNewsBand(ctx, s.accent);

  if (L.lex) {
    drawHeader(ctx, L, s.body, s.muted);
    drawFooter(ctx, L, s.muted, s.muted);
    drawLex(ctx, L);
    if (!onPhoto && v.deco.scanlines) drawScanlines(ctx);
    return;
  }

  if (slide.type === 'quote') {
    const q = FIXED.quoteMark;
    setShadow(ctx, onPhoto);
    setFont(ctx, { family: mono, weight: q.weight, size: q.size });
    ctx.fillStyle = s.accent;
    ctx.fillText('"', q.x, quoteMarkTop(L, q.top) + q.size * 0.72);
  }

  drawHeader(ctx, L, s.body, s.muted);
  drawFooter(ctx, L, s.muted, s.muted);

  ctx.save();
  if (L.stack.overflow) clipToStack(ctx);
  for (const p of L.stack.placed) {
    const it = p.item;
    switch (it.kind) {
      case 'text':
        drawTextBlock(ctx, p, s, onPhoto);
        break;
      case 'number': {
        const n = FIXED.number;
        setShadow(ctx, onPhoto);
        setFont(ctx, { family: mono, weight: n.weight, size: n.size });
        ctx.fillStyle = s.accent;
        const baseline = p.y + n.size * 0.86;
        ctx.fillText(it.label ?? '', p.x, baseline);
        const tw = ctx.measureText(it.label ?? '').width;
        const midY = baseline - n.size * 0.36;
        ctx.fillRect(p.x + tw + n.bar.gap, midY - n.bar.h / 2, n.bar.w, n.bar.h);
        break;
      }
      case 'kicker': {
        const k = FIXED.kicker;
        setShadow(ctx, false);
        ctx.strokeStyle = s.accent;
        ctx.lineWidth = k.border;
        ctx.beginPath();
        ctx.roundRect(p.x + k.border / 2, p.y + k.border / 2, p.w - k.border, p.h - k.border, k.radius);
        ctx.stroke();
        setShadow(ctx, onPhoto);
        setFont(ctx, { family: mono, weight: k.weight, size: k.size });
        ctx.fillStyle = s.accent;
        drawTracked(ctx, it.label ?? '', p.x + k.padX, p.y + p.h / 2 + k.size * 0.36, k.tracking);
        break;
      }
      case 'attribution': {
        const a = FIXED.attribution;
        setShadow(ctx, onPhoto);
        setFont(ctx, { family: mono, weight: a.weight, size: a.size });
        ctx.fillStyle = s.muted;
        ctx.fillText(truncateToWidth(ctx, it.label ?? '', CONTENT_W), p.x, p.y + a.size * 0.92);
        break;
      }
      case 'icon':
        if (L.icon) {
          setShadow(ctx, false);
          drawIcon(ctx, L.icon, p.x, p.y, FIXED.icon, s.icon);
        }
        break;
      case 'code':
        drawCodeBlock(ctx, p, v.code, mono, FIXED.code.radius, CONTENT_W);
        break;
      case 'cta':
        drawCta(ctx, p, it.label ?? '', s, sans);
        break;
      case 'badge':
        break;
      case 'verdict':
      case 'diagram':
      case 'sheet':
        drawStampItem(ctx, p, L);
        break;
      case 'match':
        if (L.slide.match) drawMatch(ctx, p, L.slide.match, v, s, onPhoto, L.crests);
        break;
      case 'keycaps':
        drawKeycaps(ctx, p, v, s, onPhoto);
        break;
    }
  }
  ctx.restore();

  if (!onPhoto && v.deco.scanlines) drawScanlines(ctx);
}

/** The big quote mark keeps its DESIGN offset above the quote stack, wherever the stack was centred. */
function quoteMarkTop(L: SlideLayout, designTop: number): number {
  return (L.stack.placed[0]?.y ?? STACK.quoteTop) - (STACK.quoteTop - designTop);
}

/** A solid accent band at the top edge with a thin rule under it, like a news ticker (DESIGN §6.11). */
function drawNewsBand(ctx: Ctx, color: string): void {
  setShadow(ctx, false);
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, CANVAS.w, NEWS_BAND.h);
  ctx.globalAlpha = NEWS_BAND.ruleAlpha;
  ctx.fillRect(0, NEWS_BAND.h + NEWS_BAND.gap, CANVAS.w, NEWS_BAND.rule);
  ctx.globalAlpha = 1;
}

const NEWS_BAND = { h: 22, gap: 8, rule: 4, ruleAlpha: 0.45 };
