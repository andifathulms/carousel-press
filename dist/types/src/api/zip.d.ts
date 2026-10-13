/** Slide file names inside the ZIP: `{slug}_01.png`, `{slug}_02.png`… */
export declare function slideFileNames(count: number, name: string): string[];
/** Pack PNGs (renderDeck's output) into one STORE-compressed ZIP. */
export declare function exportZip(blobs: readonly Blob[], name: string): Promise<Blob>;
export { downloadBlob } from '../export/exportPng';
