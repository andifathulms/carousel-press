import type { Deck, Slide, Warning } from '../core/types';
import { makeCanvas, type Ctx } from '../render/ctx';
import { type RenderAssets, renderSlide } from '../render/renderSlide';
import { CANVAS } from '../render/safezone';
import { drawTestImage } from '../render/overlay';
import type { Variant } from '../templates/types';
import { loadFonts } from '../fonts/loadFonts';

export async function canvasToPng(canvas: OffscreenCanvas | HTMLCanvasElement): Promise<Blob> {
  if ('convertToBlob' in canvas) return canvas.convertToBlob({ type: 'image/png' });
  return new Promise<Blob>((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error('PNG encode failed'))), 'image/png'));
}

/**
 * Render one slide on a fresh 1080×1920 offscreen canvas at scale 1 and
 * encode it. Fonts are awaited first; never reads back the preview.
 */
export async function exportSlidePng(
  slide: Slide, deck: Deck, variant: Variant, assets: Omit<RenderAssets, 'preview'>,
): Promise<{ blob: Blob; warnings: Warning[] }> {
  await loadFonts(variant);
  const { canvas, ctx } = makeCanvas(CANVAS.w, CANVAS.h);
  const r = renderSlide(ctx, slide, deck, variant, { ...assets, preview: false });
  return { blob: await canvasToPng(canvas), warnings: r.warnings };
}

/** The safe-zone test image as a PNG. */
export async function exportTestImage(variant: Variant): Promise<Blob> {
  await loadFonts(variant);
  await document.fonts.load('600 30px "Inter"');
  await document.fonts.load('500 20px "JetBrains Mono"');
  const { canvas, ctx } = makeCanvas(CANVAS.w, CANVAS.h);
  drawTestImage(ctx as Ctx);
  return canvasToPng(canvas);
}

/** Trigger a single download for a blob, then revoke the URL after 1 s. */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
