// table layout (SPEC-lexicon §4.2). Pure given a measurer.
import { parseInline, parseRich } from '../../core/inline';
import { TABLE } from '../../core/lexicon';
import type { RichLine, TableData } from '../../core/types';
import { withAlpha } from '../../core/color';
import type { FontSpec, TextMeasurer } from '../../layout/measure';
import { type TextStyle, type WrappedLine, wrapRich } from '../../layout/wrap';
import { CONTENT_W, SAFE } from '../../render/safezone';
import { type LexEl, type LexLayout, SizeSet, trackedW, wrapBlock } from './lexLayout';
import { type LexCtx, WORD, fit, valueStyle } from './lexSlides';
import { ARABIC, ARABIC_FACE, checkGlyphs, isArabic, isMixed, mixedSegs, scriptOverflow } from './lexScript';

export const TABLE_STYLE = {
  top: WORD.top,
  badge: { d: 104, digit: 46, weight: 600, gap: 32 },
  headline: { max: 76, min: 56, step: 4, lh: 1.1, maxLines: 3, gap: 40 },
  header: { size: 30, weight: 600, tracking: 1 },
  body: { max: 40, min: 28, step: 2, weight: 500 },
  rowH: 1.9,
  padX: 24,
  radius: 20,
  border: 2,
  headerFill: 0.12,
  zebra: 0.35,
  note: { max: 30, min: 30, step: 2, lh: 1.4, maxLines: 2, gap: 32 },
  priority: ['body', 'headline'],
};

/** One table cell on one line, truncated with "…" to `maxW`. */
function cellLine(src: string, style: TextStyle, maxW: number, m: TextMeasurer): { line: WrappedLine; clipped: boolean } {
  const rich = [[parseInline(src)[0] ?? []]] as RichLine[][];
  const wrapped = wrapRich(rich, 1e9, style, m).lines[0] ?? { runs: [], width: 0, paraStart: false };
  if (wrapped.width <= maxW) return { line: wrapped, clipped: false };
  // Drop characters from the end until the text plus an ellipsis fits.
  const runs = wrapped.runs.map((r) => ({ ...r }));
  const ell = m.width('…', style.font);
  let width = wrapped.width;
  while (runs.length && width + ell > maxW) {
    const last = runs[runs.length - 1]!;
    const chars = Array.from(last.text);
    chars.pop();
    last.text = chars.join('');
    last.w = m.width(last.text, style.font);
    if (!last.text) runs.pop();
    width = runs.length ? runs[runs.length - 1]!.x + runs[runs.length - 1]!.w : 0;
  }
  const tail = runs[runs.length - 1];
  if (tail && tail.style !== 'code') tail.text += '…';
  else runs.push({ text: '…', style: 'plain', x: width, w: ell });
  return { line: { runs, width: width + ell, paraStart: false }, clipped: true };
}

const cellText = (src: string): string => (parseInline(src)[0] ?? []).map((r) => r.text).join('');

