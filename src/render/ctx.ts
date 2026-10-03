/** Any 2D context the renderer can draw on (visible or offscreen). */
export type Ctx = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

/** Anything drawImage accepts that also exposes a size. */
export type ImageSource = ImageBitmap | HTMLImageElement | HTMLCanvasElement | OffscreenCanvas;

/** Create a canvas of the given size, preferring OffscreenCanvas. */
export function makeCanvas(w: number, h: number): { canvas: OffscreenCanvas | HTMLCanvasElement; ctx: Ctx } {
  if (typeof OffscreenCanvas !== 'undefined') {
    const canvas = new OffscreenCanvas(w, h);
    const ctx = canvas.getContext('2d');
    if (ctx) return { canvas, ctx };
  }
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D canvas not supported');
  return { canvas, ctx };
}
