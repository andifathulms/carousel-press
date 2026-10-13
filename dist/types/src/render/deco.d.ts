import type { Ctx } from './ctx';
/** DESIGN §6.1 decoration constants. */
export declare const DECO: {
    dotGrid: {
        spacing: number;
        r: number;
    };
    glow: {
        x: number;
        y: number;
        r: number;
    };
    scanlines: {
        every: number;
        h: number;
        color: string;
    };
    bigGlyph: {
        size: number;
        weight: number;
        alpha: number;
        right: number;
        baseline: number;
    };
};
export declare function drawDotGrid(ctx: Ctx, color: string): void;
export declare function drawGlow(ctx: Ctx, accent: string, alpha: number): void;
export declare function drawScanlines(ctx: Ctx): void;
/** Big faint glyph bleeding off the bottom-right. */
export declare function drawBigGlyph(ctx: Ctx, glyph: string, mono: string, ink: string): void;
