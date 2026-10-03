import { type Token, merge, readString } from './types';

const SUBCOMMAND_TOOLS = new Set(['git', 'docker', 'npm', 'pnpm', 'yarn', 'kubectl', 'apt', 'brew', 'pip']);
const OPERATORS = ['&&', '||', '>>', '|', ';', '>'];

/**
 * bash/sh tokenizer (DESIGN §6.4). `continuation` = the previous line ended
 * with a backslash, so this line has no command word.
 */
export function tokenizeBash(line: string, continuation = false): Token[] {
  const out: Token[] = [];
  let i = 0;
  let wordIndex = continuation ? 2 : 0;
  let command = '';
  while (i < line.length) {
    const c = line[i]!;
    if (c === ' ' || c === '\t') {
      let j = i;
      while (j < line.length && (line[j] === ' ' || line[j] === '\t')) j++;
      out.push({ text: line.slice(i, j), kind: 'text' });
      i = j;
      continue;
    }
    if (c === '#' && (i === 0 || /\s/.test(line[i - 1]!))) {
      out.push({ text: line.slice(i), kind: 'comment' });
      break;
    }
    if (c === '"' || c === "'") {
      const end = readString(line, i, c);
      out.push({ text: line.slice(i, end), kind: 'string' });
      i = end;
      wordIndex++;
      continue;
    }
    if (c === '$') {
      const m = /^\$(\{[^}]*\}?|[A-Za-z_][A-Za-z0-9_]*|[0-9@#?*!$-])/.exec(line.slice(i));
      if (m) {
        out.push({ text: m[0], kind: 'flag' });
        i += m[0].length;
        continue;
      }
    }
    const op = OPERATORS.find((o) => line.startsWith(o, i));
    if (op) {
      out.push({ text: op, kind: 'punct' });
      i += op.length;
      if (op !== '>' && op !== '>>') {
        // A new command starts after a pipe or list operator, not after a redirect.
        wordIndex = 0;
        command = '';
      }
      continue;
    }
    if (c === '\\' && i === line.trimEnd().length - 1) {
      out.push({ text: line.slice(i), kind: 'punct' });
      break;
    }
    let j = i;
    while (j < line.length && !/[\s"'|;&>$]/.test(line[j]!)) j++;
    if (j === i) j = i + 1;
    const word = line.slice(i, j);
    let kind: Token['kind'] = 'text';
    if (word.startsWith('-')) kind = 'flag';
    else if (wordIndex === 0) {
      kind = 'command';
      command = word;
    } else if (wordIndex === 1 && SUBCOMMAND_TOOLS.has(command)) kind = 'subcommand';
    else if (/^\d+(\.\d+)?$/.test(word)) kind = 'number';
    out.push({ text: word, kind });
    wordIndex++;
    i = j;
  }
  return merge(out);
}
