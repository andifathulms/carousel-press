import type { CodeLineSrc } from '../../layout/codeFit';
import type { Token } from './types';
export type { Token, TokenKind } from './types';
/** Tokens for one prepared code line, prompt included. Unknown language → plain text. */
export declare function highlightLine(line: CodeLineSrc, lang: string): Token[];
