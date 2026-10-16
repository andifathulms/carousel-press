// `[sheet]` notation (PRD §4.10): a small spreadsheet drawn on the slide. Pure: no DOM.
//
//   ```sheet
//   G2 =XLOOKUP(F2;A2:A6;B2:B6)      ← optional: the formula and the cell that holds it
//   ID | Nama | Divisi | | Cari | Hasil
//   K01 | Rina | Keuangan | | K03 | Sari
//   ```
//
// Rows start at row 1, columns at A. Empty cells are empty strings. `*K03*` marks a cell
// (drawn highlighted, e.g. the row the lookup found); the stars are not shown.

export const SHEET_MAX_COLS = 7;
export const SHEET_MAX_ROWS = 9;

export interface CellRef {
  /** 0-based column (A = 0). */
  col: number;
  /** 0-based row (row 1 = 0). */
  row: number;
}

export interface Sheet {
  /** Formula shown in the formula bar, and the cell it sits in (drawn as the result cell). */
  formula: { cell: CellRef; name: string; text: string } | null;
  /** rows[r][c]; every row padded to `cols`. */
  rows: string[][];
  /** marked[r][c]: the cell was written `*like this*`. */
  marked: boolean[][];
  cols: number;
}

export interface SheetIssue {
  /** 0-based line inside the fence, or -1 for the whole fence. */
  offset: number;
  message: string;
}

const FORMULA = /^\s*\$?([A-Za-z]{1,2})\$?(\d{1,3})\s+(=.*\S)\s*$/;

/** "A" → 0, "Z" → 25, "AA" → 26. */
export function colIndex(letters: string): number {
  let n = 0;
  for (const ch of letters.toUpperCase()) n = n * 26 + (ch.charCodeAt(0) - 64);
  return n - 1;
}

export function colName(i: number): string {
  let s = '';
  for (let n = i + 1; n > 0; n = Math.floor((n - 1) / 26)) s = String.fromCharCode(65 + ((n - 1) % 26)) + s;
  return s;
}

function splitRow(line: string): string[] {
  let t = line.trim();
  if (t.startsWith('|')) t = t.slice(1);
  if (t.endsWith('|') && !t.endsWith('\\|')) t = t.slice(0, -1);
  return t.split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, '|'));
}

export function parseSheet(lines: readonly string[]): { sheet: Sheet | null; issues: SheetIssue[] } {
  const issues: SheetIssue[] = [];
  let formula: Sheet['formula'] = null;
  const rows: string[][] = [];
  lines.forEach((raw, offset) => {
    if (raw.trim() === '') return;
    const f = rows.length === 0 && formula === null ? FORMULA.exec(raw) : null;
    if (f) {
      const cell = { col: colIndex(f[1]!), row: Number(f[2]) - 1 };
      formula = { cell, name: `${f[1]!.toUpperCase()}${f[2]}`, text: f[3]! };
      return;
    }
    if (rows.length >= SHEET_MAX_ROWS) {
      if (rows.length === SHEET_MAX_ROWS) issues.push({ offset, message: `A sheet shows at most ${SHEET_MAX_ROWS} rows; the rest are left out` });
      rows.push([]);
      return;
    }
    const cells = splitRow(raw);
    if (cells.length > SHEET_MAX_COLS) {
      issues.push({ offset, message: `A sheet shows at most ${SHEET_MAX_COLS} columns (A–${colName(SHEET_MAX_COLS - 1)}); the rest are left out` });
      cells.length = SHEET_MAX_COLS;
    }
    rows.push(cells);
  });
  const kept = rows.slice(0, SHEET_MAX_ROWS);
  if (!kept.length) {
    issues.push({ offset: -1, message: 'Sheet fence has no rows' });
    return { sheet: null, issues };
  }
  const cols = Math.max(...kept.map((r) => r.length));
  for (const r of kept) while (r.length < cols) r.push('');
  const marked = kept.map((r) => r.map((c, i) => {
    const m = /^\*(.+)\*$/.exec(c);
    if (m) r[i] = m[1]!.trim();
    return !!m;
  }));
  const fm = formula as Sheet['formula'];
  if (fm && (fm.cell.col >= cols || fm.cell.row >= kept.length)) {
    issues.push({ offset: 0, message: `Formula cell ${fm.name} is outside the sheet (${colName(cols - 1)}${kept.length} is the last cell)` });
  }
  return { sheet: { formula: fm, rows: kept, marked, cols }, issues };
}

/** A reference inside a formula, resolved against the sheet size. Other-sheet references → null. */
export function refRect(ref: string, sheet: Sheet): { c0: number; r0: number; c1: number; r1: number } | null {
  if (ref.includes('!')) return null;
  const clean = ref.replace(/\$/g, '');
  const cell = /^([A-Za-z]{1,3})(\d+)$/;
  const [a, b = a] = clean.split(':') as [string, string?];
  const lastRow = sheet.rows.length - 1;
  const lastCol = sheet.cols - 1;
  const one = (s: string): { c: number | null; r: number | null } | null => {
    const m = cell.exec(s);
    if (m) return { c: colIndex(m[1]!), r: Number(m[2]) - 1 };
    if (/^[A-Za-z]{1,3}$/.test(s)) return { c: colIndex(s), r: null };
    if (/^\d+$/.test(s)) return { c: null, r: Number(s) - 1 };
    return null;
  };
  const p = one(a);
  const q = one(b!);
  if (!p || !q) return null;
  const c0 = Math.min(p.c ?? 0, q.c ?? lastCol);
  const c1 = Math.max(p.c ?? 0, q.c ?? lastCol);
  const r0 = Math.min(p.r ?? 0, q.r ?? lastRow);
  const r1 = Math.max(p.r ?? 0, q.r ?? lastRow);
  if (c0 > lastCol || r0 > lastRow) return null;
  return { c0, r0, c1: Math.min(c1, lastCol), r1: Math.min(r1, lastRow) };
}
