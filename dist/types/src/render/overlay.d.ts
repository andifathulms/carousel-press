import type { Ctx } from './ctx';
/** DESIGN §2.1–2.2 */
export declare const OVERLAY: {
    zoneFill: string;
    labelColor: string;
    labelSize: number;
    labelPad: number;
    safeStroke: string;
    safeWidth: number;
    safeDash: number[];
    test: {
        bg: string;
        grid: number;
        gridColor: string;
        major: number;
        majorColor: string;
        label: string;
    };
    baseline: string;
};
/** Translucent UI zones + dashed SAFE outline. Preview/test image only, never in exports. */
export declare function drawSafeOverlay(ctx: Ctx): void;
export declare function drawSafeOutline(ctx: Ctx): void;
/** 8 px baseline grid (debug toggle). */
export declare function drawBaselineGrid(ctx: Ctx): void;
/** The safe-zone test image the owner posts privately to check margins on a phone. */
export declare function drawTestImage(ctx: Ctx): void;
