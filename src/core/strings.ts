import type { Lang } from './types';

export type StringKey = 'swipe' | 'coverSwipe' | 'cta';

/** Built-in slide strings (PRD §4.7). Add a language by adding one column. */
export const STRINGS: Record<StringKey, Record<Lang, string>> = {
  swipe: { id: 'Geser →', en: 'Swipe →' },
  coverSwipe: { id: 'Geser untuk lihat', en: 'Swipe to see' },
  cta: { id: 'Simpan • Bagikan', en: 'Save • Share' },
};

export function t(key: StringKey, lang: Lang): string {
  return STRINGS[key][lang];
}

/**
 * Split a trailing arrow off a string. Renderers draw the arrow as an icon
 * (font coverage of "→" differs), never as a glyph.
 */
export function splitArrow(text: string): { text: string; arrow: boolean } {
  const m = /\s*→\s*$/.exec(text);
  if (!m) return { text, arrow: false };
  return { text: text.slice(0, m.index), arrow: true };
}
