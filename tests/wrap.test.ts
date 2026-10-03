import { describe, expect, it } from 'vitest';
import { fakeMeasurer as m } from '../src/layout/measure';
import { baselines, textHeight, wrapRich } from '../src/layout/wrap';
import { parseInline, parseRich } from '../src/core/inline';

const style = (size = 10) => ({
  font: { family: 'Poppins', weight: 400, size },
  mono: { family: 'JetBrains Mono', weight: 400 },
});
const text = (lines: { runs: { text: string }[] }[]) => lines.map((l) => l.runs.map((r) => r.text).join(' '));

// At size 10 each char is 5.2px wide; a space is 5.2px.
describe('wrapRich', () => {
  it('wraps greedily by words', () => {
    const r = wrapRich([parseInline('aaaa bbbb cccc dddd')], 52, style(), m);
    expect(text(r.lines)).toEqual(['aaaa bbbb', 'cccc dddd']);
    expect(r.charBroken).toBe(false);
  });
  it('keeps manual breaks and paragraph flags', () => {
    const r = wrapRich(parseRich(['a | b', '', 'c']), 500, style(), m);
    expect(text(r.lines)).toEqual(['a', 'b', 'c']);
    expect(r.lines.map((l) => l.paraStart)).toEqual([false, false, true]);
  });
  it('breaks a word wider than the region by characters', () => {
    const r = wrapRich([parseInline('abcdefghij')], 26, style(), m);
    expect(r.charBroken).toBe(true);
    expect(text(r.lines)).toEqual(['abcde', 'fghij']);
  });
  it('fixes a one-word last line when the previous has 3+ words', () => {
    // width fits 4 words of 2 chars (4*10.4 + 3*5.2 = 57.2)
    const plain = wrapRich([parseInline('aa bb cc dd ee')], 58, style(), m);
    expect(text(plain.lines)).toEqual(['aa bb cc dd', 'ee']);
    const fixed = wrapRich([parseInline('aa bb cc dd ee')], 58, style(), m, { widowFix: true });
    expect(text(fixed.lines)).toEqual(['aa bb cc', 'dd ee']);
  });
  it('does not widow-fix when the previous line is short', () => {
    const r = wrapRich([parseInline('aaaaaa bbbbbb c')], 70, style(), m, { widowFix: true });
    expect(text(r.lines)).toEqual(['aaaaaa bbbbbb', 'c']);
  });
  it('measures rich runs: accent in the body font, code in mono with pill padding', () => {
    const r = wrapRich([parseInline('ab *cd* `ef`')], 1000, style(), m);
    const runs = r.lines[0]!.runs;
    expect(runs.map((x) => x.style)).toEqual(['plain', 'accent', 'code']);
    expect(runs[1]!.w).toBeCloseTo(10.4);
    // mono at 0.9×10 = 9px → 2 × 9 × 0.6 = 10.8, plus 2 × 10 padding
    expect(runs[2]!.w).toBeCloseTo(30.8);
    expect(runs[2]!.x).toBeCloseTo(10.4 + 5.2 + 10.4 + 5.2);
  });
  it('treats accent glued to punctuation as one word', () => {
    const r = wrapRich([parseInline('say *hi*, ok')], 1000, style(), m);
    expect(r.lines[0]!.runs.map((x) => x.text)).toEqual(['say', 'hi', ',', 'ok']);
  });
  it('computes height and baselines with paragraph gaps', () => {
    const r = wrapRich(parseRich(['a', '', 'b']), 500, style(), m);
    expect(textHeight(r.lines, 10, 1.5)).toBeCloseTo(2 * 15 + 6);
    expect(baselines(r.lines, 100, 10, 1.5)).toEqual([109.2, 109.2 + 15 + 6]);
  });
});
