import { type Token } from './types';
/**
 * bash/sh tokenizer (DESIGN §6.4). `continuation` = the previous line ended
 * with a backslash, so this line has no command word.
 */
export declare function tokenizeBash(line: string, continuation?: boolean): Token[];
