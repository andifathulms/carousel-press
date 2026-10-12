import type { CodeTheme, Surface, Variant } from '../types';

// Tokens are DESIGN §5.1 verbatim unless a comment says otherwise.

const S = (
  bg: string, ink: string, body: string, muted: string, accent: string,
  badgeBg: string, badgeInk: string, blob: string, icon: string, inlineCodeBg: string,
): Surface => ({ bg, ink, body, muted, accent, badgeBg, badgeInk, blob, icon, inlineCodeBg });

const roseCode: CodeTheme = {
  panel: '#1F2A2E', border: '#1F2A2E', text: '#F4ECE1', prompt: '#E9A497', command: '#FFFFFF',
  subcommand: '#F0C2B5', flag: '#E9C98F', string: '#C9E2BE', comment: '#9AA3A0', number: '#E9C98F',
  keyword: '#F0A595', fn: '#D9C3F0', punct: '#D5CEC4', dots: null,
};

const onPhotoBase = {
  bg: '#000000', ink: '#FFFFFF', body: 'rgba(255,255,255,0.90)', muted: 'rgba(255,255,255,0.75)',
  icon: '#FFFFFF', blob: 'rgba(0,0,0,0)', inlineCodeBg: 'rgba(255,255,255,0.18)',
};

export const roseDusk: Variant = {
  id: 'editorial/rose-dusk',
  name: 'Rose Dusk',
  family: 'editorial',
  fonts: { serif: 'Playfair Display', sans: 'Poppins', mono: 'JetBrains Mono' },
  surfaces: {
    cream: S('#F4ECE1', '#1F2A2E', '#3B4246', '#6B6F70', '#A8564C', '#C9786B', '#FFFFFF', '#EBCFC4', '#C0695C', '#E9DFD1'),
    blush: S('#E9C4BA', '#1F2A2E', '#33393C', '#5E5555', '#7E3E35', '#2F4036', '#F4ECE1', '#E0B3A6', '#2F4036', '#DDB3A8'),
    forest: S('#2F4036', '#F4ECE1', '#DCD5CA', '#AEB3A9', '#F0C2B5', '#E9C4BA', '#1F2A2E', '#3A4E42', '#E9C4BA', '#3D5145'),
    deep: S('#262C3D', '#F7EFE6', '#D9D2CB', '#A9A6AE', '#F0CFC4', '#F0CFC4', '#1F2A2E', '#323A50', '#F0CFC4', '#343B50'),
  },
  rotation: ['cream', 'blush', 'forest'],
  onPhoto: { ...onPhotoBase, accent: '#F6D3C8', badgeBg: '#F0CFC4', badgeInk: '#1F2A2E', tint: '#140E16' },
  code: roseCode,
  deco: { blobs: true, dotGrid: false, scanlines: false, glow: false, bigGlyph: null },
  swatches: ['#C9786B', '#F4ECE1', '#2F4036', '#262C3D'],
};

export const sage: Variant = {
  id: 'editorial/sage',
  name: 'Sage',
  family: 'editorial',
  fonts: { serif: 'Lora', sans: 'DM Sans', mono: 'JetBrains Mono' },
  surfaces: {
    linen: S('#F1EEE4', '#22291F', '#3E463A', '#6A7064', '#4F6447', '#5F7457', '#FFFFFF', '#E1E5D5', '#5F7457', '#E4E1D4'),
    moss: S('#CFD8C3', '#1E241B', '#32392E', '#545C4E', '#3B4C34', '#3E4A3A', '#F1EEE4', '#C0CCB2', '#3E4A3A', '#C0CAB3'),
    olive: S('#3E4A3A', '#F1EEE4', '#DADCCF', '#AEB2A3', '#E6C59F', '#D9B48F', '#22291F', '#4A5845', '#D9B48F', '#4C5947'),
    deep: S('#2A3127', '#F1EEE4', '#D3D6C8', '#A3A897', '#D9B48F', '#D9B48F', '#22291F', '#353E31', '#D9B48F', '#384134'),
  },
  rotation: ['linen', 'moss', 'olive'],
  onPhoto: { ...onPhotoBase, accent: '#E8D2B0', badgeBg: '#D9B48F', badgeInk: '#1F2A2E', tint: '#12160F' },
  code: {
    ...roseCode, panel: '#2A3127', border: '#2A3127', text: '#F1EEE4', prompt: '#D9B48F',
    subcommand: '#C7D6B5', flag: '#E6C59F', string: '#BFD9AE',
  },
  deco: { blobs: true, dotGrid: false, scanlines: false, glow: false, bigGlyph: null },
  swatches: ['#6F8466', '#F1EEE4', '#3E4A3A', '#D9B48F'],
};

export const midnight: Variant = {
  id: 'editorial/midnight',
  name: 'Midnight',
  family: 'editorial',
  fonts: { serif: 'Playfair Display', sans: 'DM Sans', mono: 'JetBrains Mono' },
  surfaces: {
    navy: S('#1B2333', '#F3E9D7', '#D2C9B8', '#9C9787', '#E8B378', '#E0A060', '#1B2333', '#232D42', '#E0A060', '#283248'),
    plum: S('#2B2236', '#F3E9D7', '#D6CACB', '#A2969E', '#EBB884', '#E0A060', '#1B2333', '#352A43', '#E0A060', '#3A2F48'),
    slate: S('#22303A', '#F3E9D7', '#CBD1D0', '#96A0A2', '#E8B378', '#F3E9D7', '#1B2333', '#2B3C48', '#F3E9D7', '#2F404C'),
    deep: S('#141A26', '#F3E9D7', '#CFC6B5', '#948F80', '#E8B378', '#E0A060', '#141A26', '#1E2636', '#E0A060', '#222B3C'),
  },
  rotation: ['navy', 'plum', 'slate'],
  onPhoto: { ...onPhotoBase, accent: '#F2C58F', badgeBg: '#E0A060', badgeInk: '#141A26', tint: '#0B0F18' },
  code: {
    ...roseCode, panel: '#0F1520', border: '#2A3448', text: '#F3E9D7', prompt: '#E0A060',
    subcommand: '#9CC3E6', flag: '#E8B378', string: '#B8D8A8', comment: '#7F8A99', dots: null,
  },
  deco: { blobs: true, dotGrid: false, scanlines: false, glow: false, bigGlyph: null },
  swatches: ['#E0A060', '#1B2333', '#2B2236', '#F3E9D7'],
};

