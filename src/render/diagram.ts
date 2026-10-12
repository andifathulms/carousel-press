// Draw a `[diagram]` panel (DESIGN §6.7): a half field in metres, then the marks in percent of it.
import type { Diagram, DiagramField, Mark, Pt } from '../core/diagram';
import { withAlpha } from '../core/color';
import type { Ctx } from './ctx';
import { setFont, setShadow } from './text';
import { DIAGRAM } from '../templates/stamps';

export interface DiagramColors {
  turf: string;
  line: string;
  att: string;
  def: string;
  ink: string;
  bg: string;
  accent: string;
}

export interface DiagramFonts {
  sans: string;
  display: string;
  displayWeight: number;
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Half-field size in metres: width × depth (goal/net/baseline at the top). Official dimensions. */
const FIELD: Record<DiagramField, { w: number; d: number }> = {
  football: { w: 68, d: 52.5 },
  futsal: { w: 20, d: 20 },
  badminton: { w: 6.1, d: 6.7 },
  volleyball: { w: 9, d: 9 },
  basketball: { w: 15, d: 14 },
  tennis: { w: 10.97, d: 11.885 },
};

export function drawDiagram(ctx: Ctx, d: Diagram, box: Rect, c: DiagramColors, f: DiagramFonts): void {
  const D = DIAGRAM;
  setShadow(ctx, false);
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(box.x, box.y, box.w, box.h, D.radius);
  ctx.fillStyle = c.turf;
  ctx.fill();
  ctx.clip();

  const dims = FIELD[d.field];
  const innerW = box.w - D.pad * 2;
  const innerH = box.h - D.pad * 2;
  const k = Math.min(innerW / dims.w, innerH / dims.d);
  const field: Rect = { w: dims.w * k, h: dims.d * k, x: 0, y: 0 };
  field.x = box.x + (box.w - field.w) / 2;
  field.y = box.y + D.pad;

  // Metres → canvas.
  const mx = (m: number): number => field.x + m * k;
  const my = (m: number): number => field.y + m * k;
  ctx.strokeStyle = withAlpha(c.line, D.line.alpha);
  ctx.lineWidth = D.line.width;
  const rect = (x: number, y: number, w: number, h: number): void => ctx.strokeRect(mx(x), my(y), w * k, h * k);
  const seg = (x1: number, y1: number, x2: number, y2: number): void => {
    ctx.beginPath();
    ctx.moveTo(mx(x1), my(y1));
    ctx.lineTo(mx(x2), my(y2));
    ctx.stroke();
  };
  const arc = (cx: number, cy: number, r: number, a0: number, a1: number): void => {
    ctx.beginPath();
    ctx.arc(mx(cx), my(cy), r * k, a0, a1);
    ctx.stroke();
  };
  const top = (x1: number, x2: number): void => {
    ctx.save();
    ctx.strokeStyle = c.line;
    ctx.lineWidth = D.line.goal;
    seg(x1, 0, x2, 0);
    ctx.restore();
  };
  const W = dims.w;
  const cx = W / 2;
  rect(0, 0, W, dims.d);
  switch (d.field) {
    case 'football':
      rect(cx - 20.16, 0, 40.32, 16.5);
      rect(cx - 9.16, 0, 18.32, 5.5);
      arc(cx, 11, 9.15, Math.asin(5.5 / 9.15), Math.PI - Math.asin(5.5 / 9.15));
      arc(cx, dims.d, 9.15, Math.PI, Math.PI * 2);
      top(cx - 3.66, cx + 3.66);
      break;
    case 'futsal':
      arc(cx - 1.58, 0, 6, Math.PI / 2, Math.PI);
      arc(cx + 1.58, 0, 6, 0, Math.PI / 2);
      seg(cx - 1.58, 6, cx + 1.58, 6);
      arc(cx, dims.d, 3, Math.PI, Math.PI * 2);
      top(cx - 1.5, cx + 1.5);
      break;
    case 'badminton':
      seg(0.46, 0, 0.46, dims.d);
      seg(W - 0.46, 0, W - 0.46, dims.d);
      seg(0, 1.98, W, 1.98);
      seg(cx, 1.98, cx, dims.d);
      seg(0, dims.d - 0.76, W, dims.d - 0.76);
      top(0, W);
      break;
    case 'volleyball':
      seg(0, 3, W, 3);
      top(0, W);
      break;
    case 'basketball': {
      const bx = 1.575;
      rect(cx - 2.45, 0, 4.9, 5.8);
      arc(cx, 5.8, 1.8, 0, Math.PI);
      arc(cx, bx, 1.25, 0, Math.PI);
      const side = 0.9;
      const dy = Math.sqrt(6.75 * 6.75 - (cx - side) * (cx - side));
      seg(side, 0, side, bx + dy);
      seg(W - side, 0, W - side, bx + dy);
      arc(cx, bx, 6.75, Math.atan2(dy, cx - side), Math.PI - Math.atan2(dy, cx - side));
      arc(cx, dims.d, 1.8, Math.PI, Math.PI * 2);
      top(cx - 0.9, cx + 0.9);
      break;
    }
    case 'tennis':
      seg(1.37, 0, 1.37, dims.d);
      seg(W - 1.37, 0, W - 1.37, dims.d);
      seg(1.37, 6.4, W - 1.37, 6.4);
      seg(cx, 0, cx, 6.4);
      seg(cx, dims.d - 0.2, cx, dims.d);
      top(0, W);
      break;
  }

  // Percent → canvas.
  const px = (p: Pt): [number, number] => [field.x + (p.x / 100) * field.w, field.y + (p.y / 100) * field.h];
  const order = (m: Mark): number => ({ zone: 0, line: 1, arrow: 2, dot: 3, ball: 4, label: 5 })[m.kind];
  for (const m of [...d.marks].sort((a, b) => order(a) - order(b))) drawMark(ctx, m, px, field, c, f);
  ctx.restore();
}

function drawMark(ctx: Ctx, m: Mark, px: (p: Pt) => [number, number], field: Rect, c: DiagramColors, f: DiagramFonts): void {
  const D = DIAGRAM;
  const label = (text: string, x: number, y: number, color: string): void => {
    if (!text) return;
    setFont(ctx, { family: f.sans, weight: D.label.weight, size: D.label.size });
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  };
  switch (m.kind) {
    case 'zone': {
      const [x1, y1] = px(m.from);
      const [x2, y2] = px(m.to);
      ctx.fillStyle = withAlpha(c.accent, D.zoneAlpha);
      ctx.fillRect(Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1));
      break;
    }
    case 'line': {
      const y = field.y + (m.y / 100) * field.h;
      ctx.save();
      ctx.setLineDash(D.offside.dash);
      ctx.strokeStyle = c.accent;
      ctx.lineWidth = D.offside.width;
      ctx.beginPath();
      ctx.moveTo(field.x, y);
      ctx.lineTo(field.x + field.w, y);
      ctx.stroke();
      ctx.restore();
      label(m.label, field.x + D.label.gap, y + D.label.size + D.label.gap / 2, c.accent);
      break;
    }
    case 'arrow': {
      const [x1, y1] = px(m.from);
      const [x2, y2] = px(m.to);
      const len = Math.hypot(x2 - x1, y2 - y1);
      if (len < 1) break;
      const ux = (x2 - x1) / len;
      const uy = (y2 - y1) / len;
      const trim = D.dot.r + D.arrow.width;
      const sx = x1 + ux * trim;
      const sy = y1 + uy * trim;
      const ex = x2 - ux * trim;
      const ey = y2 - uy * trim;
      ctx.save();
      if (m.style === 'pass') ctx.setLineDash(D.arrow.dash);
      ctx.strokeStyle = c.ink;
      ctx.lineWidth = D.arrow.width;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex - ux * D.arrow.head * 0.6, ey - uy * D.arrow.head * 0.6);
      ctx.stroke();
      ctx.restore();
      const h = D.arrow.head;
      ctx.fillStyle = c.ink;
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex - ux * h - uy * h * 0.55, ey - uy * h + ux * h * 0.55);
      ctx.lineTo(ex - ux * h + uy * h * 0.55, ey - uy * h - ux * h * 0.55);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'dot': {
      const [x, y] = px(m.at);
      const fill = m.team === 'att' ? c.att : m.team === 'def' ? c.def : c.ink;
      ctx.beginPath();
      ctx.arc(x, y, D.dot.r, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.lineWidth = D.dot.stroke;
      ctx.strokeStyle = c.turf;
      ctx.stroke();
      if (m.team === 'player') {
        setFont(ctx, { family: f.display, weight: f.displayWeight, size: D.dot.label });
        ctx.fillStyle = c.bg;
        ctx.textAlign = 'center';
        ctx.fillText(m.label, x, y + D.dot.label * 0.36);
        ctx.textAlign = 'left';
      } else {
        const right = x + D.dot.r + D.label.gap;
        // Labels near the right edge go on the left of the dot.
        setFont(ctx, { family: f.sans, weight: D.label.weight, size: D.label.size });
        const w = ctx.measureText(m.label).width;
        const lx = right + w > field.x + field.w ? x - D.dot.r - D.label.gap - w : right;
        label(m.label, lx, y + D.label.size * 0.36, c.ink);
      }
      break;
    }
    case 'ball': {
      const [x, y] = px(m.at);
      ctx.beginPath();
      ctx.arc(x, y, D.ball.r, 0, Math.PI * 2);
      ctx.fillStyle = c.ink;
      ctx.fill();
      ctx.lineWidth = D.ball.ring;
      ctx.strokeStyle = c.bg;
      ctx.stroke();
      break;
    }
    case 'label': {
      const [x, y] = px(m.at);
      label(m.text, x, y, c.ink);
      break;
    }
  }
}
