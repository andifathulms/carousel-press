import JSZip from 'jszip';
import type { Deck, Warning } from '../core/types';
import { slideFileName } from '../core/slug';
import type { PoolIcon } from '../core/iconNames';
import type { PhotoInput } from '../render/photo';
import type { Variant } from '../templates/types';
import { loadFonts } from '../fonts/loadFonts';
import { exportSlidePng } from './exportPng';

export interface ExportDeckInput {
  deck: Deck;
  variant: Variant;
  icons: (PoolIcon | null)[];
  darkness: number;
  getPhoto(id: string): Promise<PhotoInput | null>;
}

/**
 * Render every slide to PNG and pack them in one STORE-compressed ZIP.
 * Awaits the font gate before drawing anything.
 */
export async function exportAll(input: ExportDeckInput, onProgress?: (done: number, total: number) => void): Promise<{ blob: Blob; warnings: Warning[] }> {
  await loadFonts(input.variant);
  const zip = new JSZip();
  const warnings: Warning[] = [];
  const { deck } = input;
  for (const [i, slide] of deck.slides.entries()) {
    const photo = slide.photoId ? await input.getPhoto(slide.photoId) : null;
    const r = await exportSlidePng(slide, deck, input.variant, { photo, darkness: input.darkness, icon: input.icons[i] ?? null });
    warnings.push(...r.warnings);
    zip.file(slideFileName(deck.slug, i), r.blob);
    onProgress?.(i + 1, deck.slides.length);
  }
  const blob = await zip.generateAsync({ type: 'blob', compression: 'STORE' });
  return { blob, warnings };
}
