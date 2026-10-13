import type { Deck, Slide, Warning } from '../core/types';
import { type RenderAssets } from '../render/renderSlide';
import type { Variant } from '../templates/types';
export declare function canvasToPng(canvas: OffscreenCanvas | HTMLCanvasElement): Promise<Blob>;
/**
 * Render one slide on a fresh 1080×1920 offscreen canvas at scale 1 and
 * encode it. Fonts are awaited first; never reads back the preview.
 */
export declare function exportSlidePng(slide: Slide, deck: Deck, variant: Variant, assets: Omit<RenderAssets, 'preview'>): Promise<{
    blob: Blob;
    warnings: Warning[];
}>;
/** The safe-zone test image as a PNG. */
export declare function exportTestImage(variant: Variant): Promise<Blob>;
/** Trigger a single download for a blob, then revoke the URL after 1 s. */
export declare function downloadBlob(blob: Blob, fileName: string): void;
