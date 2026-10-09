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

export interface SlideFile {
  name: string;
  blob: Blob;
}

/**
 * Render every slide to a named PNG, in order.
 * Awaits the font gate before drawing anything.
 */
export async function renderAllPngs(input: ExportDeckInput, onProgress?: (done: number, total: number) => void): Promise<{ files: SlideFile[]; warnings: Warning[] }> {
  await loadFonts(input.variant);
  const files: SlideFile[] = [];
  const warnings: Warning[] = [];
  const { deck } = input;
  for (const [i, slide] of deck.slides.entries()) {
    const photo = slide.photoId ? await input.getPhoto(slide.photoId) : null;
    const r = await exportSlidePng(slide, deck, input.variant, { photo, darkness: input.darkness, icon: input.icons[i] ?? null });
    warnings.push(...r.warnings);
    files.push({ name: slideFileName(deck.slug, i), blob: r.blob });
    onProgress?.(i + 1, deck.slides.length);
  }
  return { files, warnings };
}

/** Render every slide to PNG and pack them in one STORE-compressed ZIP. */
export async function exportAll(input: ExportDeckInput, onProgress?: (done: number, total: number) => void): Promise<{ blob: Blob; warnings: Warning[] }> {
  const { files, warnings } = await renderAllPngs(input, onProgress);
  const zip = new JSZip();
  for (const f of files) zip.file(f.name, f.blob);
  const blob = await zip.generateAsync({ type: 'blob', compression: 'STORE' });
  return { blob, warnings };
}
