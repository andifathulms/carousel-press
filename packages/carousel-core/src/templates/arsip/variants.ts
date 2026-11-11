// Arsip variants (docs/SPEC-arsip.md §3.1). Sejarah Nusantara: paper story slides, brick for the
// hook and the turn, indigo for the cover, quote and end. Surfaces are picked by plate, not rotation.
import type { Surface, Variant } from '../types';

const surface = (bg: string, ink: string, body: string, muted: string, accent: string, badgeInk: string, inlineCodeBg: string): Surface => ({
  bg, ink, body, muted, accent, badgeBg: accent, badgeInk, blob: bg, icon: accent, inlineCodeBg,
});

/** Paper: the default story surface. */
const kertas = surface('#F2ECE1', '#1D1A16', '#38322A', '#6B6256', '#9A3A1E', '#FBF4EA', '#E6DDCD');
/** Brick (Trowulan temple red): the hook card and the turn. Accent = lontar yellow. */
const bata = surface('#8A3118', '#FBF4EA', '#F6E9DC', '#D9C3B3', '#EBC97E', '#1D1A16', '#9C3D22');
/** Indigo dye: cover band, quote and end. */
const nila = surface('#16213A', '#FBF4EA', '#DCD5C8', '#D9C3B3', '#EBC97E', '#16213A', '#22304B');
/** The cover card and option plates (whiter than kertas, so they read as a card on the photo). */
const lembar = surface('#FBF8F1', '#1D1A16', '#38322A', '#6B6256', '#9A3A1E', '#FBF4EA', '#EEE7DA');
/** Manuscript sheet on quote slides. Muted darkened from #6B6256 (4.2:1 here) to pass 4.5. */
const naskah = surface('#E6D7B8', '#1D1A16', '#38322A', '#574F44', '#9A3A1E', '#FBF4EA', '#D8C7A3');

const base: Omit<Variant, 'id' | 'name' | 'rotation' | 'swatches'> = {
  family: 'arsip',
  fonts: { serif: 'Lora', sans: 'DM Sans', mono: 'JetBrains Mono', label: 'Barlow Condensed' },
  surfaces: { kertas, bata, nila, lembar, naskah, deep: nila },
  // Only used by slide types arsip hands to the editorial layout (code, diagram, word…).
  onPhoto: {
    bg: '#16213A', ink: '#FFFFFF', body: 'rgba(255,255,255,0.90)', muted: 'rgba(255,255,255,0.75)', accent: '#EBC97E',
    badgeBg: '#EBC97E', badgeInk: '#16213A', blob: '#16213A', icon: '#FFFFFF', inlineCodeBg: 'rgba(255,255,255,0.16)', tint: '#0E1320',
  },
  code: {
    panel: '#16213A', border: '#16213A', text: '#F2ECE1', prompt: '#EBC97E', command: '#FFFFFF', subcommand: '#F0C2B5',
    flag: '#EBC97E', string: '#C9E2BE', comment: '#9AA3B5', number: '#EBC97E', keyword: '#F0A595', fn: '#D9C3F0', punct: '#D5CEC4', dots: null,
  },
  deco: { blobs: false, dotGrid: false, scanlines: false, glow: false, bigGlyph: null, quoteMark: false },
  quoteSurface: 'nila',
};

export const ARSIP_VARIANTS: readonly Variant[] = [
  { ...base, id: 'arsip/bata', name: 'Arsip · Bata', rotation: ['kertas'], swatches: ['#9A3A1E', '#F2ECE1', '#16213A', '#EBC97E'] },
  // Wars and night events: the story runs on indigo; brick stays the turn colour.
  { ...base, id: 'arsip/nila', name: 'Arsip · Nila', rotation: ['nila'], swatches: ['#16213A', '#EBC97E', '#8A3118', '#F2ECE1'] },
];
