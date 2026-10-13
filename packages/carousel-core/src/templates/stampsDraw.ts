// Draw the shared fixed items (verdict stamp, diagram panel) for any family.
import { displayFamily } from './traits';
import type { Ctx } from '../render/ctx';
import { drawDiagram } from '../render/diagram';
import type { Placed } from '../layout/stack';
import { setFont, setShadow } from '../render/text';
import type { SlideLayout } from './common';
import { VERDICT, toneColor, verdictFont } from './stamps';

/** Returns true when it drew the item. */
export function drawStampItem(ctx: Ctx, p: Placed, L: SlideLayout): boolean {
  const { slide, variant: v, surface: s } = L;
  if (p.item.kind === 'verdict') {
    const color = toneColor(v, s, slide.attrs.tone);
    const b = VERDICT.border;
    setShadow(ctx, false);
    ctx.strokeStyle = color;
    ctx.lineWidth = b;
    ctx.beginPath();
    ctx.roundRect(p.x + b / 2, p.y + b / 2, p.w - b, p.h - b, VERDICT.radius);
    ctx.stroke();
    setShadow(ctx, L.onPhoto);
    setFont(ctx, verdictFont(v));
    ctx.fillStyle = color;
    ctx.fillText(p.item.label ?? '', p.x + b + VERDICT.padX, p.y + p.h / 2 + (VERDICT.size * VERDICT.capHeight) / 2);
    return true;
  }
  if (p.item.kind === 'diagram' && slide.diagram) {
    drawDiagram(ctx, slide.diagram, p, {
      turf: s.inlineCodeBg, line: s.ink, att: s.accent, def: toneColor(v, s, 'bad'), ink: s.ink, bg: s.bg, accent: s.accent,
    }, {
      sans: v.fonts.sans, display: displayFamily(v), displayWeight: v.headlineWeight ?? 700,
    });
    return true;
  }
  return false;
}
