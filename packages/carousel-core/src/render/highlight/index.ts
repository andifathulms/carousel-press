import type { CodeLineSrc } from '../../layout/codeFit';
import { PROMPT, isShell } from '../../layout/codeFit';
import { tokenizeBash } from './bash';
import { tokenizeJs } from './js';
import { tokenizePy } from './py';
import { tokenizeSql } from './sql';
import { tokenizeExcel } from './excel';
import type { Token } from './types';

export type { Token, TokenKind } from './types';

/** Fence languages for spreadsheet formulas. */
export const EXCEL_LANGS = ['excel', 'xlsx', 'sheets', 'formula'];

/** Tokens for one prepared code line, prompt included. Unknown language → plain text. */
export function highlightLine(line: CodeLineSrc, lang: string): Token[] {
  const prompt: Token[] = line.prompt ? [{ text: PROMPT, kind: 'prompt' }] : [];
  const l = lang.toLowerCase();
  let body: Token[];
  if (isShell(l)) body = tokenizeBash(line.text, line.continuation);
  else if (['js', 'ts', 'javascript', 'typescript', 'jsx', 'tsx'].includes(l)) body = tokenizeJs(line.text);
  else if (l === 'py' || l === 'python') body = tokenizePy(line.text);
  else if (l === 'sql') body = tokenizeSql(line.text);
  else if (EXCEL_LANGS.includes(l)) body = tokenizeExcel(line.text);
  else body = [{ text: line.text, kind: 'text' }];
  return [...prompt, ...body];
}
