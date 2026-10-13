import type { Warning } from '../../core/types';
import type { TextMeasurer } from '../../layout/measure';
import type { LexTokens, Surface, Variant } from '../types';
import { type LexEl, type LexLayout, SizeSet } from './lexLayout';
export interface LexCtx {
    v: Variant;
    s: Surface;
    tok: LexTokens;
    m: TextMeasurer;
    lang: 'id' | 'en';
    serif: string;
    sans: string;
    slideIndex: number;
    line: number;
    warnings: Warning[];
}
/** Word slide type scale and gaps (SPEC-lexicon §4.1). */
export declare const WORD: {
    top: number;
    pill: {
        size: number;
        weight: number;
        tracking: number;
        padX: number;
        padY: number;
        border: number;
        gap: number;
    };
    head: {
        max: number;
        min: number;
        step: number;
        lh: number;
        maxLines: number;
        gap: number;
        descent: number;
    };
    tag: {
        size: number;
        weight: number;
        padX: number;
        padY: number;
        radius: number;
        gap: number;
    };
    ipa: {
        max: number;
        min: number;
        step: number;
        lh: number;
        gap: number;
    };
    say: {
        max: number;
        min: number;
        step: number;
        lh: number;
        gap: number;
    };
    label: {
        size: number;
        weight: number;
        tracking: number;
        gap: number;
    };
    divider: {
        h: number;
        gap: number;
    };
    meaning: {
        max: number;
        min: number;
        step: number;
        lh: number;
        maxLines: number;
        gap: number;
    };
    example: {
        max: number;
        min: number;
        step: number;
        lh: number;
        maxLines: number;
        bar: number;
        indent: number;
        gap: number;
    };
    translation: {
        max: number;
        min: number;
        step: number;
        lh: number;
        maxLines: number;
        gap: number;
    };
    origin: {
        max: number;
        min: number;
        step: number;
        lh: number;
        gap: number;
    };
    note: {
        max: number;
        min: number;
        step: number;
        lh: number;
        maxLines: number;
    };
    priority: string[];
};
/** Compare slide (SPEC-lexicon §4.3). */
export declare const COMPARE: {
    top: number;
    headline: {
        max: number;
        min: number;
        step: number;
        lh: number;
        maxLines: number;
        gap: number;
    };
    box: {
        pad: number;
        radius: number;
        icon: number;
        iconGap: number;
        gapBetween: number;
        rowGap: number;
    };
    label: {
        size: number;
        weight: number;
        tracking: number;
    };
    text: {
        max: number;
        min: number;
        step: number;
        lh: number;
        maxLines: number;
    };
    why: {
        max: number;
        min: number;
        step: number;
        lh: number;
        maxLines: number;
        gap: number;
    };
    strike: number;
    priority: string[];
};
/** Word slide: pos pill, headword (+tag), ipa, say, divider, meaning, example, origin, note. */
export declare function layoutWord(c: LexCtx, f: Record<string, string>): LexLayout;
/** Compare slide: optional headline, wrong box, right box, why. */
export declare function layoutCompare(c: LexCtx, f: Record<string, string>): LexLayout;
/** Step sizes down (over-cap blocks first, then the priority order) until the stack fits. */
export declare function fit(build: () => {
    els: LexEl[];
    bottom: number;
    over: string | null;
}, sizes: SizeSet, order: readonly string[]): LexLayout;
