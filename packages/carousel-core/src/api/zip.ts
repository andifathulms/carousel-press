// ZIP export: separate entry so hosts that don't need it never load JSZip.
import JSZip from 'jszip';
import { slideFileName, slugify } from '../core/slug';

/** Slide file names inside the ZIP: `{slug}_01.png`, `{slug}_02.png`… */
export function slideFileNames(count: number, name: string): string[] {
  const slug = slugify(name) || 'carousel';
  return Array.from({ length: count }, (_, i) => slideFileName(slug, i));
}

/** Pack PNGs (renderDeck's output) into one STORE-compressed ZIP. */
export async function exportZip(blobs: readonly Blob[], name: string): Promise<Blob> {
  const zip = new JSZip();
  const names = slideFileNames(blobs.length, name);
  blobs.forEach((b, i) => zip.file(names[i]!, b));
  return zip.generateAsync({ type: 'blob', compression: 'STORE' });
}

export { downloadBlob } from '../export/exportPng';
