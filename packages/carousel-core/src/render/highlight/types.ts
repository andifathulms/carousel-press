export type TokenKind =
  | 'text' | 'prompt' | 'command' | 'subcommand' | 'flag' | 'string'
  | 'comment' | 'number' | 'keyword' | 'fn' | 'punct';

export interface Token {
  text: string;
  kind: TokenKind;
}

/** Merge adjacent tokens of the same kind. */
export function merge(tokens: Token[]): Token[] {
  const out: Token[] = [];
  for (const t of tokens) {
    if (!t.text) continue;
    const last = out[out.length - 1];
    if (last && last.kind === t.kind) last.text += t.text;
    else out.push({ ...t });
  }
  return out;
}

/** Read a quoted string starting at i (unterminated → to end). Returns end index (exclusive). */
export function readString(s: string, i: number, quote: string): number {
  let j = i + quote.length;
  while (j < s.length) {
    if (s[j] === '\\' && quote !== "'") {
      j += 2;
      continue;
    }
    if (s.startsWith(quote, j)) return j + quote.length;
    j++;
  }
  return s.length;
}
