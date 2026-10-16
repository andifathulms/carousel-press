import { describe, expect, it } from 'vitest';
import { colIndex, colName, parseSheet, refRect, SHEET_MAX_COLS, SHEET_MAX_ROWS } from 'carousel-core/src/core/sheet';
import { parse } from 'carousel-core/src/core/parser';
import { mulberry32 } from 'carousel-core/src/core/hash';
import { fakeMeasurer } from 'carousel-core/src/layout/measure';
import { CONTENT_W } from 'carousel-core/src/render/safezone';
import { SHEET, sheetGeometry } from 'carousel-core/src/templates/sheet';

const ROWS = ['ID | Nama | Cari | Hasil', 'K01 | Rina | K03 | Sari', '*K03* | *Sari* | |'];
const fonts = { sans: 'Inter', mono: 'JetBrains Mono' };

describe('parseSheet', () => {
  it('reads the formula line, rows from A1 and marked cells', () => {
    const { sheet, issues } = parseSheet(['D2 =XLOOKUP(C2;A2:A3;B2:B3)', ...ROWS]);
    expect(issues).toEqual([]);
    expect(sheet!.formula).toEqual({ cell: { col: 3, row: 1 }, name: 'D2', text: '=XLOOKUP(C2;A2:A3;B2:B3)' });
    expect(sheet!.cols).toBe(4);
    expect(sheet!.rows[2]).toEqual(['K03', 'Sari', '', '']);
    expect(sheet!.marked[2]).toEqual([true, true, false, false]);
    expect(sheet!.marked[1]).toEqual([false, false, false, false]);
  });
  it('works without a formula, with leading/trailing pipes and escaped pipes', () => {
    const { sheet } = parseSheet(['| a | b \\| c |', '| 1 | 2 |']);
    expect(sheet!.formula).toBeNull();
    expect(sheet!.rows).toEqual([['a', 'b | c'], ['1', '2']]);
  });
  it('a formula line is only recognised before the first row', () => {
    const { sheet } = parseSheet(['a | b', 'B1 =SUM(A1)']);
    expect(sheet!.formula).toBeNull();
    expect(sheet!.rows[1]![0]).toBe('B1 =SUM(A1)');
  });
  it('caps rows and columns and reports them', () => {
    const wide = Array.from({ length: SHEET_MAX_COLS + 2 }, (_, i) => `c${i}`).join(' | ');
    const tall = Array.from({ length: SHEET_MAX_ROWS + 3 }, (_, i) => `r${i}`);
    const w = parseSheet([wide]);
    expect(w.sheet!.cols).toBe(SHEET_MAX_COLS);
    expect(w.issues).toHaveLength(1);
    const t = parseSheet(tall);
    expect(t.sheet!.rows).toHaveLength(SHEET_MAX_ROWS);
    expect(t.issues).toHaveLength(1);
  });
  it('reports a formula cell outside the sheet, and an empty fence', () => {
    expect(parseSheet(['Z9 =A1', 'a | b']).issues[0]!.message).toMatch(/outside/);
    const empty = parseSheet(['', '  ']);
    expect(empty.sheet).toBeNull();
    expect(empty.issues[0]!.offset).toBe(-1);
  });
  it('never throws on random input', () => {
    const rnd = mulberry32(11);
    const chars = 'AZaz09|*$:=;"\\ \t';
    for (let n = 0; n < 1000; n++) {
      const lines = Array.from({ length: Math.floor(rnd() * 14) }, () =>
        Array.from({ length: Math.floor(rnd() * 30) }, () => chars[Math.floor(rnd() * chars.length)]).join(''));
      expect(() => parseSheet(lines)).not.toThrow();
    }
  });
});

