import type { Ctx } from '../../render/ctx';
import { withAlpha } from '../../core/color';
import { CANVAS, SAFE } from '../../render/safezone';
import { drawGrid } from '../../render/deco';
import { setFont, setShadow } from '../../render/text';
import type { SlideLayout } from '../common';
import { drawEditorial } from '../editorial/draw';

/** Lexicon decoration (SPEC-lexicon §3.2). Decorative only: nothing here carries meaning. */
export const LEX_DECO = {
  doubleRule: { y: 268, thick: 2, thin: 1, gap: 6 },
  notebook: { from: SAFE.top, to: SAFE.bottom, every: 64, h: 2, marginX: 72, marginW: 3, alpha: 0.55 },
  // lexicon/arab (SPEC-script §10.1): margin on the right for RTL writing, root colour at 45 %.
  notebookRight: { from: SAFE.top, to: SAFE.bottom, every: 72, h: 2, marginX: 1008, marginW: 3, marginAlpha: 0.45 },
  // lexicon/hanzi (SPEC-script §10.2): a plain rounded square, never with characters in it.
  seal: { size: 48, radius: 8, x: SAFE.right - 48, y: 108, angle: -4 },
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
    // Full-page ruled lines, drawn fainter than the table rules so text on top stays calm (Oct 2026 review).
    ctx.fillStyle = withAlpha(rule, n.alpha);
    for (let y = n.from; y <= n.to; y += n.every) ctx.fillRect(0, y, CANVAS.w, n.h);
    if (v.lex?.margin) {
      ctx.fillStyle = v.lex.margin;
      ctx.fillRect(n.marginX, 0, n.marginW, CANVAS.h);
    }
  }
  if (v.deco.grid && paper) drawGrid(ctx, v.deco.grid, v.deco.gridColor ?? rule);
  if (v.deco.seal) {
    const g = LEX_DECO.seal;
    ctx.save();
    ctx.translate(g.x + g.size / 2, g.y + g.size / 2);
    ctx.rotate((g.angle * Math.PI) / 180);
    ctx.fillStyle = s.accent;
    ctx.beginPath();
    ctx.roundRect(-g.size / 2, -g.size / 2, g.size, g.size, g.radius);
    ctx.fill();
    ctx.restore();
  }
  if (v.deco.notebookRight && paper) {
    const n = LEX_DECO.notebookRight;
    ctx.fillStyle = rule;
    for (let y = n.from; y <= n.to; y += n.every) ctx.fillRect(0, y, CANVAS.w, n.h);
    ctx.fillStyle = withAlpha(v.lexSurfaces?.[L.surfaceName]?.root ?? v.lex?.root ?? s.accent, n.marginAlpha);
    ctx.fillRect(n.marginX, 0, n.marginW, CANVAS.h);
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
