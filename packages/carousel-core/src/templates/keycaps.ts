// Keycaps for dev/sheet (DESIGN §6.9): body lines like "Ctrl + Shift + L: Filter" are drawn as
// keyboard keys followed by the label, so shortcut posts read like the keyboard they describe.
import type { Rich, RichLine } from '../core/types';
import type { FontSpec, TextMeasurer } from '../layout/measure';
import type { KeyRow, StackItem } from '../layout/stack';
import type { Ctx } from '../render/ctx';
import { CONTENT_W } from '../render/safezone';
import { setFont, setShadow } from '../render/text';
import type { Surface, Variant } from './types';

export const KEYCAPS = {
  max: 44, min: 30, step: 2,
  /** Key box: height and side padding as multiples of the text size; plus sign gap; gap before the label. */
  keyH: 1.55, padX: 0.42, plusGap: 0.32, labelGap: 0.7, rowGap: 0.55,
  radius: 10, border: 3, depth: 5,
  keyWeight: 600, labelWeight: 500,
};

const KEY = String.raw`(?:Ctrl|Alt|Shift|Cmd|Option|Win|Fn|Tab|Enter|Esc|Space|Home|End|PgUp|PgDn|Delete|Backspace|F(?:1[0-2]|[1-9])|[A-Z0-9]|[;,.\/=\-\x60'\[\]↑↓←→])`;
/** "Ctrl + Shift + L: label" (two or more keys), or a single function key "F4: label". */
const ROW = new RegExp(String.raw`^(${KEY}(?:\s*\+\s*${KEY})+|F(?:1[0-2]|[1-9]))\s*:\s*(.+)$`);

const lineText = (line: RichLine): string => line.map((r) => r.text).join('');

/** Split a body into text before the shortcut rows, the rows, and text after. Null when there are none. */
export function splitKeys(body: Rich): { pre: Rich; rows: KeyRow[]; post: Rich } | null {
  const pre: Rich = [];
  const post: Rich = [];
  const rows: KeyRow[] = [];
  let phase: 'pre' | 'rows' | 'post' = 'pre';
  for (const para of body) {
    let cur: RichLine[] = [];
    const flush = (): void => {
      if (cur.length) (phase === 'pre' ? pre : post).push(cur);
      cur = [];
    };
    for (const line of para) {
      const m = phase !== 'post' ? ROW.exec(lineText(line).trim()) : null;
      if (m) {
        if (phase === 'pre') flush();
        phase = 'rows';
        rows.push({ keys: m[1]!.split('+').map((k) => k.trim()), label: m[2]!.trim() });
        continue;
      }
      if (phase === 'rows') phase = 'post';
      cur.push(line);
    }
    flush();
  }
  return rows.length ? { pre, rows, post } : null;
}

const keyFont = (v: Variant, size: number): FontSpec => ({ family: v.fonts.sans, weight: KEYCAPS.keyWeight, size });
const labelFont = (v: Variant, size: number): FontSpec => ({ family: v.fonts.sans, weight: KEYCAPS.labelWeight, size });

function keysWidth(keys: string[], v: Variant, m: TextMeasurer, size: number): number {
  const K = KEYCAPS;
  const plus = m.width('+', keyFont(v, size)) + size * K.plusGap * 2;
  return keys.reduce((w, k) => w + m.width(k, keyFont(v, size)) + size * K.padX * 2, 0) + plus * (keys.length - 1);
}

/** All rows as one fixed stack item, at the largest size where every row fits one line; null if none fits. */
export function keycapsItem(rows: KeyRow[], v: Variant, m: TextMeasurer, gap: number): StackItem | null {
  const K = KEYCAPS;
  for (let size = K.max; size >= K.min; size -= K.step) {
    const keyCol = Math.max(...rows.map((r) => keysWidth(r.keys, v, m, size)));
    const labelW = Math.max(...rows.map((r) => m.width(r.label, labelFont(v, size))));
    const w = keyCol + size * K.labelGap + labelW;
    if (w <= CONTENT_W) {
      const rowH = size * K.keyH + K.depth;
      const h = Math.round(rows.length * rowH + (rows.length - 1) * size * K.rowGap);
      return { kind: 'keycaps', h, w: Math.ceil(w), gap, rows, size, keyCol };
    }
  }
  return null;
}

interface PlacedLike { item: StackItem; x: number; y: number }

export function drawKeycaps(ctx: Ctx, p: PlacedLike, v: Variant, s: Surface, onPhoto: boolean): boolean {
  const it = p.item;
  if (it.kind !== 'keycaps') return false;
  const K = KEYCAPS;
  const size = it.size;
  const keyH = size * K.keyH;
  const rowStep = keyH + K.depth + size * K.rowGap;
  setShadow(ctx, onPhoto);
  it.rows.forEach((row, i) => {
    const top = p.y + i * rowStep;
    const mid = top + keyH / 2;
    let x = p.x;
    row.keys.forEach((key, k) => {
      if (k > 0) {
        setFont(ctx, keyFont(v, size));
        x += size * K.plusGap;
        ctx.fillStyle = s.muted;
        ctx.fillText('+', x, mid + size * 0.35);
        x += ctx.measureText('+').width + size * K.plusGap;
      }
      setFont(ctx, keyFont(v, size));
      const w = ctx.measureText(key).width + size * K.padX * 2;
      // The key: a darker base a few px lower, then the face, like a physical keycap.
      ctx.fillStyle = s.muted;
      ctx.beginPath();
      ctx.roundRect(x, top + K.depth, w, keyH, K.radius);
      ctx.fill();
      ctx.fillStyle = s.bg;
      ctx.strokeStyle = s.muted;
      ctx.lineWidth = K.border;
      ctx.beginPath();
      ctx.roundRect(x + K.border / 2, top + K.border / 2, w - K.border, keyH - K.border, K.radius);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = s.ink;
      ctx.fillText(key, x + size * K.padX, mid + size * 0.35);
      x += w;
    });
    setFont(ctx, labelFont(v, size));
    ctx.fillStyle = s.body;
    ctx.fillText(row.label, p.x + it.keyCol + size * K.labelGap, mid + size * 0.35);
  });
  return true;
}