describe('references', () => {
  const sheet = parseSheet(ROWS).sheet!;
  it('column letters', () => {
    expect([colIndex('A'), colIndex('Z'), colIndex('AA'), colIndex('ab')]).toEqual([0, 25, 26, 27]);
    expect([colName(0), colName(25), colName(26)]).toEqual(['A', 'Z', 'AA']);
  });
  it('cells, ranges, absolute refs, whole columns and rows, other sheets', () => {
    expect(refRect('B2', sheet)).toEqual({ c0: 1, r0: 1, c1: 1, r1: 1 });
    expect(refRect('$A$2:$B$3', sheet)).toEqual({ c0: 0, r0: 1, c1: 1, r1: 2 });
    expect(refRect('B3:A2', sheet)).toEqual({ c0: 0, r0: 1, c1: 1, r1: 2 });
    expect(refRect('C:C', sheet)).toEqual({ c0: 2, r0: 0, c1: 2, r1: 2 });
    expect(refRect('2:2', sheet)).toEqual({ c0: 0, r0: 1, c1: 3, r1: 1 });
    expect(refRect('A2:A99', sheet)).toEqual({ c0: 0, r0: 1, c1: 0, r1: 2 });
    expect(refRect('Data!A1', sheet)).toBeNull();
    expect(refRect('Z1', sheet)).toBeNull();
  });
});

describe('sheet slide', () => {
  const deck = (body: string) => parse(`template: dev/sheet\n---\n[cover]\nHook\n---\n${body}`);
  it('headline, body, fence, note; numbered like code', () => {
    const { deck: d, warnings } = deck('[sheet]\nCari nama\nBody line\n```sheet\nD2 =XLOOKUP(C2;A2:A3;B2:B3)\nID | Nama | Cari | Hasil\nK01 | Rina | K01 | Rina\n```\nThe note');
    expect(warnings).toEqual([]);
    const s = d.slides[1]!;
    expect(s.type).toBe('sheet');
    expect(s.headlineSrc).toBe('Cari nama');
    expect(s.sheet!.formula!.name).toBe('D2');
    expect(s.badge).toBe(1);
    expect(JSON.stringify(s.note)).toContain('The note');
  });
  it('a --- inside the fence does not split the slide', () => {
    const { deck: d } = deck('[sheet]\nT\n```sheet\na | b\n---\n```');
    expect(d.slides).toHaveLength(2);
    expect(d.slides[1]!.sheet!.rows[1]).toEqual(['---', '']);
  });
  it('no fence → card + sheet-missing; bad lines → sheet-line on their line', () => {
    const a = deck('[sheet]\nT\nJust text');
    expect(a.deck.slides[1]!.type).toBe('card');
    expect(a.warnings.map((w) => w.code)).toEqual(['sheet-missing']);
    const b = deck('[sheet]\nT\n```sheet\nZ9 =A1\na | b\n```');
    expect(b.warnings.map((w) => w.code)).toEqual(['sheet-line']);
    expect(b.warnings[0]!.line).toBe(8); // the Z9 line
  });
});

describe('sheetGeometry', () => {
  it('fills the content width and sizes the panel from its rows', () => {
    const sheet = parseSheet(['D2 =XLOOKUP(C2;A2:A3;B2:B3)', ...ROWS]).sheet!;
    const g = sheetGeometry(sheet, fonts, fakeMeasurer);
    expect(g.truncated).toBe(false);
    expect(g.size).toBe(SHEET.cell.max);
    expect(SHEET.head.gutter + g.colW.reduce((a, b) => a + b, 0)).toBeLessThanOrEqual(CONTENT_W);
    expect(g.h).toBe(SHEET.bar.h + SHEET.bar.gap + SHEET.head.h + g.rowH * 3);
  });
  it('steps the cell size down, then cuts with … when still too wide', () => {
    const long = 'x'.repeat(40);
    const g = sheetGeometry(parseSheet([`${long} | ${long} | ${long}`]).sheet!, fonts, fakeMeasurer);
    expect(g.size).toBe(SHEET.cell.min);
    expect(g.truncated).toBe(true);
    expect(g.texts[0]![0]!.endsWith('…')).toBe(true);
  });
});
