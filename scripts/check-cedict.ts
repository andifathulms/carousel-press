// npm run check:cedict -- <deck.txt> [more decks…] [--cedict data/cedict_ts.u8]
//
// Checks a Kosakata Mandarin deck against CC-CEDICT (docs/channels.md §13):
// - every [word] slide: `word:` (hanzi) must be a CC-CEDICT entry and `pinyin:` (or `ipa:`; tone marks or numbers
//   marks) must match its reading (written tone changes of 不 and 一 are accepted);
// - every [table] with a "Hanzi" and a "Pinyin" column: the same, row by row;
// - every other hanzi on the slide (examples): each character must exist in CC-CEDICT.
// `ok~` = no whole-word match, but each space-separated syllable is a reading of its character
// (e.g. 一个 yí gè, where CC-CEDICT writes the neutral ge5). It prints the English definitions next to each word so the Indonesian meaning can be checked
// by eye. Exit code 1 when anything fails.
//
// The data file is not in the repo (CC BY-SA 4.0, ~10 MB). Download it once:
//   curl -L -o /tmp/cedict.zip https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.zip
//   mkdir -p data && unzip -o /tmp/cedict.zip -d data      # → data/cedict_ts.u8 (git-ignored)
import { existsSync, readFileSync } from 'node:fs';
import { parse } from 'carousel-core/src/core/parser';
import { normalizePinyin } from 'carousel-core/src/core/pinyin';
import { type CheckItem, type CheckResult, checkItem, hanziRuns, parseCedict } from './cedict';

const args = process.argv.slice(2);
const at = args.indexOf('--cedict');
const dictPath = at >= 0 ? args[at + 1]! : 'data/cedict_ts.u8';
const decks = args.filter((_, i) => at < 0 || (i !== at && i !== at + 1));
if (!decks.length) {
  console.error('Usage: npm run check:cedict -- <deck.txt> [--cedict data/cedict_ts.u8]');
  process.exit(2);
}
if (!existsSync(dictPath)) {
  console.error(`CC-CEDICT not found at ${dictPath}. See the download steps at the top of scripts/check-cedict.ts.`);
  process.exit(2);
}

const raw = readFileSync(dictPath, 'utf8');
const dict = parseCedict(raw);
const trad = new Set<string>();
for (const list of dict.values()) for (const e of list) if (e.trad !== e.simp) trad.add(e.trad);
const chars = new Set<string>();
for (const k of dict.keys()) for (const c of k) chars.add(c);

let failed = 0;
for (const file of decks) {
  const source = readFileSync(file, 'utf8');
  const { deck } = parse(source);
  const srcLines = source.split(/\r?\n/);
  console.log(`\n${file}`);
  const items: CheckItem[] = [];
  const loose: { where: string; text: string }[] = [];
  for (const s of deck.slides) {
    const n = s.index + 1;
    if (s.type === 'word' && s.fields.word && hanziRuns(s.fields.word).length) {
      // `pinyin:` (SPEC-script, marks or tone numbers) wins over the older `ipa:` convention.
      const py = s.fields.pinyin ?? s.fields.ipa;
      items.push({ where: `slide ${n} word`, hanzi: s.fields.word.trim(), pinyin: py ? normalizePinyin(py.trim()) : null });
      for (const k of ['example', 'meaning', 'note', 'measure'] as const) if (s.fields[k]) loose.push({ where: `slide ${n} ${k}`, text: s.fields[k]! });
    } else if (s.type === 'table' && s.table) {
      const head = s.table.header.map((h) => h.toLowerCase());
      const hz = head.findIndex((h) => h.includes('hanzi'));
      const py = head.findIndex((h) => h.includes('pinyin'));
      s.table.rows.forEach((row, r) => {
        const cell = (i: number): string => (row[i] ?? '').replace(/\*/g, '').trim();
        if (hz >= 0 && cell(hz)) items.push({ where: `slide ${n} row ${r + 1}`, hanzi: cell(hz), pinyin: py >= 0 ? cell(py) : null });
      });
    } else {
      loose.push({ where: `slide ${n}`, text: srcLines.slice(s.lines[0], s.lines[1] + 1).join(' ') });
    }
  }
  const results: CheckResult[] = items.map((it) => checkItem(it, dict, trad));
  for (const r of results) {
    const good = r.status === 'ok' || r.status === 'ok-chars';
    const mark = r.status === 'ok' ? 'ok ' : good ? 'ok~' : 'FAIL';
    if (!good) failed++;
    const py = r.pinyin ?? '(no pinyin)';
    const extra = r.status === 'pinyin-mismatch' ? `  expected: ${r.expected.join(' or ')}`
      : r.status === 'ok' ? '' : r.status === 'ok-chars' ? '  (no whole-word entry with this reading; each character matches)' : `  ${r.status}`;
    console.log(`  ${mark} ${r.where}: ${r.hanzi} ${py}${extra}`);
    if (r.defs.length) console.log(`       CC-CEDICT: ${r.defs.join(' / ')}`);
  }
  for (const l of loose) {
    for (const run of hanziRuns(l.text)) {
      const missing = Array.from(run).filter((c) => !chars.has(c));
      if (missing.length) {
        failed++;
        console.log(`  FAIL ${l.where}: ${missing.join(' ')} not in CC-CEDICT${missing.some((c) => trad.has(c)) ? ' (traditional?)' : ''}`);
      }
    }
  }
  if (!results.length) console.log('  (no [word] or Hanzi/Pinyin table rows found)');
}
console.log(failed ? `\n${failed} problem(s).` : '\nAll checks passed.');
process.exit(failed ? 1 : 0);
