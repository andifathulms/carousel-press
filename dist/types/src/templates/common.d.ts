import type { Deck, Rich, Slide, Warning } from '../core/types';
import type { PoolIcon } from '../core/iconNames';
import type { FontSpec, TextMeasurer } from '../layout/measure';
import type { StackResult } from '../layout/stack';
import { type Box } from '../render/safezone';
import type { Surface, Variant } from './types';
import type { LexLayout } from './lexicon/lexLayout';
export interface LayoutInput {
    slide: Slide;
    deck: Deck;
    variant: Variant;
    icon: PoolIcon | null;
    hasPhoto: boolean;
    measurer: TextMeasurer;
}
export interface HeaderLayout {
    handle: string;
    handleFont: FontSpec;
    right: {
        kind: 'rule';
        x1: number;
        x2: number;
        y: number;
        h: number;
    } | {
        kind: 'path';
        text: string;
        font: FontSpec;
    };
}
export interface FooterLayout {
    swipe: {
        text: string;
        arrow: boolean;
        leadIcon: 'circle-arrow' | null;
        font: FontSpec;
        w: number;
    } | null;
    /** null when the deck sets `counter: off`. */
    counter: {
        text: string;
        font: FontSpec;
        w: number;
    } | null;
}
export interface SlideLayout {
    slide: Slide;
    deck: Deck;
    variant: Variant;
    surface: Surface;
    surfaceName: string;
    onPhoto: boolean;
    stack: StackResult;
    icon: PoolIcon | null;
    ctaLabel: string | null;
    header: HeaderLayout;
    footer: FooterLayout;
    boxes: Box[];
    warnings: Warning[];
    /** word/table/compare/ayah/hadith slides: positioned elements (drawn instead of the stack). */
    lex?: LexLayout;
    /** Serene: every stack item and text line is centred (SPEC-ayah §3.3). */
    center?: boolean;
}
/** Shared header/footer/CTA metrics (DESIGN §3.1, §3.2, §3.8). */
export declare const CHROME: {
    handleSize: number;
    handleWeight: number;
    handleMax: number;
    pathSize: number;
    pathMax: number;
    pathTopicMax: number;
    rule: {
        x1: number;
        x2: number;
        y: number;
        h: number;
    };
    footerSize: number;
    counterSize: number;
    arrowSize: number;
    arrowGap: number;
    circleArrowSize: number;
    circleArrowGap: number;
    cta: {
        h: number;
        radius: number;
        padX: number;
        icon: number;
        gap: number;
        size: number;
        weight: number;
        gapBefore: number;
    };
};
/** Pick the slide's surface (DESIGN §4.2) and report unknown `surface=` names. */
export declare function resolveSurface(v: Variant, slide: Slide, hasPhoto: boolean, warnings: Warning[]): {
    surface: Surface;
    name: string;
    onPhoto: boolean;
};
/** Truncate text with "…" to fit maxWidth. */
export declare function truncate(text: string, maxWidth: number, font: FontSpec, m: TextMeasurer): string;
/**
 * Dev header path: the topic from the cover kicker ("GIT • UNDO" → "git"), so it reads like a real
 * folder and is never cut off. Falls back to the deck slug (Oct 2026 review).
 */
export declare function headerTopic(deck: Deck): string;
export declare function layoutHeader(input: LayoutInput, sans: string, mono: string, boxes: Box[]): HeaderLayout;
export declare function layoutFooter(input: LayoutInput, sans: string, mono: string, boxes: Box[], circleOnCover: boolean): FooterLayout;
/** CTA label for a slide, or null when the slide has no CTA. */
export declare function ctaLabel(slide: Slide, deck: Deck): string | null;
export declare function ctaWidth(label: string, sans: string, m: TextMeasurer): number;
/** Prepend an accent prefix (terminal `> `) to the first line of a headline. */
export declare function withPrefix(rich: Rich, prefix: string | undefined): Rich;
/**
 * Centre a stack that fits in the content band [bandTop, stackLimit] (owner, Oct 2026): short
 * slides no longer leave the lower half empty. Photo slides stay top-anchored (the photo gradient
 * is darkest at the top), and an overflowing stack is left where it is. Returns the shift applied.
 */
export declare function centerStack(stack: StackResult, bandTop: number, onPhoto: boolean): number;
/** Shift that centres a block spanning [top, bottom] in [bandTop, stackLimit], on the 8 px grid, never above bandTop. */
export declare function centeredShift(top: number, bottom: number, bandTop: number): number;
export declare function frameFrom(top: number): {
    x: number;
    width: number;
    top: number;
    limit: number;
};
/** Renderer warnings derived from a stack result. */
export declare function stackWarnings(slide: Slide, stack: StackResult): Warning[];
/** Boxes of every placed stack block. */
export declare function stackBoxes(stack: StackResult): Box[];
