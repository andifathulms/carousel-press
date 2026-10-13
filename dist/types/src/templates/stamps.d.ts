import type { Slide, VerdictTone } from '../core/types';
import type { FontSpec, TextMeasurer } from '../layout/measure';
import type { StackItem } from '../layout/stack';
import type { Surface, Variant } from './types';
export declare const VERDICT: {
    size: number;
    border: number;
    padX: number;
    padY: number;
    radius: number;
    capHeight: number;
};
export declare const DIAGRAM: {
    h: number;
    radius: number;
    pad: number;
    line: {
        width: number;
        alpha: number;
        goal: number;
    };
    dot: {
        r: number;
        label: number;
        stroke: number;
    };
    ball: {
        r: number;
        ring: number;
    };
    offside: {
        width: number;
        dash: [number, number];
    };
    arrow: {
        width: number;
        dash: [number, number];
        head: number;
    };
    zoneAlpha: number;
    label: {
        size: number;
        weight: number;
        gap: number;
    };
};
/** The stamp's font: the variant's card-headline face and weight, so it is always loaded. */
export declare function verdictFont(v: Variant): FontSpec;
export declare function verdictItem(slide: Slide, v: Variant, m: TextMeasurer, gap: number): StackItem | null;
export declare function diagramItem(slide: Slide, gap: number): StackItem | null;
/** ok / warn / bad colour on a surface: semantic tokens when the variant has them, else derived. */
export declare function toneColor(v: Variant, s: Surface, tone: VerdictTone | undefined): string;
