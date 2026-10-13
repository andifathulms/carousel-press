import type { Ctx } from '../../render/ctx';
import type { SlideLayout } from '../common';
/** Serene decoration (SPEC-ayah §4). Decorative only: nothing here carries meaning. */
export declare const SERENE_DECO: {
    frame: {
        inset: number;
        width: number;
        alpha: number;
        radius: number;
    };
};
export declare function drawSerene(ctx: Ctx, L: SlideLayout): void;
