import type { Ctx, ImageSource } from './ctx';
export interface CoverRect {
    dx: number;
    dy: number;
    dw: number;
    dh: number;
}
/**
 * Cover crop with focal point (DESIGN §3.6): scale = max(W/iw, H/ih); offset
 * so the focal point lands at the canvas centre, clamped so the image always
 * covers the canvas.
 */
export declare function coverCrop(iw: number, ih: number, fx: number, fy: number, W?: number, H?: number): CoverRect;
/** Overlay strengths for a darkness value d ∈ [0, 1]. */
export declare function photoOverlay(d: number): {
    wash: number;
    stops: [number, number][];
};
export interface PhotoInput {
    image: ImageSource;
    width: number;
    height: number;
    focalX: number;
    focalY: number;
}
/** Draw the photo, the tint wash and the vertical gradient. darkness ∈ [0, 100]. */
export declare function drawPhoto(ctx: Ctx, photo: PhotoInput, darkness: number, tint: string): void;
