/** Any 2D context the renderer can draw on (visible or offscreen). */
export type Ctx = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
/** Anything drawImage accepts that also exposes a size. */
export type ImageSource = ImageBitmap | HTMLImageElement | HTMLCanvasElement | OffscreenCanvas;
/** Create a canvas of the given size, preferring OffscreenCanvas. */
export declare function makeCanvas(w: number, h: number): {
    canvas: OffscreenCanvas | HTMLCanvasElement;
    ctx: Ctx;
};
