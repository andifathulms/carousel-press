import { type Token } from './types';
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
export declare function tokenizeCLike(line: string, rules: CLikeRules): Token[];
