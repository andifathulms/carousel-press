import { tokenizeCLike } from './clike';
import type { Token } from './types';

const KEYWORDS = new Set(
  'const let var function return if else for while import from export class new await async try catch throw'.split(' '),
);

export function tokenizeJs(line: string): Token[] {
  return tokenizeCLike(line, {
    keywords: KEYWORDS, lineComment: ['//'], blockComment: ['/*', '*/'], quotes: ['`', '"', "'"], fnCalls: true,
  });
}
