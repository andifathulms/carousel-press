import type { Rich } from '../../core/types';
import type { FontSpec, TextMeasurer } from '../../layout/measure';
import { type TextStyle, type WrappedLine } from '../../layout/wrap';
import type { Box } from '../../render/safezone';
/** IPA face (SPEC-lexicon §3.1). Bundled for every family. */
export declare const IPA_FACE = "Gentium Book Plus";
/** Positioned drawing primitives. Colours are resolved at layout time. */
export type LexEl = {
    k: 'text';
    x: number;
    y: number;
    lines: WrappedLine[];
    size: number;
    lh: number;
    style: TextStyle;
    color: string;
    accent: string;
    /** Accent runs get a marker of this colour behind them and are drawn in `color`. */
    highlight?: string;
    /** Strike through each line (compare: wrong). */
    strike?: boolean;
    /** Centre each line in [x, x + centerW] (ayah slides). */
    centerW?: number;
} | {
    /** Arabic lines drawn right-to-left, verbatim. `widths` excludes the end-of-ayah mark. */
    k: 'arabic';
    x: number;
    y: number;
    w: number;
    lines: string[];
    widths: number[];
    size: number;
    lh: number;
    /** First baseline below each line's top, in em (room for the marks above). */
    baseline: number;
    family: string;
    color: string;
    align: 'center' | 'right';
    mark: {
        text: string;
        w: number;
        gap: number;
        color: string;
    } | null;
} | {
    k: 'star';
    cx: number;
    cy: number;
    size: number;
    color: string;
    width: number;
} | {
    k: 'label';
    x: number;
    y: number;
    text: string;
    font: FontSpec;
    color: string;
    tracking: number;
} | {
    k: 'pill';
    x: number;
    y: number;
    w: number;
    h: number;
    text: string;
    font: FontSpec;
    color: string;
    tracking: number;
    padX: number;
} | {
    k: 'badge';
    x: number;
    y: number;
    w: number;
    h: number;
    text: string;
    font: FontSpec;
    bg: string;
    ink: string;
    radius: number;
} | {
    k: 'rect';
    x: number;
    y: number;
    w: number;
    h: number;
    fill: string;
    radius: number;
} | {
    k: 'frame';
    x: number;
    y: number;
    w: number;
    h: number;
    stroke: string;
    width: number;
    radius: number;
} | {
    k: 'clip';
    x: number;
    y: number;
    w: number;
    h: number;
    radius: number;
} | {
    k: 'unclip';
} | {
    k: 'icon';
    name: 'x-circle' | 'check-circle';
    x: number;
    y: number;
    size: number;
    color: string;
};
export interface LexLayout {
    els: LexEl[];
    bottom: number;
    overflow: boolean;
}
/** A sized text spec: max → min in steps. */
export interface Sized {
    max: number;
    min: number;
    step: number;
}
/** Mutable font sizes keyed by block name, stepped down in a priority order until the stack fits. */
export declare class SizeSet {
    private sizes;
    private specs;
    private cursor;
    constructor(specs: Record<string, Sized>);
    get(k: string): number;
    /** Step the next block in `order` (round-robin) that can still shrink. False when none can. */
    stepDown(order: readonly string[], first?: string): boolean;
    private canStep;
    private step;
}
/** Wrap rich text and measure it. */
export declare function wrapBlock(rich: Rich, width: number, style: TextStyle, lh: number, m: TextMeasurer): {
    lines: WrappedLine[];
    h: number;
    w: number;
    charBroken: boolean;
};
/** Width of tracked text. */
export declare function trackedW(text: string, font: FontSpec, tracking: number, m: TextMeasurer): number;
/** Safe-zone boxes for every element that carries meaning. */
export declare function lexBoxes(els: readonly LexEl[]): Box[];
/** Shift every element down by `dy`. */
export declare function shiftEls(els: LexEl[], dy: number): void;
/** Rich text for a raw string drawn verbatim (no inline rules), e.g. IPA. */
export declare function plainRich(text: string): Rich;
