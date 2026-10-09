// Bundled faces (latin subset only). Vite turns these into hashed woff2 assets.
import '@fontsource/playfair-display/latin-600.css';
import '@fontsource/playfair-display/latin-700.css';
import '@fontsource/lora/latin-600.css';
import '@fontsource/lora/latin-700.css';
import '@fontsource/poppins/latin-400.css';
import '@fontsource/poppins/latin-500.css';
import '@fontsource/poppins/latin-600.css';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-700.css';
import '@fontsource/inter/latin-800.css';
import '@fontsource/jetbrains-mono/latin-400.css';
import '@fontsource/jetbrains-mono/latin-500.css';
import '@fontsource/jetbrains-mono/latin-600.css';
import '@fontsource/jetbrains-mono/latin-700.css';
// IPA face for word slides (SPEC-lexicon §3.1): latin + latin-ext + greek via unicode-range.
import '@fontsource/gentium-book-plus/400.css';

import type { Variant } from '../templates/types';

export interface Face {
  family: string;
  weight: number;
  /** Sample text that pulls in the subsets this face is used for. */
  text?: string;
}

/** IPA sample: latin-ext (ɔ ː ʃ ŋ ˈ) and greek (θ) subsets. */
export const IPA_SAMPLE = 'θɔːæʃʒŋəɜɪʊˈˌð';

export const FONT_TIMEOUT_MS = 8000;

/** Every face/weight a variant draws with. */
export function facesFor(v: Variant): Face[] {
  const faces: Face[] = [];
  const add = (family: string | undefined, weights: number[]): void => {
    if (!family) return;
    for (const weight of weights) {
      if (!faces.some((f) => f.family === family && f.weight === weight)) faces.push({ family, weight });
    }
  };
  if (v.family === 'editorial' || v.family === 'lexicon') {
    add(v.fonts.serif, [600, 700]);
    add(v.fonts.sans, [400, 500, 600]);
    add(v.fonts.mono, [400, 500, 600]);
  } else {
    add(v.fonts.sans, [400, 500, 600, 700, v.headlineWeight ?? 800]);
    add(v.fonts.mono, [400, 500, 600, 700]);
  }
  // Word slides can appear in any template, so every variant gates on the IPA face.
  faces.push({ family: 'Gentium Book Plus', weight: 400, text: IPA_SAMPLE });
  return faces;
}

const loaded = new Map<string, Promise<void>>();

/**
 * Resolve once document.fonts.load() succeeded for every face the variant
 * uses. Rejects after FONT_TIMEOUT_MS. Never resolve with fallback fonts.
 */
export function loadFonts(v: Variant, timeoutMs = FONT_TIMEOUT_MS): Promise<void> {
  const hit = loaded.get(v.id);
  if (hit) return hit;
  const p = withTimeout(loadFaces(facesFor(v)), timeoutMs, `Fonts for ${v.name} didn't load in ${timeoutMs / 1000}s`);
  loaded.set(v.id, p);
  p.catch(() => loaded.delete(v.id));
  return p;
}

/** Load every variant's faces (review page, template gallery). */
export async function loadAllFonts(variants: readonly Variant[]): Promise<void> {
  await Promise.all(variants.map((v) => loadFonts(v)));
}

async function loadFaces(faces: Face[]): Promise<void> {
  await Promise.all(faces.map(async (f) => {
    const spec = `${f.weight} 40px "${f.family}"`;
    const res = await document.fonts.load(spec, f.text ?? 'Aa09•—');
    if (!res.length || !document.fonts.check(spec, f.text ?? 'Aa')) throw new Error(`Font face missing: ${spec}`);
  }));
  await document.fonts.ready;
}

function withTimeout<T>(p: Promise<T>, ms: number, msg: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(msg)), ms);
    p.then((v) => { clearTimeout(t); resolve(v); }, (e) => { clearTimeout(t); reject(e); });
  });
}
