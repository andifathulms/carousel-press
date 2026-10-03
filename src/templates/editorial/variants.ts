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

export const EDITORIAL_VARIANTS: readonly Variant[] = [roseDusk, sage, midnight];