export function layoutTable(c: LexCtx, tableIn: TableData, headline: string, note: string, badge: number | null, dir: 'ltr' | 'rtl' = 'ltr'): LexLayout {
  const T = TABLE_STYLE;
  // dir=rtl mirrors the column order; the header follows (SPEC-script §3.2).
  const table: TableData = dir === 'rtl' ? { header: [...tableIn.header].reverse(), rows: tableIn.rows.map((r) => [...r].reverse()) } : tableIn;
  const kindOf = (src: string): 'arab' | 'mixed' | 'latin' => {
    const text = cellText(src);
    if (!isArabic(text) && !/[\u0600-\u06ff]/.test(text)) return 'latin';
    return isMixed(text) ? 'mixed' : 'arab';
  };
  for (const r of table.rows) for (const cell of r) if (kindOf(cell) !== 'latin') checkGlyphs(c, cellText(cell), 'arab');
  const hasArab = table.rows.some((r) => r.some((cell) => kindOf(cell) !== 'latin'));
  let tooLong = false;
  const sizes = new SizeSet({ body: T.body, headline: T.headline, note: T.note });
  const mono = c.v.fonts.mono;
  const x = SAFE.left;
  const rows = table.rows.slice(0, TABLE.maxRows);
  if (table.rows.length > TABLE.maxRows) {
    c.warnings.push({ code: 'table-too-many-rows', slideIndex: c.slideIndex, line: c.line, message: `Tables show at most ${TABLE.maxRows} rows; ${table.rows.length - TABLE.maxRows} hidden` });
  }
  const headFont: FontSpec = { family: c.sans, weight: T.header.weight, size: T.header.size };
  const headers = table.header.map((h) => cellText(h).toUpperCase());
  let tooWide = false;

  const build = (): { els: LexEl[]; bottom: number; over: string | null } => {
    const els: LexEl[] = [];
    let y = T.top;
    let over: string | null = null;
    tooLong = false;
    if (badge !== null) {
      const B = T.badge;
      els.push({ k: 'badge', x, y, w: B.d, h: B.d, text: String(badge), font: { family: c.sans, weight: B.weight, size: B.digit }, bg: c.s.badgeBg, ink: c.s.badgeInk, radius: B.d / 2 });
      y += B.d + B.gap;
    }
    if (headline) {
      const sz = sizes.get('headline');
      const st: TextStyle = { font: { family: c.serif, weight: 700, size: sz }, mono: { family: mono, weight: 400 } };
      const b = wrapBlock(parseRich([headline]), CONTENT_W, st, T.headline.lh, c.m);
      if (b.lines.length > T.headline.maxLines) over = 'headline';
      els.push({ k: 'text', x, y, lines: b.lines, size: sz, lh: T.headline.lh, style: st, color: c.s.ink, accent: c.s.accent });
      y += b.h + T.headline.gap;
    }

    // Column widths: widest cell per column at the current size, then share the rest proportionally.
    const sz = sizes.get('body');
    const cellStyle = (src: string): TextStyle => valueStyle(cellText(src), c.sans, T.body.weight, sz, mono);
    const asz = Math.round(sz * ARABIC.cellScale);
    const arabFont = { family: ARABIC_FACE, weight: 400, size: asz, fallback: c.sans };
    const mixFaces = { latin: c.sans, latinWeight: T.body.weight, arabWeight: 400, fallback: c.sans };
    const cellW = (src: string): number => {
      const k = kindOf(src);
      if (k === 'arab') return c.m.width(cellText(src), arabFont);
      if (k === 'mixed') return mixedSegs(cellText(src), sz, mixFaces, { latin: c.s.ink, arab: c.s.ink }, c.m).w;
      return cellLine(src, cellStyle(src), 1e9, c.m).line.width;
    };
    const n = table.header.length;
    const natural = Array.from({ length: n }, (_, col) => {
      const hw = trackedW(headers[col] ?? '', headFont, T.header.tracking, c.m);
      const cw = rows.reduce((a, r) => Math.max(a, cellW(r[col] ?? '')), 0);
      return Math.max(hw, cw) + T.padX * 2;
    });
    const total = natural.reduce((a, b) => a + b, 0);
    const fits = total <= CONTENT_W;
    const widths = natural.map((w) => (fits ? w + (CONTENT_W - total) * (w / total) : (w * CONTENT_W) / total));
    const colX: number[] = [];
    widths.reduce((acc, w, i) => { colX[i] = acc; return acc + w; }, x);

    const headH = T.header.size * T.rowH;
    // Rows with Arabic need room for harakat above and below (SPEC-script §4).
    const rowH = hasArab ? sz * ARABIC.rowH : sz * T.rowH;
    const tableH = headH + rowH * rows.length;
    els.push({ k: 'rect', x, y, w: CONTENT_W, h: tableH, fill: c.s.bg, radius: T.radius });
    els.push({ k: 'clip', x, y, w: CONTENT_W, h: tableH, radius: T.radius });
    els.push({ k: 'rect', x, y, w: CONTENT_W, h: headH, fill: withAlpha(c.s.accent, T.headerFill), radius: 0 });
    headers.forEach((h, col) => {
      els.push({ k: 'label', x: colX[col]! + T.padX, y: y + (headH - T.header.size * 1.3) / 2, text: h, font: headFont, color: c.s.accent, tracking: T.header.tracking });
    });
    let clipped = false;
    rows.forEach((r, ri) => {
      const ry = y + headH + ri * rowH;
      if (ri % 2 === 1) els.push({ k: 'rect', x, y: ry, w: CONTENT_W, h: rowH, fill: withAlpha(c.tok.rule, T.zebra), radius: 0 });
      els.push({ k: 'rect', x, y: ry, w: CONTENT_W, h: 1, fill: c.tok.rule, radius: 0 });
      r.forEach((cell, col) => {
        const avail = widths[col]! - T.padX * 2;
        const k = kindOf(cell);
        if (k === 'arab') {
          // Arabic cells are right-aligned and never cut with "…": too wide at the minimum size blocks the export.
          const text = cellText(cell);
          const w = c.m.width(text, arabFont);
          if (w > avail) { over ??= 'body'; if (sz <= T.body.min) tooLong = true; }
          els.push({
            k: 'arabic', x: colX[col]! + T.padX, y: ry + (rowH - asz * ARABIC.lh) / 2, w: avail, lines: [text], widths: [w], size: asz, lh: ARABIC.lh,
            baseline: ARABIC.baseline, family: ARABIC_FACE, weight: 400, fallback: c.sans, color: c.s.ink, align: 'right', mark: null,
          });
          return;
        }
        if (k === 'mixed') {
          const mix = mixedSegs(cellText(cell), sz, mixFaces, { latin: c.s.ink, arab: c.s.ink }, c.m);
          if (mix.w > avail) { over ??= 'body'; if (sz <= T.body.min) tooLong = true; }
          const h = sz * ARABIC.lh;
          els.push({ k: 'mixed', x: colX[col]! + T.padX, y: ry + (rowH - h) / 2, h, baseline: sz * ARABIC.baseline, w: mix.w, segs: mix.segs });
          return;
        }
        const cst = cellStyle(cell);
        const res = cellLine(cell, cst, avail, c.m);
        if (res.clipped) clipped = true;
        els.push({ k: 'text', x: colX[col]! + T.padX, y: ry + (rowH - sz * 1.2) / 2, lines: [res.line], size: sz, lh: 1.2, style: cst, color: c.s.ink, accent: c.s.accent });
      });
    });
    els.push({ k: 'unclip' });
    els.push({ k: 'frame', x, y, w: CONTENT_W, h: tableH, stroke: c.tok.rule, width: T.border, radius: T.radius });
    tooWide = clipped;
    // Too-wide cells shrink the body first; at the minimum size they keep their ellipsis.
    if (clipped && sz > T.body.min) over ??= 'body';
    y += tableH;

    if (note) {
      y += T.note.gap;
      const nsz = sizes.get('note');
      const nst: TextStyle = { font: { family: c.sans, weight: 400, size: nsz }, mono: { family: mono, weight: 400 } };
      const b = wrapBlock(parseRich([note]), CONTENT_W, nst, T.note.lh, c.m);
      if (b.lines.length > T.note.maxLines) over ??= 'note';
      els.push({ k: 'text', x, y, lines: b.lines, size: nsz, lh: T.note.lh, style: nst, color: c.s.muted, accent: c.s.accent });
      y += b.h;
    }
    return { els, bottom: y, over };
  };
  const out = fit(build, sizes, T.priority);
  if (tooLong) scriptOverflow(c);
  if (tooWide) {
    c.warnings.push({ code: 'table-too-wide', slideIndex: c.slideIndex, line: c.line, message: 'Table cells are too wide and were cut with "…"' });
  }
  return out;
}
