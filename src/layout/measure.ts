export interface FontSpec {
  family: string;
  weight: number;
  size: number;
}

export interface TextMeasurer {
  width(text: string, font: FontSpec): number;
  /** False when `family` isn't loaded for `sample` (real fonts only). Absent = assume loaded. */
  hasFace?(family: string, sample: string): boolean;
}

const SERIF = new Set(['Playfair Display', 'Lora', 'Gentium Book Plus', 'Amiri Quran', 'Amiri']);

export function isMonoFamily(family: string): boolean {
  return /mono/i.test(family);
}

/** Generic fallbacks per face. The real faces are always loaded before export. */
export function fallbackStack(family: string): string {
  if (isMonoFamily(family)) return 'ui-monospace, Menlo, Consolas, monospace';
  if (SERIF.has(family)) return 'Georgia, "Times New Roman", serif';
  return 'system-ui, -apple-system, "Segoe UI", sans-serif';
}

/** Arabic inside Latin text (honorifics such as ﷺ) falls through to the bundled Amiri face (arabic subset only). */
export const ARABIC_FALLBACK = 'Amiri';

/** Full CSS/canvas font string, e.g. `700 92px "Playfair Display", "Amiri", Georgia, serif`. */
export function fontString(f: FontSpec): string {
  const arabic = f.family === ARABIC_FALLBACK || f.family === 'Amiri Quran' ? '' : `"${ARABIC_FALLBACK}", `;
  return `${f.weight} ${f.size}px "${f.family}", ${arabic}${fallbackStack(f.family)}`;
}

/** Minimal surface of a 2D context needed to measure text. */
export interface MeasureContext {
  font: string;
  measureText(text: string): { width: number };
}

/** Canvas-backed measurer with a small cache. The context (and optional face check) is passed in. */
export function createCanvasMeasurer(ctx: MeasureContext, hasFace?: (family: string, sample: string) => boolean): TextMeasurer {
  const cache = new Map<string, number>();
  return {
    ...(hasFace ? { hasFace } : {}),
    width(text, font) {
      const fs = fontString(font);
      const key = `${fs}\u0000${text}`;
      const hit = cache.get(key);
      if (hit !== undefined) return hit;
      if (ctx.font !== fs) ctx.font = fs;
      const w = ctx.measureText(text).width;
      if (cache.size > 20000) cache.clear();
      cache.set(key, w);
      return w;
    },
  };
}

/** Combining marks (harakat, IPA diacritics) have no advance width. */
const MARK = /\p{Mn}/u;

/** Deterministic measurer for tests: length × size × 0.52 (mono 0.6), combining marks excluded. */
export const fakeMeasurer: TextMeasurer = {
  width(text, font) {
    const k = isMonoFamily(font.family) ? 0.6 : 0.52;
    return Array.from(text).filter((ch) => !MARK.test(ch)).length * font.size * k;
  },
};
