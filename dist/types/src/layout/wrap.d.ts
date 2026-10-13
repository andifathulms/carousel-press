import type { Rich, RichLine, RunStyle } from '../core/types';
import type { FontSpec, TextMeasurer } from './measure';
/** Inline-code pill (DESIGN §3.5): mono at 0.9×, padding 6×10, radius 8. */
export declare const PILL: {
    scale: number;
    padX: number;
    padY: number;
    radius: number;
};
/** Extra gap between paragraphs, as a multiple of the font size. */
export declare const PARA_GAP = 0.6;
export interface TextStyle {
    font: FontSpec;
    mono: {
        family: string;
        weight: number;
    };
}
interface Piece {
    text: string;
    style: RunStyle;
}
type Word = Piece[];
export interface PlacedRun {
    text: string;
    style: RunStyle;
    x: number;
    w: number;
}
export interface WrappedLine {
    runs: PlacedRun[];
    width: number;
    /** First line of a paragraph other than the first one (gets PARA_GAP above). */
    paraStart: boolean;
}
export interface WrapResult {
    lines: WrappedLine[];
    /** A word was wider than the region and had to be broken by characters. */
    charBroken: boolean;
}
export declare function monoFont(style: TextStyle): FontSpec;
export declare function pieceWidth(p: Piece, style: TextStyle, m: TextMeasurer): number;
/** Split a hard line into words. Code spans never split at spaces. */
export declare function toWords(line: RichLine): Word[];
/**
 * Greedy word wrap of rich text. Optionally fixes one-word last lines in
 * headlines (moves one word down when the previous line has 3+ words).
 */
export declare function wrapRich(rich: Rich, maxWidth: number, style: TextStyle, m: TextMeasurer, opts?: {
    widowFix?: boolean;
}): WrapResult;
/** Height of wrapped text: n line boxes plus paragraph gaps. */
export declare function textHeight(lines: readonly WrappedLine[], size: number, lh: number): number;
/** Baseline y of each line, given the block top (first baseline at top + 0.92·size). */
export declare function baselines(lines: readonly WrappedLine[], top: number, size: number, lh: number): number[];
export {};
