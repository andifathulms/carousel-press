import type { IconName } from '../core/iconNames';
import type { Ctx } from './ctx';
/**
 * Original line icons on a 24×24 grid (authored for Carousel Press).
 * Drawn as strokes: width 1.5 on the grid, round caps and joins.
 */
export declare const ICON_PATHS: Record<IconName, string>;
/** Draw an icon into a size×size box with its top-left at (x, y). */
export declare function drawIcon(ctx: Ctx, name: IconName, x: number, y: number, size: number, color: string): void;
