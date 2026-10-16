// The font gate: rendering waits until every face a variant draws with is
// loaded, and never falls back to system fonts. Faces come from fontSources.ts.
import { ARABIC_SAMPLE, AYAH_FACE, HADITH_FACE } from '../templates/serene/arabicLayout';

import type { Variant } from '../templates/types';
import { traitsOf } from '../templates/traits';
import { registerFace } from './fontSources';

export { configureFonts, type FontConfig, type FontFaceSource } from './fontSources';

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
  const w = traitsOf(v).weights(v);
  if (w.serif) add(v.fonts.serif, w.serif);
  add(v.fonts.sans, w.sans);
  add(v.fonts.mono, w.mono);
  // Word slides can appear in any template, so every variant gates on the IPA face.
  faces.push({ family: 'Gentium Book Plus', weight: 400, text: IPA_SAMPLE }, { family: 'Gentium Book Plus', weight: 700, text: IPA_SAMPLE });
  // Ayah/hadith slides can appear in any template too.
  faces.push({ family: AYAH_FACE, weight: 400, text: ARABIC_SAMPLE }, { family: HADITH_FACE, weight: 400, text: ARABIC_SAMPLE });
  // Arabic headwords in word slides (SPEC-script §7.1).
  faces.push({ family: HADITH_FACE, weight: 700, text: ARABIC_SAMPLE });
  return faces;
}

const loaded = new Map<string, Promise<void>>();

/**
 * Resolve once document.fonts.load() succeeded for every face the variant
 * uses. Rejects with the faces still missing after FONT_TIMEOUT_MS, or as soon
 * as a face fails. Never resolves with fallback fonts.
 */
export function loadFonts(v: Variant, timeoutMs = FONT_TIMEOUT_MS): Promise<void> {
  const hit = loaded.get(v.id);
  if (hit) return hit;
  const p = loadFaces(facesFor(v), timeoutMs, `"${v.name}"`);
  loaded.set(v.id, p);
  p.catch(() => loaded.delete(v.id));
  return p;
}

/** Load every variant's faces (review page, template gallery). */
export async function loadAllFonts(variants: readonly Variant[]): Promise<void> {
  await Promise.all(variants.map((v) => loadFonts(v)));
}

/** Load one face outside any variant (safe-zone overlay and test image). */
export function loadFace(family: string, weight: number, text?: string, timeoutMs = FONT_TIMEOUT_MS): Promise<void> {
  return loadFaces([{ family, weight, ...(text ? { text } : {}) }], timeoutMs, `${weight} "${family}"`);
}

const specOf = (f: Face): string => `${f.weight} 40px "${f.family}"`;

async function loadFaces(faces: Face[], timeoutMs: number, label: string): Promise<void> {
  const pending = new Set(faces.map(specOf));
  const all = Promise.all(faces.map(async (f) => {
    const spec = specOf(f);
    let urls: string[] = [];
    try {
      urls = registerFace(f.family, f.weight);
      const res = await document.fonts.load(spec, f.text ?? 'Aa09•—');
      if (!res.length || !document.fonts.check(spec, f.text ?? 'Aa')) throw new Error('not available after loading');
    } catch (err) {
      const from = urls.length ? ` from ${urls.join(', ')}` : ' (no font file: add it with configureFonts({ faces }))';
      throw new Error(`carousel-core: font ${f.weight} "${f.family}" failed to load${from}: ${err instanceof Error ? err.message : String(err)}`);
    }
    pending.delete(spec);
  })).then(() => document.fonts.ready).then(() => undefined);
  return withTimeout(all, timeoutMs, () =>
    `carousel-core: fonts for ${label} didn't load within ${timeoutMs / 1000} s; still waiting for ${[...pending].map((x) => x.replace(' 40px', '')).join(', ')}`);
}

function withTimeout<T>(p: Promise<T>, ms: number, msg: () => string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(msg())), ms);
    p.then((v) => { clearTimeout(t); resolve(v); }, (e) => { clearTimeout(t); reject(e); });
  });
}
