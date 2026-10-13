import type { Ctx } from './ctx';
/** DESIGN §3.7 */
export declare const BLOB: {
    points: number;
    angleJitterDeg: number;
    radiusJitter: number;
    tension: number;
    a: {
        cx: number;
        cy: number;
        spread: number;
        rMin: number;
        rMax: number;
        rMinBig: number;
        rMaxBig: number;
    };
    b: {
        cx: number;
        cyMin: number;
        cyMax: number;
        rMin: number;
        rMax: number;
        chance: number;
    };
};
export interface Pt {
    x: number;
    y: number;
}
/** Seeded points around a centre. */
export declare function blobPoints(rng: () => number, cx: number, cy: number, r: number): Pt[];
/** Closed Catmull-Rom spline through the points, as cubic Béziers. */
export declare function traceBlob(ctx: Ctx, pts: readonly Pt[], tension?: number): void;
/** Blob A (bottom-right) and optionally blob B (top-right). Drawn before any text. */
export declare function drawBlobs(ctx: Ctx, rng: () => number, color: string, big: boolean): void;
