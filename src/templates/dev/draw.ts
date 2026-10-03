import type { Ctx } from '../../render/ctx';
import { drawCodeBlock } from '../../render/codeBlock';
import { drawBigGlyph, drawDotGrid, drawGlow, drawScanlines } from '../../render/deco';
import { drawIcon } from '../../render/icons';
import { clipToStack, drawCta, drawFooter, drawHeader, drawTextBlock } from '../../render/parts';
import { CONTENT_W } from '../../render/safezone';
import { drawTracked, setFont, setShadow, truncateToWidth } from '../../render/text';
import type { SlideLayout } from '../common';
import { FIXED } from './layout';

/** Draw a dev slide whose background (flat colour or photo) is already painted. */
export function drawDev(ctx: Ctx, L: SlideLayout): void {
  const { slide, variant: v, surface: s, onPhoto } = L;
  const sans = v.fonts.sans;
  const mono = v.fonts.mono;

  if (!onPhoto) {
    if (v.deco.dotGrid && v.deco.dotColor) drawDotGrid(ctx, v.deco.dotColor);
    if (v.deco.glow) drawGlow(ctx, s.accent, v.deco.glowAlpha ?? 0.08);
    if (v.deco.bigGlyph && (slide.type === 'cover' || slide.type === 'end')) drawBigGlyph(ctx, v.deco.bigGlyph, mono, s.ink);
  }

  if (slide.type === 'quote') {
    const q = FIXED.quoteMark;
    setShadow(ctx, onPhoto);
    setFont(ctx, { family: mono, weight: q.weight, size: q.size });
    ctx.fillStyle = s.accent;
    ctx.fillText('"', q.x, q.top + q.size * 0.72);
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
    }
  }
  ctx.restore();

  if (!onPhoto && v.deco.scanlines) drawScanlines(ctx);
}
