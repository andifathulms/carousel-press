// Hanzi line breaking with kinsoku (SPEC-script §5.2). Pure given a measurer.
import type { FontSpec, TextMeasurer } from './measure';

/** No line may start with these (and their fullwidth forms, which are listed). */
export const NO_START = new Set(Array.from('。，、；：？！）」』》〉】〕…—·%.,;:?!)]}％'));
/** No line may end with these. */
export const NO_END = new Set(Array.from('（「『《〈【〔([{'));

const HAN_UNIT = /[\p{Script=Han}　-〿＀-￯…—·]/u;

/** Break units: one per hanzi/CJK punctuation, whole Latin words, single spaces. */
export function hanUnits(text: string): string[] {
  const units: string[] = [];
  let word = '';
  const flush = (): void => { if (word) { units.push(word); word = ''; } };
  for (const ch of text) {
    if (HAN_UNIT.test(ch) || ch === ' ') { flush(); units.push(ch); } else word += ch;
  }
  flush();
  return units;
}

export interface HanWrap {
  lines: string[];
  widths: number[];
  /** [first unit, last unit + 1] per line (for per-character highlights and colours). */
  ranges: [number, number][];
  units: string[];
  /** Every unit fits the width on its own. */
  fits: boolean;
}

/** Greedy wrap, then push-in: a line never starts with NO_START or ends with NO_END. Spaces at line ends are dropped. */
export function wrapHan(text: string, font: FontSpec, width: number, m: TextMeasurer): HanWrap {
  const units = hanUnits(text);
  const w = (a: number, b: number): number => m.width(units.slice(a, b).join(''), font);
  const ranges: [number, number][] = [];
  let fits = true;
  let start = 0;
  while (start < units.length) {
    while (start < units.length && units[start] === ' ') start++;
    if (start >= units.length) break;
    let end = start + 1;
    if (w(start, end) > width) fits = false;
    while (end < units.length && w(start, end + 1) <= width) end++;
    if (end < units.length) {
      // Push-in: pull characters down while the break violates kinsoku (keep at least one unit).
      const bad = (e: number): boolean => e < units.length && (NO_START.has(units[e]!) || NO_END.has(units[e - 1]!));
      let e = end;
      while (e - 1 > start && bad(e)) e--;
      if (bad(e)) {
        // Push-in impossible (a line this narrow holds ~1 unit): hang the punctuation on this line instead.
        e = end;
        while (bad(e)) e++;
      }
      end = e;
    }
    let last = end;
    while (last > start && units[last - 1] === ' ') last--;
    ranges.push([start, last]);
    start = end;
  }
  const lines = ranges.map(([a, b]) => units.slice(a, b).join(''));
  return { lines, widths: ranges.map(([a, b]) => w(a, b)), ranges, units, fits };
}
