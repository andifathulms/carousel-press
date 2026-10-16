// CC-CEDICT helpers for scripts/check-cedict.ts (Kosakata Mandarin, docs/channels.md §13).
// Pure: no file system. Format of a CC-CEDICT line:
//   謝謝 谢谢 [xie4 xie5] /to thank/thanks/thank you/
// https://cc-cedict.org/wiki/format:syntax

export interface CedictEntry {
  trad: string;
  simp: string;
  /** Numbered pinyin syllables as in the file, e.g. ["xie4", "xie5"]. */
  pinyin: string[];
  defs: string[];
}

const LINE = /^(\S+) (\S+) \[([^\]]*)\] \/(.*)\/\s*$/;

export function parseCedict(text: string): Map<string, CedictEntry[]> {
  const bySimp = new Map<string, CedictEntry[]>();
  for (const line of text.split('\n')) {
    if (!line || line.startsWith('#')) continue;
    const m = LINE.exec(line);
    if (!m) continue;
    const e: CedictEntry = { trad: m[1]!, simp: m[2]!, pinyin: m[3]!.split(' ').filter(Boolean), defs: m[4]!.split('/') };
    const list = bySimp.get(e.simp);
    if (list) list.push(e);
    else bySimp.set(e.simp, [e]);
  }
  return bySimp;
}

const MARKS: Record<string, string[]> = {
  a: ['ā', 'á', 'ǎ', 'à'], e: ['ē', 'é', 'ě', 'è'], i: ['ī', 'í', 'ǐ', 'ì'],
  o: ['ō', 'ó', 'ǒ', 'ò'], u: ['ū', 'ú', 'ǔ', 'ù'], ü: ['ǖ', 'ǘ', 'ǚ', 'ǜ'],
};

/** Tone number of a numbered syllable (5 = neutral). */
export function toneOf(syl: string): number {
  const d = /([1-5])$/.exec(syl);
  return d ? Number(d[1]) : 5;
}

/** "xie4" → "xiè", "lu:4" → "lǜ", "qi5" → "qi". Standard placement: a/e first, then the o of "ou", else the last vowel. */
export function markSyllable(syl: string): string {
  const tone = toneOf(syl);
  const base = syl.replace(/[1-5]$/, '').replace(/u:/g, 'ü').replace(/v/g, 'ü').toLowerCase();
  if (tone === 5) return base;
  let at = base.search(/[ae]/);
  if (at < 0) at = base.indexOf('ou');
  if (at < 0) {
    for (let i = base.length - 1; i >= 0; i--) if ('iouü'.includes(base[i]!)) { at = i; break; }
  }
  if (at < 0) return base;
  return base.slice(0, at) + MARKS[base[at]!]![tone - 1]! + base.slice(at + 1);
}

/** Lowercase, NFC, letters only: "Xièxie!" and "xiè xie" both → "xièxie". */
export function normPinyin(s: string): string {
  return s.normalize('NFC').toLowerCase().replace(/[^a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]/g, '');
}

/**
 * The accepted spellings of an entry: the dictionary's citation tones, plus the written tone
 * changes of 不 (bù → bú before a 4th tone) and 一 (yī → yí before a 4th tone, yì before 1st–3rd).
 */
export function acceptedPinyin(e: CedictEntry): string[] {
  const syls = e.pinyin.map((p) => p.toLowerCase());
  const chars = Array.from(e.simp);
  const citation = syls.map(markSyllable);
  const sandhi = syls.map((p, i) => {
    const next = syls[i + 1];
    if (!next || chars.length !== syls.length) return markSyllable(p);
    const nt = toneOf(next);
    if (chars[i] === '不' && p === 'bu4' && nt === 4) return 'bú';
    if (chars[i] === '一' && p === 'yi1') return nt === 4 ? 'yí' : nt >= 1 && nt <= 3 ? 'yì' : 'yī';
    return markSyllable(p);
  });
  return [...new Set([citation.join(''), sandhi.join('')])];
}

export interface CheckItem {
  /** Where it came from, e.g. "slide 3 word". */
  where: string;
  hanzi: string;
  pinyin: string | null;
}

export interface CheckResult extends CheckItem {
  /** `ok-chars`: no whole-word match, but every character's syllable is one of its CC-CEDICT readings. */
  status: 'ok' | 'ok-chars' | 'pinyin-mismatch' | 'not-found' | 'traditional';
  expected: string[];
  defs: string[];
}

/** Readings one character may be written with: its CC-CEDICT readings, the 一/不 tone changes, or neutral. */
function charReadings(ch: string, dict: Map<string, CedictEntry[]>): Set<string> {
  const out = new Set<string>();
  for (const e of dict.get(ch) ?? []) {
    if (e.pinyin.length !== 1) continue;
    out.add(markSyllable(e.pinyin[0]!.toLowerCase()));
    out.add(markSyllable(e.pinyin[0]!.toLowerCase().replace(/[1-5]$/, '5')));
  }
  if (ch === '一') for (const r of ['yī', 'yí', 'yì']) out.add(r);
  if (ch === '不') for (const r of ['bù', 'bú']) out.add(r);
  return out;
}

/** Per-character fallback: needs the pinyin written with one space-separated syllable per character. */
function charsMatch(hanzi: string, pinyin: string, dict: Map<string, CedictEntry[]>): boolean {
  const chars = Array.from(hanzi);
  const syls = pinyin.trim().split(/\s+/).map(normPinyin).filter(Boolean);
  if (chars.length < 2 || syls.length !== chars.length) return false;
  return chars.every((c, i) => charReadings(c, dict).has(syls[i]!));
}

export function checkItem(item: CheckItem, dict: Map<string, CedictEntry[]>, trad: Set<string>): CheckResult {
  const entries = dict.get(item.hanzi) ?? [];
  const isTrad = !entries.length && trad.has(item.hanzi);
  if (isTrad) return { ...item, status: 'traditional', expected: [], defs: [] };
  const expected = [...new Set(entries.flatMap(acceptedPinyin))];
  const defs = entries.flatMap((e) => e.defs.filter(Boolean)).slice(0, 6);
  if (entries.length && (item.pinyin === null || expected.includes(normPinyin(item.pinyin)))) return { ...item, status: 'ok', expected, defs };
  if (item.pinyin !== null && charsMatch(item.hanzi, item.pinyin, dict)) return { ...item, status: 'ok-chars', expected, defs };
  return { ...item, status: entries.length ? 'pinyin-mismatch' : 'not-found', expected, defs };
}

const HAN = /\p{Script=Han}+/gu;

/** Every run of hanzi in a string (for example sentences: each character must exist in the dictionary). */
export function hanziRuns(s: string): string[] {
  return s.match(HAN) ?? [];
}
