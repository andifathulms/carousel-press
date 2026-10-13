import type { Ctx } from './ctx';
import { type FontSpec } from '../layout/measure';
import { type TextStyle, type WrappedLine } from '../layout/wrap';
export interface TextColors {
    text: string;
    accent: string;
    codeBg: string;
    codeText: string;
}
/** Soft shadow for text on photos (DESIGN §3.5). */
export declare const PHOTO_SHADOW: {
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
};
export declare function setShadow(ctx: Ctx, on: boolean): void;
export declare function setFont(ctx: Ctx, f: FontSpec): void;
/** Draw text glyph by glyph with extra tracking (no ctx.letterSpacing). Returns the advance. */
export declare function drawTracked(ctx: Ctx, text: string, x: number, y: number, trackingPx: number): number;
/** Width of tracked text in the current font. */
export declare function trackedWidth(ctx: Ctx, text: string, trackingPx: number): number;
/**
 * Code fonts (JetBrains Mono) join `===`, `=>`, `!=` into single glyphs, which beginners misread,
 * and canvas has no switch to turn ligatures off. Text with a joinable pair is drawn one character
 * at a time, so every character stays visible (Oct 2026 review).
 */
export declare function fillUnjoined(ctx: Pick<Ctx, 'fillText' | 'measureText'>, text: string, x: number, y: number): void;
/** Draw wrapped rich lines with their top at `top`. With `centerW`, each line is centred in [x, x + centerW]. */
export declare function drawWrapped(ctx: Ctx, lines: readonly WrappedLine[], x0: number, top: number, size: number, lh: number, style: TextStyle, colors: TextColors, centerW?: number): void;
/** Truncate with "…" in the current font so the text fits maxWidth. */
export declare function truncateToWidth(ctx: Ctx, text: string, maxWidth: number): string;
