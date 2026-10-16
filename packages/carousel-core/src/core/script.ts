// Script detection and run splitting (SPEC-script §2, §6). Pure: no DOM.

export type Script = 'arab' | 'han' | 'latin';

const ARAB: readonly [number, number][] = [[0x0600, 0x06ff], [0x0750, 0x077f], [0x08a0, 0x08ff], [0xfb50, 0xfdff], [0xfe70, 0xfeff]];
const HAN: readonly [number, number][] = [[0x4e00, 0x9fff], [0x3400, 0x4dbf], [0x3000, 0x303f], [0xff00, 0xffef]];

const inRanges = (cp: number, ranges: readonly [number, number][]): boolean => ranges.some(([a, b]) => cp >= a && cp <= b);

/** Characters that take the script of their neighbours: spaces, digits, punctuation, symbols, marks, joiners. */
const NEUTRAL = /[\s\d\p{P}\p{S}\p{M}‌‍ ]/u;

/** Script of one character, or null for neutrals. */
export function charScript(ch: string): Script | null {
  const cp = ch.codePointAt(0)!;
  // Arabic harakat and the Arabic comma/semicolon are marks/punctuation but belong to the Arabic run.
  if (inRanges(cp, ARAB)) return 'arab';
  // CJK punctuation and fullwidth forms count as hanzi (they need the CJK face), and so does every Han
  // character outside the BMP ranges (Extension B and up), so rare characters reach the CJK glyph check.
  if (inRanges(cp, HAN) || /\p{Script=Han}/u.test(ch)) return 'han';
  if (NEUTRAL.test(ch)) return null;
  return 'latin';
}

/** Script of a value: its first strong character (SPEC-script §2). No strong character → latin. */
export function detectScript(value: string): Script {
  for (const ch of value) {
    const s = charScript(ch);
    if (s) return s;
  }
  return 'latin';
}

export interface ScriptRun {
  text: string;
  script: Script;
}

/**
 * Split a value into script runs in logical order. Neutral characters join the previous run
 * (leading neutrals join the first strong run), so "كُتُب · kutub" → ["كُتُب · ", "kutub"].
 */
export function scriptRuns(value: string): ScriptRun[] {
  const runs: ScriptRun[] = [];
  let lead = '';
  for (const ch of value) {
    const s = charScript(ch);
    const last = runs[runs.length - 1];
    if (s === null) {
      if (last) last.text += ch;
      else lead += ch;
    } else if (last && last.script === s) last.text += ch;
    else {
      runs.push({ text: lead + ch, script: s });
      lead = '';
    }
  }
  if (lead) runs.push({ text: lead, script: 'latin' });
  return runs;
}

/** Arabic harakat (U+064B–0652) and the superscript alef (U+0670). */
const HARAKAT = /[ً-ْٰ]/;
const ARABIC_LETTER = /[ء-يٱ-ۓۺ-ۿݐ-ݿࢠ-ࣿ]/;

export function hasArabicLetters(value: string): boolean {
  return ARABIC_LETTER.test(value);
}

export function hasHarakat(value: string): boolean {
  return HARAKAT.test(value);
}

/**
 * The bundled Latin faces are @fontsource "latin" subsets (fonts/manifest.json). A Latin value with
 * any character outside this range goes to the transliteration face (SPEC-script §6.1, implementation
 * notes: stricter than "Latin-1 + Latin Extended-A" because Latin Extended-A isn't bundled).
 */
export const LATIN_SUBSET: readonly [number, number][] = [
  [0x0000, 0x00ff], [0x0131, 0x0131], [0x0152, 0x0153], [0x02bb, 0x02bc], [0x02c6, 0x02c6], [0x02da, 0x02da],
  [0x02dc, 0x02dc], [0x0304, 0x0304], [0x0308, 0x0308], [0x0329, 0x0329], [0x2000, 0x206f], [0x20ac, 0x20ac],
  [0x2122, 0x2122], [0x2191, 0x2191], [0x2193, 0x2193], [0x2212, 0x2212], [0x2215, 0x2215], [0xfeff, 0xfeff], [0xfffd, 0xfffd],
];

const EMOJI = /\p{Extended_Pictographic}|[\u{1f3fb}-\u{1f3ff}️]/u;

/** True when a Latin value needs the transliteration face (it has letters the latin subset lacks). Emoji don't count. */
export function needsTranslitFace(value: string): boolean {
  for (const ch of value) {
    const cp = ch.codePointAt(0)!;
    if (inRanges(cp, LATIN_SUBSET) || EMOJI.test(ch)) continue;
    if (charScript(ch) !== 'latin' && charScript(ch) !== null) continue;
    return true;
  }
  return false;
}
