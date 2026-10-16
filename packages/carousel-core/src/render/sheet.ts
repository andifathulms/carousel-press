// Draw a `[sheet]` panel (PRD §4.10): formula bar, column letters, row numbers, cells, then every
// reference in the formula outlined in its own colour (the same colour as in the bar), and the
// formula's cell as the result. Cells written `*like this*` get a dashed outline and bold text in
// the result colour (the row a lookup found). Geometry comes from templates/sheet.ts.
import { refRect, colName, type Sheet } from '../core/sheet';
import { withAlpha } from '../core/color';
import { createCanvasMeasurer } from '../layout/measure';
import { SHEET, barFont, cellFont, sheetGeometry, type SheetFonts } from '../templates/sheet';
import type { CodeTheme } from '../templates/types';
import type { Ctx } from './ctx';
import { tokenizeExcel } from './highlight/excel';
import { setFont, setShadow } from './text';

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Reference colours, in order of first appearance in the formula. All are contrast-checked on the code panel. */
function refPalette(code: CodeTheme): string[] {
  return [code.subcommand, code.keyword, code.flag, code.string, code.number];
}

export function drawSheet(ctx: Ctx, sheet: Sheet, box: Rect, code: CodeTheme, f: SheetFonts): void {
  const g = sheetGeometry(sheet, f, createCanvasMeasurer(ctx), box.w);
  const result = code.prompt;
  setShadow(ctx, false);

  // Formula bar: name box | fx | formula with coloured references.
  const refColor = new Map<string, string>();
  const palette = refPalette(code);
  let y = box.y;
  if (sheet.formula && g.bar) {
    const B = SHEET.bar;
    ctx.fillStyle = code.panel;
    ctx.strokeStyle = code.border;
    ctx.lineWidth = SHEET.line.grid;
    ctx.beginPath();
    ctx.roundRect(box.x, y, box.w, B.h, SHEET.radius);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = code.border;
    ctx.fillRect(box.x + B.name, y, SHEET.line.grid, B.h);
    const mid = y + B.h / 2 + B.max * 0.35;
    setFont(ctx, cellFont(f, B.max, true));
    ctx.fillStyle = code.text;
    ctx.textAlign = 'center';
    ctx.fillText(sheet.formula.name, box.x + B.name / 2, mid);
    setFont(ctx, { family: f.mono, weight: 600, size: B.max - 4 });
    ctx.fillStyle = code.comment;
    ctx.fillText('fx', box.x + B.name + B.fx / 2, mid);
    ctx.textAlign = 'left';
    let x = box.x + B.name + B.fx;
    const by = y + B.h / 2 + g.bar.size * 0.35;
    setFont(ctx, barFont(f, g.bar.size));
    for (const t of tokenizeExcel(g.bar.text)) {
      let color = code.text;
      if (t.kind === 'subcommand') {
        const key = t.text.toUpperCase();
        if (!refColor.has(key)) refColor.set(key, palette[refColor.size % palette.length]!);
        color = refColor.get(key)!;
      } else if (t.kind === 'fn') color = code.fn;
      else if (t.kind === 'string') color = code.string;
      else if (t.kind === 'number') color = code.number;
      else if (t.kind === 'keyword') color = code.keyword;
      else if (t.kind === 'punct') color = code.punct;
      ctx.fillStyle = color;
      ctx.fillText(t.text, x, by);
      x += ctx.measureText(t.text).width;
    }
    y += B.h + B.gap;
  }

  // Grid frame.
  const H = SHEET.head;
  const gridH = H.h + g.rowH * sheet.rows.length;
  const colX: number[] = [];
  let cx = box.x + H.gutter;
  for (const w of g.colW) {
    colX.push(cx);
    cx += w;
  }
  const rowY = (r: number): number => y + H.h + r * g.rowH;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(box.x, y, box.w, gridH, SHEET.radius);
  ctx.fillStyle = code.panel;
  ctx.fill();
  ctx.clip();
  const head = withAlpha(code.text, SHEET.headAlpha);
  ctx.fillStyle = head;
  ctx.fillRect(box.x, y, box.w, H.h);
  ctx.fillRect(box.x, y, H.gutter, gridH);
  const target = sheet.formula?.cell;
  if (target && target.col < sheet.cols && target.row < sheet.rows.length) {
    ctx.fillStyle = withAlpha(result, SHEET.refAlpha);
    ctx.fillRect(colX[target.col]!, y, g.colW[target.col]!, H.h);
    ctx.fillRect(box.x, rowY(target.row), H.gutter, g.rowH);
  }

  // Reference ranges: tint under the text.
  const rects: { r: { x: number; y: number; w: number; h: number }; color: string }[] = [];
  for (const [ref, color] of refColor) {
    const rr = refRect(ref, sheet);
    if (!rr) continue;
    const r = { x: colX[rr.c0]!, y: rowY(rr.r0), w: colX[rr.c1]! + g.colW[rr.c1]! - colX[rr.c0]!, h: (rr.r1 - rr.r0 + 1) * g.rowH };
    rects.push({ r, color });
    ctx.fillStyle = withAlpha(color, SHEET.refAlpha);
    ctx.fillRect(r.x, r.y, r.w, r.h);
  }

  // Grid lines.
  ctx.fillStyle = code.border;
  const L = SHEET.line.grid;
  for (let r = 0; r <= sheet.rows.length; r++) ctx.fillRect(box.x, rowY(r) - L / 2, box.w, L);
  for (const x of colX) ctx.fillRect(x - L / 2, y, L, gridH);

  // Column letters and row numbers.
  setFont(ctx, { family: f.mono, weight: 500, size: H.size });
  ctx.textAlign = 'center';
  g.colW.forEach((w, c) => {
    ctx.fillStyle = target?.col === c ? result : code.comment;
    ctx.fillText(colName(c), colX[c]! + w / 2, y + H.h / 2 + H.size * 0.36);
  });
  sheet.rows.forEach((_, r) => {
    ctx.fillStyle = target?.row === r ? result : code.comment;
    ctx.fillText(String(r + 1), box.x + H.gutter / 2, rowY(r) + g.rowH / 2 + H.size * 0.36);
  });
  ctx.textAlign = 'left';

  // Cells. Row 1 is the header row (bold); the result cell is bold in the result colour.
  g.texts.forEach((row, r) => row.forEach((t, c) => {
    if (!t) return;
    const isResult = target?.col === c && target.row === r;
    const isMarked = !!sheet.marked[r]?.[c];
    setFont(ctx, cellFont(f, g.size, r === 0 || isResult || isMarked));
    ctx.fillStyle = isResult || isMarked ? result : code.text;
    ctx.fillText(t, colX[c]! + SHEET.cell.padX, rowY(r) + g.rowH / 2 + g.size * 0.36);
  }));

  // Outlines on top: references, then the result cell.
  for (const { r, color } of rects) {
    ctx.strokeStyle = color;
    ctx.lineWidth = SHEET.line.ref;
    ctx.strokeRect(r.x + SHEET.line.ref / 2, r.y + SHEET.line.ref / 2, r.w - SHEET.line.ref, r.h - SHEET.line.ref);
  }
  // Marked cells: one dashed outline per run of adjacent marked cells in a row ("found here").
  ctx.strokeStyle = result;
  ctx.lineWidth = SHEET.line.mark;
  ctx.setLineDash(SHEET.markDash);
  sheet.marked.forEach((row, rr) => {
    for (let c = 0; c < row.length; c++) {
      if (!row[c]) continue;
      let e = c;
      while (row[e + 1]) e++;
      const w = SHEET.line.mark;
      ctx.strokeRect(colX[c]! + w / 2, rowY(rr) + w / 2, colX[e]! + g.colW[e]! - colX[c]! - w, g.rowH - w);
      c = e;
    }
  });
  ctx.setLineDash([]);
  if (target && target.col < sheet.cols && target.row < sheet.rows.length) {
    const w = SHEET.line.result;
    ctx.strokeStyle = result;
    ctx.lineWidth = w;
    ctx.strokeRect(colX[target.col]! + w / 2, rowY(target.row) + w / 2, g.colW[target.col]! - w, g.rowH - w);
  }
  ctx.restore();

  // Frame on top of the clipped fill.
  ctx.strokeStyle = code.border;
  ctx.lineWidth = L;
  ctx.beginPath();
  ctx.roundRect(box.x, y, box.w, gridH, SHEET.radius);
  ctx.stroke();
}
