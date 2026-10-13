// Where font files come from: the bundled manifest (fonts/manifest.json, written
// by `npm run fonts:sync`) plus any faces a host adds with configureFonts().
// Faces are registered with the FontFace API on first use; no CSS is involved.
import MANIFEST from '../../fonts/manifest.json';

/** One font file. `weight` is a single weight or a [min, max] range (variable-weight woff2). */
export interface FontFaceSource {
  family: string;
  weight: number | [number, number];
  style?: 'normal' | 'italic';
  url: string;
  unicodeRange?: string;
}

export interface FontConfig {
  /** URL of the package's fonts/ directory (default: ../fonts/ next to the module). */
  baseUrl?: string | URL;
  /** Per-file URL, for bundlers that rename assets. Wins over baseUrl. */
  resolveUrl?: (file: string) => string;
  /** Faces for host variants. They are matched before the bundled ones. */
  faces?: FontFaceSource[];
}

interface ManifestFace {
  family: string;
  style: string;
  weight: string;
  file: string;
  unicodeRange?: string;
}

export const BUNDLED_FACES: readonly ManifestFace[] = (MANIFEST as { faces: ManifestFace[] }).faces;

let baseUrl: string | null = null;
let resolveUrl: ((file: string) => string) | null = null;
let hostFaces: FontFaceSource[] = [];
const registered = new Map<string, FontFace>();

/** Set where fonts are served from and/or add host faces. Call before rendering. */
export function configureFonts(config: FontConfig): void {
  if (config.baseUrl !== undefined) {
    const s = String(config.baseUrl);
    baseUrl = s.endsWith('/') ? s : `${s}/`;
  }
  if (config.resolveUrl) resolveUrl = config.resolveUrl;
  if (config.faces) {
    for (const f of config.faces) {
      if (!f || typeof f.family !== 'string' || typeof f.url !== 'string') throw new Error('configureFonts: every face needs { family, weight, url }');
      const ok = typeof f.weight === 'number' || (Array.isArray(f.weight) && f.weight.length === 2 && f.weight[0] <= f.weight[1]);
      if (!ok) throw new Error(`configureFonts: weight of "${f.family}" must be a number or [min, max]`);
    }
    hostFaces = [...config.faces, ...hostFaces];
  }
}

/** Default: the fonts/ directory next to the built module (dist/ → ../fonts/). */
function defaultBase(): string {
  // String math, not new URL('../fonts/', import.meta.url): bundlers (Vite, webpack,
  // Turbopack) read that form as an asset import and fail on a directory.
  const dir = String(import.meta.url).replace(/[^/]*$/, '');
  return new URL(`${dir}../fonts/`).href;
}

function bundledUrl(file: string): string {
  if (resolveUrl) return resolveUrl(file);
  const base = baseUrl ?? defaultBase();
  if (base.startsWith('file:') && typeof location !== 'undefined' && location.protocol !== 'file:') {
    throw new Error(`carousel-core: can't serve fonts from ${base}. Copy the package's fonts/ folder to your public files and call configureFonts({ baseUrl: '/your/path/fonts/' }) first`);
  }
  // A relative base ('/app/fonts/') is joined as text; the browser resolves it against the page.
  return /^[a-z][a-z0-9+.-]*:/i.test(base) ? new URL(file, base).href : `${base}${file}`;
}

const covers = (w: number | [number, number], weight: number): boolean =>
  typeof w === 'number' ? w === weight : weight >= w[0] && weight <= w[1];

/** The files that provide `family` at `weight`: host faces first, else the bundled ones. */
export function sourcesFor(family: string, weight: number, style = 'normal'): FontFaceSource[] {
  const host = hostFaces.filter((f) => f.family === family && (f.style ?? 'normal') === style && covers(f.weight, weight));
  if (host.length) return host;
  return BUNDLED_FACES
    .filter((f) => f.family === family && f.style === style && Number(f.weight) === weight)
    .map((f) => ({
      family, weight, style: f.style as 'normal', url: bundledUrl(f.file), ...(f.unicodeRange ? { unicodeRange: f.unicodeRange } : {}),
    }));
}

/** Add the FontFaces for one family/weight to document.fonts (once each). Returns their URLs. */
export function registerFace(family: string, weight: number, style = 'normal'): string[] {
  const sources = sourcesFor(family, weight, style);
  for (const s of sources) {
    const w = typeof s.weight === 'number' ? String(s.weight) : `${s.weight[0]} ${s.weight[1]}`;
    const key = `${s.family}|${w}|${s.style ?? 'normal'}|${s.unicodeRange ?? ''}|${s.url}`;
    if (registered.has(key)) continue;
    const face = new FontFace(s.family, `url("${s.url}") format("woff2")`, {
      weight: w, style: s.style ?? 'normal', ...(s.unicodeRange ? { unicodeRange: s.unicodeRange } : {}),
    });
    document.fonts.add(face);
    registered.set(key, face);
  }
  return sources.map((s) => s.url);
}
