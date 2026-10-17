import { describe, expect, it } from 'vitest';
import { parse } from 'carousel-core/src/core/parser';
import { keycapsItem, splitKeys } from 'carousel-core/src/templates/keycaps';
import { getVariant } from 'carousel-core/src/templates/registry';
import { layoutSlide } from 'carousel-core/src/render/renderSlide';

const fake = { width: (t: string, f: { size: number }) => t.length * f.size * 0.52 };
const body = (text: string) => parse(`template: dev/sheet\n---\n[card]\nJudul\n${text}`).deck.slides[0]!.body;

describe('keycaps (dev/sheet)', () => {
  it('reads "Ctrl + Shift + L: label" rows and keeps the text around them', () => {
    const s = splitKeys(body('Tiga yang paling sering:\nCtrl + Shift + L: Filter\nCtrl + T: Jadi tabel\nF4: Kunci sel\nWindows. Di Mac: Cmd.'))!;
    expect(s.rows).toEqual([
      { keys: ['Ctrl', 'Shift', 'L'], label: 'Filter' },
      { keys: ['Ctrl', 'T'], label: 'Jadi tabel' },
      { keys: ['F4'], label: 'Kunci sel' },
    ]);
    expect(s.pre.flat().map((l) => l.map((r) => r.text).join(''))).toEqual(['Tiga yang paling sering:']);
    expect(s.post.flat().map((l) => l.map((r) => r.text).join(''))).toEqual(['Windows. Di Mac: Cmd.']);
  });

  it('ignores ordinary sentences and formulas', () => {
    expect(splitKeys(body('Kolom A + B: dijumlah dulu.\n=A2+B2'))).toBeNull();
  });

  it('falls back to body text when a row cannot fit one line', () => {
    expect(keycapsItem([{ keys: ['Ctrl', 'Shift', 'L'], label: 'x'.repeat(90) }], getVariant('dev/sheet'), fake, 0)).toBeNull();
  });

  it('only dev/sheet draws keycaps', () => {
    for (const id of ['dev/sheet', 'dev/terminal']) {
      const d = parse(`template: ${id}\n---\n[card]\nShortcut\nCtrl + T: Jadi tabel\nCtrl + Shift + L: Filter`).deck;
      const L = layoutSlide(d.slides[0]!, d, getVariant(id), fake, null, false);
      expect(L.stack.placed.some((p) => p.item.kind === 'keycaps')).toBe(id === 'dev/sheet');
    }
  });
});
