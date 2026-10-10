import type { CodeTheme, Surface, Variant } from '../types';

// Tokens are SPEC-ayah §4 verbatim unless a comment says otherwise.

const S = (
  bg: string, ink: string, body: string, muted: string, accent: string,
  badgeBg: string, badgeInk: string, blob: string, icon: string, inlineCodeBg: string,
): Surface => ({ bg, ink, body, muted, accent, badgeBg, badgeInk, blob, icon, inlineCodeBg });

const onPhotoBase = {
  bg: '#000000', ink: '#FFFFFF', body: 'rgba(255,255,255,0.90)', muted: 'rgba(255,255,255,0.75)',
  icon: '#FFFFFF', blob: 'rgba(0,0,0,0)', inlineCodeBg: 'rgba(255,255,255,0.18)',
};

/** Code panel (not in the spec; serene decks don't use code). */
const quietCode: CodeTheme = {
  panel: '#16242F', border: '#2A3B48', text: '#F3EEE2', prompt: '#D9B76E', command: '#F3EEE2',
  subcommand: '#E7CF9A', flag: '#C9D4C5', string: '#B9D8A8', comment: '#9AA3A8', number: '#E7CF9A',
  keyword: '#E8A98F', fn: '#A9C7E8', punct: '#C8C2B4', dots: null,
};

const deco = { blobs: false, dotGrid: false, scanlines: false, glow: false, bigGlyph: null, frame: true, minDarkness: 70 };

export const fajr: Variant = {
  id: 'serene/fajr',
  name: 'Fajr',
  family: 'serene',
  fonts: { serif: 'Lora', sans: 'DM Sans', mono: 'JetBrains Mono' },
  surfaces: {
    paper: S('#F5F1E8', '#1F2B24', '#34423A', '#66706A', '#2F5D4A', '#2F5D4A', '#F5F1E8', '#F5F1E8', '#2F5D4A', '#EAE4D6'),
    deep: S('#1F3A30', '#F5F1E8', '#DCD8CC', '#A9B0A8', '#D8BC86', '#D8BC86', '#1F3A30', '#1F3A30', '#D8BC86', '#2A4A3E'),
  },
  rotation: ['paper'],
  onPhoto: { ...onPhotoBase, accent: '#E9D3A6', badgeBg: '#D8BC86', badgeInk: '#1F3A30', tint: '#101A15' },
  code: quietCode,
  deco,
  swatches: ['#F5F1E8', '#2F5D4A', '#B08D57', '#1F2B24'],
};

export const isya: Variant = {
  id: 'serene/isya',
  name: 'Isya',
  family: 'serene',
  fonts: { serif: 'Lora', sans: 'DM Sans', mono: 'JetBrains Mono' },
  surfaces: {
    night: S('#12202B', '#F3EEE2', '#D2CBBB', '#9AA3A8', '#D9B76E', '#D9B76E', '#12202B', '#12202B', '#D9B76E', '#1C2E3C'),
    deep: S('#0C161E', '#F3EEE2', '#D2CBBB', '#9AA3A8', '#D9B76E', '#D9B76E', '#0C161E', '#0C161E', '#D9B76E', '#16242F'),
  },
  rotation: ['night'],
  onPhoto: { ...onPhotoBase, accent: '#E9D3A6', badgeBg: '#D9B76E', badgeInk: '#12202B', tint: '#081016' },
  code: quietCode,
  deco,
  swatches: ['#12202B', '#D9B76E', '#F3EEE2', '#1C2E3C'],
};

export const SERENE_VARIANTS: readonly Variant[] = [fajr, isya];
