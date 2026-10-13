import type { Slide, Warning } from './types';
export declare const WORD_FIELDS: readonly ["word", "ipa", "say", "pos", "tag", "meaning", "example", "translation", "origin", "note"];
export declare const COMPARE_FIELDS: readonly ["wrong", "right", "why", "wrong-label", "right-label", "headline"];
export declare const TABLE: {
    minCols: number;
    maxCols: number;
    maxRows: number;
};
export type Warn = (code: Warning['code'], message: string, line?: number, hard?: boolean) => void;
export interface Line {
    text: string;
    line: number;
}
/** Read `key: value` lines. Unknown keys and non-field lines warn and are skipped. */
export declare function readFields(content: readonly Line[], keys: readonly string[], warn: Warn): Record<string, string>;
export declare function fillWord(slide: Slide, content: readonly Line[], warn: Warn): void;
export declare function fillCompare(slide: Slide, content: readonly Line[], warn: Warn): void;
/** Split `| a | b |` into cells. `\|` stays escaped (parseInline turns it into a pipe). */
export declare function splitRow(src: string): string[];
/** Table body: lines starting with `|` are rows (first = header), the rest after the table is the note. */
export declare function fillTable(slide: Slide, content: readonly Line[], warn: Warn): void;
/**
 * Code points the bundled IPA face (Gentium Book Plus: latin, latin-ext and
 * greek subsets) covers, from its @fontsource unicode-range declarations.
 */
export declare const IPA_RANGES: readonly [number, number][];
/** Characters in `text` the IPA face can't draw (deduplicated). */
export declare function uncoveredIpa(text: string): string[];
