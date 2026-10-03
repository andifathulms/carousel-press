import { type Token, merge, readString } from './types';

export interface CLikeRules {
  keywords: Set<string>;
  caseInsensitive?: boolean;
  lineComment: string[];
  blockComment?: [string, string];
  quotes: string[];
  /** identifier followed by `(` → fn */
  fnCalls: boolean;
}

/** A small, line-based tokenizer shared by js/ts, py and sql. */
export function tokenizeCLike(line: string, rules: CLikeRules): Token[] {
  const out: Token[] = [];
  let i = 0;
  while (i < line.length) {
    const rest = line.slice(i);
    const lc = rules.lineComment.find((p) => rest.startsWith(p));
    if (lc) {
      out.push({ text: rest, kind: 'comment' });
      break;
    }
    if (rules.blockComment && rest.startsWith(rules.blockComment[0])) {
      const close = line.indexOf(rules.blockComment[1], i + 2);
      const end = close < 0 ? line.length : close + rules.blockComment[1].length;
      out.push({ text: line.slice(i, end), kind: 'comment' });
      i = end;
      continue;
    }
    const q = rules.quotes.find((p) => rest.startsWith(p));
    if (q) {
      const end = readString(line, i, q);
      out.push({ text: line.slice(i, end), kind: 'string' });
      i = end;
      continue;
    }
    const num = /^(0x[0-9a-fA-F]+|\d+(\.\d+)?)/.exec(rest);
    if (num && (i === 0 || !/[A-Za-z_]/.test(line[i - 1]!))) {
      out.push({ text: num[0], kind: 'number' });
      i += num[0].length;
      continue;
    }
    const id = /^[A-Za-z_$][A-Za-z0-9_$]*/.exec(rest);
    if (id) {
      const w = id[0];
      const key = rules.caseInsensitive ? w.toUpperCase() : w;
      let kind: Token['kind'] = 'text';
      if (rules.keywords.has(key)) kind = 'keyword';
      else if (rules.fnCalls && /^\s*\(/.test(line.slice(i + w.length))) kind = 'fn';
      out.push({ text: w, kind });
      i += w.length;
      continue;
    }
    const c = line[i]!;
    out.push({ text: c, kind: /\s/.test(c) ? 'text' : 'punct' });
    i++;
  }
  return merge(out);
}
