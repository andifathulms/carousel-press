import { type Token, merge } from './types';

// Spreadsheet formulas (Excel, Google Sheets): functions, cell references, strings, numbers.
// Works with both argument separators (`,` and `;`) and decimal commas inside numbers.

const SHEET = "(?:(?:'[^']+'|[A-Za-z_][A-Za-z0-9_.]*)!)?";
const CELL = '\\$?[A-Za-z]{1,3}\\$?\\d+';
const REF = new RegExp(
  `^${SHEET}(?:${CELL}(?::${CELL})?|\\$?[A-Za-z]{1,3}:\\$?[A-Za-z]{1,3}(?![A-Za-z0-9_(])|\\$?\\d+:\\$?\\d+)`,
);
const BOOL = new Set(['TRUE', 'FALSE', 'BENAR', 'SALAH']);

export function tokenizeExcel(line: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  while (i < line.length) {
    const rest = line.slice(i);
    const prev = i > 0 ? line[i - 1]! : '';
    if (rest[0] === '"') {
      // Excel escapes a quote by doubling it.
      let j = 1;
      while (j < rest.length) {
        if (rest[j] === '"' && rest[j + 1] === '"') j += 2;
        else if (rest[j] === '"') { j++; break; } else j++;
      }
      out.push({ text: rest.slice(0, j), kind: 'string' });
      i += j;
      continue;
    }
    if (rest[0] === '#') {
      const err = /^#(?:N\/A|VALUE!|REF!|NAME\?|DIV\/0!|NUM!|NULL!|SPILL!|CALC!)/i.exec(rest);
      if (err) {
        out.push({ text: err[0], kind: 'keyword' });
        i += err[0].length;
        continue;
      }
    }
    const word = /^[A-Za-z_][A-Za-z0-9_.]*/.exec(rest);
    if (word && /^\s*\(/.test(line.slice(i + word[0].length))) {
      out.push({ text: word[0], kind: 'fn' });
      i += word[0].length;
      continue;
    }
    const ref = /[A-Za-z0-9_$.]/.test(prev) ? null : REF.exec(rest);
    if (ref) {
      out.push({ text: ref[0], kind: 'subcommand' });
      i += ref[0].length;
      continue;
    }
    if (word) {
      out.push({ text: word[0], kind: BOOL.has(word[0].toUpperCase()) ? 'keyword' : 'text' });
      i += word[0].length;
      continue;
    }
    const num = /^\d+(?:[.,]\d+)?%?/.exec(rest);
    if (num && !/[A-Za-z_$]/.test(prev)) {
      // "1,5" is a decimal only in a `;` formula; with `,` separators the comma splits arguments.
      const text = line.includes(';') ? num[0] : (/^\d+(?:\.\d+)?%?/.exec(rest)?.[0] ?? num[0]);
      out.push({ text, kind: 'number' });
      i += text.length;
      continue;
    }
    const c = line[i]!;
    out.push({ text: c, kind: /\s/.test(c) ? 'text' : 'punct' });
    i++;
  }
  return merge(out);
}
