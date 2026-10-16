// Pinyin (SPEC-script §5.3). Pure: no DOM. The parser keeps pinyin as typed; these functions derive
// the drawn form. Tone sandhi is never applied: what's written is what's drawn.
import SYLLABLES from './pinyinSyllables.json';

/** Toneless base syllables (~410), from CC-CEDICT readings. Data, not a dictionary. */
export const PINYIN_SYLLABLES: ReadonlySet<string> = new Set(SYLLABLES as string[]);

const MARKS: Record<string, string[]> = {
  a: ['ā', 'á', 'ǎ', 'à'], e: ['ē', 'é', 'ě', 'è'], i: ['ī', 'í', 'ǐ', 'ì'],
  o: ['ō', 'ó', 'ǒ', 'ò'], u: ['ū', 'ú', 'ǔ', 'ù'], ü: ['ǖ', 'ǘ', 'ǚ', 'ǜ'],
};
/** Marked vowel → [plain vowel, tone]. */
const UNMARK = new Map<string, [string, number]>();
for (const [v, list] of Object.entries(MARKS)) list.forEach((m, i) => {
  UNMARK.set(m, [v, i + 1]);
  UNMARK.set(m.toUpperCase(), [v.toUpperCase(), i + 1]);
});
// ê with tone marks (rare) still counts as a marked e.
for (const [m, t] of [['ê̄', 1], ['ế', 2], ['ê̌', 3], ['ề', 4]] as const) UNMARK.set(m, ['ê', t]);

/** Place a tone mark on a plain syllable: a/e first, then the o of "ou", else the last vowel (incl. ü). */
export function placeMark(base: string, tone: number): string {
  if (tone < 1 || tone > 4) return base;
  const lower = base.toLowerCase();
  let at = lower.search(/[ae]/);
  if (at < 0) at = lower.indexOf('ou');
  if (at < 0) for (let i = lower.length - 1; i >= 0; i--) if ('iouü'.includes(lower[i]!)) { at = i; break; }
  if (at < 0) return base;
  const ch = base[at]!;
  const marked = MARKS[ch.toLowerCase()]![tone - 1]!;
  return base.slice(0, at) + (ch === ch.toUpperCase() && ch !== ch.toLowerCase() ? marked.toUpperCase() : marked) + base.slice(at + 1);
}

/** "xie4 xie5" → "xiè xie", "lu:4" / "lv4" → "lǜ". Text without tone numbers is returned unchanged. */
export function normalizePinyin(text: string): string {
  return text.replace(/([A-Za-zÜü:]+?)([1-5])(?![0-9])/g, (whole, letters: string, d: string) => {
    if (!/^[A-Za-zÜü]+(?::[A-Za-z]*)?$/.test(letters)) return whole;
    const base = letters.replace(/u:/g, 'ü').replace(/U:/g, 'Ü').replace(/v/g, 'ü').replace(/V/g, 'Ü');
    return placeMark(base, Number(d));
  });
}

/** Strip tone marks: [plain text, tone (5 = neutral), number of marks]. */
export function unmark(syl: string): { plain: string; tone: number; marks: number } {
  let tone = 5;
  let marks = 0;
  let plain = '';
  for (const ch of syl.normalize('NFC')) {
    const u = UNMARK.get(ch);
    if (u) { plain += u[0]; tone = u[1]; marks++; } else plain += ch;
  }
  return { plain, tone, marks };
}

export interface Syllable {
  text: string;
  tone: number;
}

const MAX_SYL = 6;

/** Segment one token ("xièxie") into syllables using the table; null when it can't be segmented. */
function segment(token: string): Syllable[] | null {
  const lower = token.toLowerCase();
  const n = lower.length;
  // best[i] = fewest syllables covering lower[i..]
  const best: (Syllable[] | null)[] = Array(n + 1).fill(null);
  best[n] = [];
  for (let i = n - 1; i >= 0; i--) {
    for (let len = Math.min(MAX_SYL, n - i); len >= 1; len--) {
      const rest = best[i + len];
      if (!rest) continue;
      const piece = token.slice(i, i + len);
      const u = unmark(piece);
      if (u.marks > 1 || !PINYIN_SYLLABLES.has(u.plain.toLowerCase())) continue;
      const cand = [{ text: piece, tone: u.tone }, ...rest];
      if (!best[i] || cand.length < best[i]!.length) best[i] = cand;
    }
  }
  return best[0] ?? null;
}

const TOKENS = /[A-Za-zÀ-ɏ̀-ͯ:]+/gu;

/** Syllables of a pinyin string (marks or numbers), plus the tokens that aren't valid pinyin. */
export function pinyinSyllables(text: string): { syllables: Syllable[]; invalid: string[] } {
  const norm = normalizePinyin(text).normalize('NFC');
  const syllables: Syllable[] = [];
  const invalid: string[] = [];
  for (const tok of norm.match(TOKENS) ?? []) {
    const seg = segment(tok);
    if (seg) syllables.push(...seg);
    else invalid.push(tok);
  }
  return { syllables, invalid };
}

/** Hanzi in a value, without CJK punctuation or fullwidth forms ("你好！" → 2). */
export function hanziChars(text: string): string[] {
  return Array.from(text).filter((ch) => /\p{Script=Han}/u.test(ch));
}
