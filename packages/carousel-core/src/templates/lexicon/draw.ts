import type { Ctx } from '../../render/ctx';
import { withAlpha } from '../../core/color';
import { CANVAS, SAFE } from '../../render/safezone';
import { drawGrid } from '../../render/deco';
import { drawStar } from '../../render/lexDraw';
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
  // Cover/end patterns (owner, Oct 2026). Girih: 8-point stars on a lattice + offset stars, faded behind the text.
  // Tips of neighbouring stars touch (size = every); the small stars span the diagonal gap: every × (√2 − 1).
  girih: { every: 144, star: 144, inner: Math.round(144 * (Math.SQRT2 - 1)), width: 2, alpha: 0.22, clear: { cx: CANVAS.w / 2, cy: 820, r0: 260, r1: 760, alpha: 0.88 } },
  // 回纹 fret bands: a continuous meander on a 12 px grid, above the header and below the footer.
  huiwen: { grid: 12, unit: 5, width: 3, alpha: 0.9, bands: [58, 1552], rule: 2 },
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
  if (v.deco.coverPattern === 'girih' && L.surfaceName === 'deep') drawGirih(ctx, s.accent, s.bg);
  if (v.deco.coverPattern === 'huiwen' && L.surfaceName === 'deep') drawHuiwen(ctx, s.accent);
  if (v.deco.seal && !(v.deco.coverPattern === 'huiwen' && L.surfaceName === 'deep')) {
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

/** Islamic geometric lattice: 8-point stars at lattice points and cell centres, cleared behind the text. */
function drawGirih(ctx: Ctx, color: string, bg: string): void {
  const g = LEX_DECO.girih;
  ctx.save();
  ctx.globalAlpha = g.alpha;
  for (let y = 0; y <= CANVAS.h + g.every; y += g.every) {
    for (let x = 0; x <= CANVAS.w + g.every; x += g.every) {
      drawStar(ctx, x, y, g.star, color, g.width);
      drawStar(ctx, x + g.every / 2, y + g.every / 2, g.inner, color, g.width);
    }
  }
  ctx.restore();
  const c = g.clear;
  const grad = ctx.createRadialGradient(c.cx, c.cy, c.r0, c.cx, c.cy, c.r1);
  grad.addColorStop(0, withAlpha(bg, c.alpha));
  grad.addColorStop(1, withAlpha(bg, 0));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS.w, CANVAS.h);
}

/** Chinese 回纹 fret: square spirals joined by a baseline, between two rules. */
function drawHuiwen(ctx: Ctx, color: string): void {
  const h = LEX_DECO.huiwen;
  const s = h.grid;
  const unitW = h.unit * s;
  ctx.save();
  ctx.globalAlpha = h.alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = h.width;
  ctx.lineJoin = 'miter';
  for (const top of h.bands) {
    const y0 = top + s;
    ctx.fillStyle = color;
    ctx.fillRect(0, top - h.rule, CANVAS.w, h.rule);
    ctx.fillRect(0, top + 6 * s, CANVAS.w, h.rule);
    ctx.beginPath();
    for (let ox = -unitW; ox < CANVAS.w + unitW; ox += unitW) {
      // One unit: up from the baseline, a square spiral inward (回), then along the baseline to the next unit.
      ctx.moveTo(ox, y0 + 4 * s);
      ctx.lineTo(ox, y0);
      ctx.lineTo(ox + 4 * s, y0);
      ctx.lineTo(ox + 4 * s, y0 + 3 * s);
      ctx.lineTo(ox + s, y0 + 3 * s);
      ctx.lineTo(ox + s, y0 + s);
      ctx.lineTo(ox + 3 * s, y0 + s);
      ctx.lineTo(ox + 3 * s, y0 + 2 * s);
      ctx.lineTo(ox + 2 * s, y0 + 2 * s);
      ctx.moveTo(ox, y0 + 4 * s);
      ctx.lineTo(ox + unitW, y0 + 4 * s);
    }
    ctx.stroke();
  }
  ctx.restore();
}

/** Lexicon family: paper decoration, then the editorial drawing (which handles lexicon slides too). */
export function drawLexicon(ctx: Ctx, L: SlideLayout): void {
  drawDeco(ctx, L);
  drawEditorial(ctx, L);
}
