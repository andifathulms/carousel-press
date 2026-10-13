// Lexicon slides (SPEC-lexicon §2): field lines for word/compare, pipe rows for table. Pure.
import type { Slide, TableData, Warning } from './types';
import { parseInline, parseRich } from './inline';

export const WORD_FIELDS = ['word', 'ipa', 'say', 'pos', 'tag', 'meaning', 'example', 'translation', 'origin', 'note'] as const;
export const COMPARE_FIELDS = ['wrong', 'right', 'why', 'wrong-label', 'right-label', 'headline'] as const;
export const TABLE = { minCols: 2, maxCols: 4, maxRows: 8 };

const FIELD_LINE = /^\s*([a-z][a-z-]*)\s*:\s?(.*)$/;

export type Warn = (code: Warning['code'], message: string, line?: number, hard?: boolean) => void;
export interface Line {
  text: string;
  line: number;
}

/** Read `key: value` lines. Unknown keys and non-field lines warn and are skipped. */
export function readFields(content: readonly Line[], keys: readonly string[], warn: Warn): Record<string, string> {
  const out: Record<string, string> = {};
  for (const c of content) {
    if (c.text.trim() === '') continue;
    const m = FIELD_LINE.exec(c.text);
    if (!m || !keys.includes(m[1]!)) {
      warn('unknown-field', m ? `Unknown field "${m[1]}"` : `Not a "key: value" line: ${c.text.trim().slice(0, 40)}`, c.line);
      continue;
    }
    out[m[1]!] = m[2]!.trim();
  }
  return out;
}

/** Fallback when a required field is missing: a card from the field values. */
function toCard(slide: Slide, values: string[]): void {
  slide.type = 'card';
  const [head, ...rest] = values.filter((v) => v.trim() !== '');
  slide.headlineSrc = head ?? '';
  slide.headline = head ? [parseInline(head)] : [];
  slide.body = parseRich(rest);
}

export function fillWord(slide: Slide, content: readonly Line[], warn: Warn): void {
  const f = readFields(content, WORD_FIELDS, warn);
  if (!f.word) {
    warn('missing-word', 'Word slide without "word:", rendered as a card');
    toCard(slide, Object.values(f));
    return;
  }
  slide.fields = f;
  slide.headlineSrc = f.word;
  slide.headline = [parseInline(f.word)];
}

export function fillCompare(slide: Slide, content: readonly Line[], warn: Warn): void {
  const f = readFields(content, COMPARE_FIELDS, warn);
  if (!f.wrong || !f.right) {
    warn('missing-field', `Compare slide needs both "wrong:" and "right:", rendered as a card`);
    toCard(slide, [f.headline ?? '', f.wrong ?? '', f.right ?? '', f.why ?? '']);
    return;
  }
  slide.fields = f;
  slide.headlineSrc = f.headline ?? '';
  slide.headline = f.headline ? [parseInline(f.headline)] : [];
}

/** Split `| a | b |` into cells. `\|` stays escaped (parseInline turns it into a pipe). */
export function splitRow(src: string): string[] {
  let s = src.trim();
  if (s.startsWith('|')) s = s.slice(1);
  if (s.endsWith('|') && !s.endsWith('\\|')) s = s.slice(0, -1);
  const cells: string[] = [];
  let cur = '';
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '\\' && s[i + 1] === '|') {
      cur += '\\|';
      i++;
    } else if (s[i] === '|') {
      cells.push(cur.trim());
      cur = '';
    } else cur += s[i];
  }
  cells.push(cur.trim());
  return cells;
}

/** Table body: lines starting with `|` are rows (first = header), the rest after the table is the note. */
export function fillTable(slide: Slide, content: readonly Line[], warn: Warn): void {
  const rows: string[][] = [];
  const note: string[] = [];
  let rowLine = slide.lines[0];
  for (const c of content) {
    if (c.text.trim().startsWith('|')) {
      if (!rows.length) rowLine = c.line;
      rows.push(splitRow(c.text));
    } else note.push(c.text);
  }
  if (!rows.length) {
    warn('table-shape', 'Table slide without "| … |" rows, rendered as a card');
    slide.type = 'card';
    slide.body = parseRich(note);
    return;
  }
  let header = rows[0]!;
  if (header.length < TABLE.minCols || header.length > TABLE.maxCols) {
    warn('table-shape', `Tables need ${TABLE.minCols}–${TABLE.maxCols} columns, this one has ${header.length}`, rowLine);
    header = header.slice(0, TABLE.maxCols);
    while (header.length < TABLE.minCols) header.push('');
  }
  const body = rows.slice(1).map((r, i) => {
    if (r.length > header.length) warn('table-shape', `Row ${i + 1} has more cells than the header`, rowLine + i + 1);
    const out = r.slice(0, header.length);
    while (out.length < header.length) out.push('');
    return out;
  });
  const table: TableData = { header, rows: body };
  slide.table = table;
  slide.note = parseRich(note);
  // Raw note source for the table layout (keeps inline markers).
  slide.fields = { note: note.map((l) => l.trim()).filter(Boolean).join(' | ') };
}

// ---- IPA coverage ---------------------------------------------------------
/**
 * Code points the bundled IPA face (Gentium Book Plus: latin, latin-ext and
 * greek subsets) covers, from its @fontsource unicode-range declarations.
 */
export const IPA_RANGES: readonly [number, number][] = [
  [0x0000, 0x00ff], [0x0100, 0x02ba], [0x02bb, 0x02bc], [0x02bd, 0x02c5], [0x02c6, 0x02c6], [0x02c7, 0x02cc],
  [0x02ce, 0x02d7], [0x02da, 0x02da], [0x02dc, 0x02dc], [0x02dd, 0x02ff], [0x0304, 0x0304], [0x0308, 0x0308],
  [0x0329, 0x0329], [0x0370, 0x0377],
  [0x037a, 0x037f], [0x0384, 0x038a], [0x038c, 0x038c], [0x038e, 0x03a1], [0x03a3, 0x03ff], [0x1d00, 0x1dbf],
  [0x1e00, 0x1e9f], [0x2000, 0x206f],
];

/** Characters in `text` the IPA face can't draw (deduplicated). */
export function uncoveredIpa(text: string): string[] {
  const missing = new Set<string>();
  for (const ch of Array.from(text)) {
    const cp = ch.codePointAt(0)!;
    if (!IPA_RANGES.some(([a, b]) => cp >= a && cp <= b)) missing.add(ch);
  }
  return [...missing];
}
