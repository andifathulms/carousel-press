import type { Ctx } from '../../render/ctx';
import { withAlpha } from '../../core/color';
import { CANVAS, SAFE } from '../../render/safezone';
import { setFont, setShadow } from '../../render/text';
import type { SlideLayout } from '../common';
import { drawEditorial } from '../editorial/draw';

/** Lexicon decoration (SPEC-lexicon §3.2). Decorative only: nothing here carries meaning. */
export const LEX_DECO = {
  doubleRule: { y: 268, thick: 2, thin: 1, gap: 6 },
  notebook: { from: SAFE.top, to: SAFE.bottom, every: 64, h: 2, marginX: 72, marginW: 3 },
  cornerGlyph: { size: 900, alpha: 0.04, x: 640, baseline: 2240 },
};

function drawDeco(ctx: Ctx, L: SlideLayout): void {
  const { variant: v, surface: s, onPhoto } = L;
  if (onPhoto) return;
  setShadow(ctx, false);
  const rule = v.lex?.rule ?? withAlpha(s.muted, 0.3);
  const paper = L.surfaceName !== 'deep';
  if (v.deco.notebook && paper) {
    const n = LEX_DECO.notebook;
    ctx.fillStyle = rule;
    for (let y = n.from; y <= n.to; y += n.every) ctx.fillRect(0, y, CANVAS.w, n.h);
    if (v.lex?.margin) {
      ctx.fillStyle = v.lex.margin;
      ctx.fillRect(n.marginX, 0, n.marginW, CANVAS.h);
    }
  }
  if (v.deco.doubleRule) {
    const d = LEX_DECO.doubleRule;
    ctx.fillStyle = paper ? rule : withAlpha(s.muted, 0.35);
    ctx.fillRect(SAFE.left, d.y, SAFE.right - SAFE.left, d.thick);
    ctx.fillRect(SAFE.left, d.y + d.thick + d.gap, SAFE.right - SAFE.left, d.thin);
  }
  if (v.deco.cornerGlyph) {
    const g = LEX_DECO.cornerGlyph;
    setFont(ctx, { family: v.fonts.serif ?? v.fonts.sans, weight: 700, size: g.size });
    ctx.fillStyle = withAlpha(s.ink, g.alpha);
    ctx.fillText(v.deco.cornerGlyph, g.x, g.baseline);
  }
}

/** Lexicon family: paper decoration, then the editorial drawing (which handles lexicon slides too). */
export function drawLexicon(ctx: Ctx, L: SlideLayout): void {
  drawDeco(ctx, L);
  drawEditorial(ctx, L);
}
