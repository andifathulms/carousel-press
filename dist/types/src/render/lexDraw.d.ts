import type { Ctx } from './ctx';
import type { SlideLayout } from '../templates/common';
/** Marker behind `*word*` (SPEC-lexicon §4.1): 6 px side padding, 0.62 × size tall, radius 6. */
export declare const MARKER: {
    padX: number;
    h: number;
    rise: number;
    radius: number;
};
/** Strike line through wrong text: 3 px through each line's middle. */
export declare const STRIKE: {
    w: number;
    rise: number;
};
/** Original 8-point star: two squares, one turned 45° (SPEC-ayah §4). */
export declare function drawStar(ctx: Ctx, cx: number, cy: number, size: number, color: string, width: number): void;
/** Draw word/table/compare elements. Header, footer and background are drawn by the family. */
export declare function drawLex(ctx: Ctx, L: SlideLayout): void;
