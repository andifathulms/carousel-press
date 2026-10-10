import type { Ctx } from '../../render/ctx';
import { withAlpha } from '../../core/color';
import { slideRng } from '../../core/hash';
import { drawBlobs } from '../../render/blob';
import { drawCodeBlock } from '../../render/codeBlock';
import { drawIcon } from '../../render/icons';
import { clipToStack, drawCta, drawFooter, drawHeader, drawTextBlock } from '../../render/parts';
import { CONTENT_W } from '../../render/safezone';
import { drawTracked, setFont, setShadow, truncateToWidth } from '../../render/text';
import type { SlideLayout } from '../common';
import { drawLex } from '../../render/lexDraw';
import { FIXED } from './layout';

/** Draw an editorial slide whose background (flat colour or photo) is already painted. */
export function drawEditorial(ctx: Ctx, L: SlideLayout): void {
  const { slide, deck, variant: v, surface: s, onPhoto } = L;
  const sans = v.fonts.sans;
  const serif = v.fonts.serif ?? sans;

  if (!onPhoto && v.deco.blobs) {
    const big = slide.type === 'cover' || slide.type === 'end';
    drawBlobs(ctx, slideRng(deck.slug, slide.index), s.blob, big);
  }

  if (L.lex) {
    drawHeader(ctx, L, s.body, s.muted);
    drawFooter(ctx, L, s.muted, s.muted);
    drawLex(ctx, L);
    return;
  }

  if (slide.type === 'quote' && !L.center) {
    const q = FIXED.quoteMark;
    setShadow(ctx, false);
    setFont(ctx, { family: serif, weight: q.weight, size: q.size });
    ctx.fillStyle = withAlpha(s.accent, q.alpha);
    ctx.fillText('“', q.x, q.top + q.size * 0.72);
  }

  drawHeader(ctx, L, s.body, s.muted);
  drawFooter(ctx, L, s.muted, s.muted);

  ctx.save();
  if (L.stack.overflow) clipToStack(ctx);
  for (const p of L.stack.placed) {
    const it = p.item;
    switch (it.kind) {
      case 'text':
        drawTextBlock(ctx, p, s, onPhoto, L.center);
        break;
      case 'badge': {
        const b = FIXED.badge;
        setShadow(ctx, false);
        ctx.fillStyle = s.badgeBg;
        ctx.beginPath();
        ctx.arc(p.x + b.d / 2, p.y + b.d / 2, b.d / 2, 0, Math.PI * 2);
        ctx.fill();
        setFont(ctx, { family: sans, weight: b.weight, size: b.digit });
        ctx.fillStyle = s.badgeInk;
        ctx.textAlign = 'center';
        ctx.fillText(it.label ?? '', p.x + b.d / 2, p.y + b.d / 2 + b.digit * 0.36 + b.opticalY);
        ctx.textAlign = 'left';
        break;
      }
      case 'kicker': {
        const k = FIXED.kicker;
        setShadow(ctx, onPhoto);
        setFont(ctx, { family: sans, weight: k.weight, size: k.size });
        ctx.fillStyle = s.accent;
        drawTracked(ctx, it.label ?? '', p.x, p.y + k.size * 0.92, k.tracking);
        break;
      }
      case 'attribution': {
        const a = FIXED.attribution;
        setShadow(ctx, onPhoto);
        setFont(ctx, { family: sans, weight: a.weight, size: a.size });
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
        drawCodeBlock(ctx, p, v.code, v.fonts.mono, FIXED.code.radius, CONTENT_W);
        break;
      case 'cta':
        drawCta(ctx, p, it.label ?? '', s, sans);
        break;
      case 'number':
        break;
    }
  }
  ctx.restore();
}
