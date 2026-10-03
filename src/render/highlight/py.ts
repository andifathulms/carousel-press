import { tokenizeCLike } from './clike';
import type { Token } from './types';

const KEYWORDS = new Set(
  'def class return if elif else for while import from as with try except raise lambda None True False and or not in is pass'.split(' '),
);

export function tokenizePy(line: string): Token[] {
  return tokenizeCLike(line, {
    keywords: KEYWORDS, lineComment: ['#'], quotes: ['"""', "'''", '"', "'"], fnCalls: true,
  });
}
