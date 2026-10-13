export type TokenKind = 'text' | 'prompt' | 'command' | 'subcommand' | 'flag' | 'string' | 'comment' | 'number' | 'keyword' | 'fn' | 'punct';
export interface Token {
    text: string;
    kind: TokenKind;
}
/** Merge adjacent tokens of the same kind. */
export declare function merge(tokens: Token[]): Token[];
/** Read a quoted string starting at i (unterminated → to end). Returns end index (exclusive). */
export declare function readString(s: string, i: number, quote: string): number;
