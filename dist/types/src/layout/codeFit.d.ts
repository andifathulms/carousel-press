import type { TextMeasurer } from './measure';
export interface CodeLineSrc {
    /** Draw a `$ ` prompt before the text (bash/sh only). */
    prompt: boolean;
    /** Line text without the prompt. */
    text: string;
    /** Previous line ended with `\` (bash continuation). */
    continuation: boolean;
}
export declare const PROMPT = "$ ";
export declare function isShell(lang: string): boolean;
/**
 * Split code into lines and apply the bash prompt rule (DESIGN §6.4):
 * every non-empty, non-comment, non-continuation line gets `$ `; lines that
 * already start with `$ ` keep their single prompt.
 */
export declare function prepareCode(text: string, lang: string): CodeLineSrc[];
/** Visible text of a prepared line, prompt included (used for width measurement). */
export declare function lineText(l: CodeLineSrc): string;
export interface CodeSizes {
    max: number;
    min: number;
    step: number;
}
export interface CodeFit {
    /** Largest size whose widest line fits; `min` when nothing fits. */
    size: number;
    fits: boolean;
    /** Width of the widest line at `size`. */
    widest: number;
}
/** Width fit: largest size (max → min) at which the widest line ≤ innerWidth. Never wraps. */
export declare function fitCodeWidth(lines: readonly CodeLineSrc[], innerWidth: number, family: string, weight: number, sizes: CodeSizes, m: TextMeasurer): CodeFit;