/** Filsafat Harian (docs/channels.md §11): warm stone, charcoal, terracotta. Surface tokens verbatim from the brief. */
export const stone: Variant = {
  id: 'editorial/stone',
  name: 'Stone',
  family: 'editorial',
  fonts: { serif: 'Playfair Display', sans: 'DM Sans', mono: 'JetBrains Mono' },
  surfaces: {
    stone: S('#EDEAE4', '#1E1E1C', '#3C3B37', '#6C6A64', '#9A4B2F', '#2B2A27', '#EDEAE4', '#E2DED6', '#9A4B2F', '#E2DED6'),
    slate: S('#2B2A27', '#EDEAE4', '#D2CEC6', '#A19D94', '#E39A7A', '#E39A7A', '#2B2A27', '#35332F', '#E39A7A', '#3A3834'),
    deep: S('#1B1A18', '#EDEAE4', '#CFCBC3', '#9C988F', '#E39A7A', '#E39A7A', '#1B1A18', '#262522', '#E39A7A', '#2A2926'),
  },
  rotation: ['stone', 'stone', 'slate'],
  // Not in the brief: photo and code tokens follow midnight/sage, in the stone palette.
  onPhoto: { ...onPhotoBase, accent: '#F0B597', badgeBg: '#E39A7A', badgeInk: '#1B1A18', tint: '#100F0E' },
  code: {
    ...roseCode, panel: '#2B2A27', border: '#2B2A27', text: '#EDEAE4', prompt: '#E39A7A',
    subcommand: '#D9C7B0', flag: '#F0B597', string: '#C9D3B0', comment: '#A19D94', dots: null,
  },
  deco: { blobs: true, dotGrid: false, scanlines: false, glow: false, bigGlyph: null },
  swatches: ['#EDEAE4', '#9A4B2F', '#2B2A27', '#E39A7A'],
};

/**
 * Ruang Rasa (docs/channels.md §1): one colour per pillar, the same surface on every
 * slide (covers and ends use `deep`, so `deep` repeats the main surface). No blobs,
 * Fraunces headlines at 500. Tokens from the Oct 2026 account review; contrast-checked.
 */
const ruang = (
  key: string, name: string, s: Surface, photoAccent: string, tint: string, panel: string, swatches: Variant['swatches'],
): Variant => ({
  id: `editorial/ruang-${key}` as Variant['id'],
  name: `Ruang ${name}`,
  family: 'editorial',
  fonts: { serif: 'Fraunces', sans: 'Instrument Sans', mono: 'JetBrains Mono' },
  surfaces: { [key]: s, deep: s },
  rotation: [key],
  onPhoto: { ...onPhotoBase, accent: photoAccent, badgeBg: photoAccent, badgeInk: '#1B1A19', tint },
  code: { ...roseCode, panel, border: panel },
  deco: { blobs: false, dotGrid: false, scanlines: false, glow: false, bigGlyph: null },
  swatches,
  headlineWeight: 500,
});

/** Sahabat, teman lama. */
export const ruangKunyit = ruang('kunyit', 'Kunyit',
  S('#F2C14E', '#241A0C', '#3B2C14', '#6E5524', '#8A2F14', '#241A0C', '#F2C14E', '#F2C14E', '#8A2F14', '#E5B23F'),
  '#FFD877', '#1A1206', '#241A0C', ['#F2C14E', '#241A0C', '#8A2F14', '#FFF1C9']);
/** Berdua: pasangan, LDR, sebelum menikah. */
export const ruangBata = ruang('bata', 'Bata',
  S('#5E1F1C', '#FBE9DF', '#F0D4C8', '#D4A597', '#FFB08F', '#FFB08F', '#3A1210', '#5E1F1C', '#FFB08F', '#73302C'),
  '#FFB08F', '#1A0807', '#3A1210', ['#5E1F1C', '#FBE9DF', '#FFB08F', '#3A1210']);
/** Rumah: orang tua, saudara, kakek nenek. */
export const ruangDaun = ruang('daun', 'Daun',
  S('#2D4632', '#F1EBDD', '#D9DECB', '#A9B79E', '#EBC872', '#EBC872', '#1E2B20', '#2D4632', '#EBC872', '#3A563F'),
  '#EBC872', '#0E160F', '#1E2B20', ['#2D4632', '#F1EBDD', '#EBC872', '#1E2B20']);
/** Diri sendiri: refleksi, Pertanyaan Malam. */
export const ruangMalam = ruang('malam', 'Malam',
  S('#131621', '#EDE6DA', '#CFC8BC', '#8F8A84', '#F4B860', '#F4B860', '#131621', '#131621', '#F4B860', '#22263A'),
  '#F4B860', '#07080D', '#0B0D14', ['#131621', '#EDE6DA', '#F4B860', '#22263A']);

export const EDITORIAL_VARIANTS: readonly Variant[] = [roseDusk, sage, midnight, stone, ruangKunyit, ruangBata, ruangDaun, ruangMalam];
