import type { Ctx } from '../../render/ctx';
import type { SlideLayout } from '../common';
/** Lexicon decoration (SPEC-lexicon §3.2). Decorative only: nothing here carries meaning. */
export declare const LEX_DECO: {
    doubleRule: {
        y: number;
        thick: number;
        thin: number;
        gap: number;
    };
    notebook: {
        from: number;
        to: number;
        every: number;
        h: number;
        marginX: number;
        marginW: number;
        alpha: number;
    };
    cornerGlyph: {
        size: number;
        alpha: number;
        x: number;
        baseline: number;
    };
};
/** Lexicon family: paper decoration, then the editorial drawing (which handles lexicon slides too). */
export declare function drawLexicon(ctx: Ctx, L: SlideLayout): void;
