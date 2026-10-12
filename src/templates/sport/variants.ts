import type { Surface, Variant } from '../types';
import { githubDark } from '../dev/variants';

// Sport family (Whistle Notes, Oct 2026 review): a tactics board, broadcast type, referee-card colours.
// Tokens are DESIGN §6.6 verbatim; all pairs pass contrast.test.ts.

const S = (
  bg: string, ink: string, body: string, muted: string, accent: string,
  badgeBg: string, badgeInk: string, blob: string, icon: string, inlineCodeBg: string,
): Surface => ({ bg, ink, body, muted, accent, badgeBg, badgeInk, blob, icon, inlineCodeBg });

const onPhoto = {
  bg: '#000000', ink: '#FFFFFF', body: 'rgba(255,255,255,0.90)', muted: 'rgba(255,255,255,0.75)',
  accent: '#F5C518', badgeBg: '#F5C518', badgeInk: '#0F1A14', blob: 'rgba(0,0,0,0)', icon: '#FFFFFF',
  inlineCodeBg: 'rgba(255,255,255,0.18)',
};

const base = {
  family: 'sport' as const,
  fonts: { serif: 'Barlow Condensed', sans: 'Barlow', mono: 'JetBrains Mono' },
  code: githubDark.code,
  deco: { blobs: false, dotGrid: false, scanlines: false, glow: false, bigGlyph: null },
  headlineWeight: 800,
  headlineUpper: true,
};

const DARK_SEMANTIC = { ok: '#3DDC84', warn: '#F5C518', bad: '#FF6B63' };

/** Football: tactics-board green, chalk lines. */
export const papan: Variant = {
  ...base,
  id: 'sport/papan',
  name: 'Papan',
  surfaces: {
    papan: S('#0F3324', '#F4F1E8', '#CFE0D3', '#8FB09A', '#F5C518', '#F5C518', '#0F3324', '#0F3324', '#F5C518', '#15452F'),
    deep: S('#0B2A1D', '#F4F1E8', '#CFE0D3', '#8FB09A', '#F5C518', '#F5C518', '#0B2A1D', '#0B2A1D', '#F5C518', '#123C29'),
  },
  rotation: ['papan'],
  onPhoto: { ...onPhoto, tint: '#06140D' },
  semantic: DARK_SEMANTIC,
  swatches: ['#0F3324', '#15452F', '#F5C518', '#F4F1E8'],
};

/** Indoor sports (badminton, volleyball, basketball): court blue. */
export const lapangan: Variant = {
  ...base,
  id: 'sport/lapangan',
  name: 'Lapangan',
  surfaces: {
    lapangan: S('#14284A', '#F4F1E8', '#D2DBEA', '#93A3C2', '#F5C518', '#F5C518', '#14284A', '#14284A', '#F5C518', '#1C3766'),
    deep: S('#0F1F3A', '#F4F1E8', '#D2DBEA', '#93A3C2', '#F5C518', '#F5C518', '#0F1F3A', '#0F1F3A', '#F5C518', '#18305A'),
  },
  rotation: ['lapangan'],
  onPhoto: { ...onPhoto, tint: '#070E1C' },
  semantic: DARK_SEMANTIC,
  swatches: ['#14284A', '#1C3766', '#F5C518', '#F4F1E8'],
};

/** Myth-vs-rule posts: light chalk paper. */
export const kapur: Variant = {
  ...base,
  id: 'sport/kapur',
  name: 'Kapur',
  surfaces: {
    kapur: S('#EFECE3', '#141714', '#3A3F3B', '#6F726C', '#8A5A00', '#141714', '#EFECE3', '#EFECE3', '#8A5A00', '#E2DED2'),
    deep: S('#E6E2D7', '#141714', '#3A3F3B', '#6A6D67', '#8A5A00', '#141714', '#E6E2D7', '#E6E2D7', '#8A5A00', '#D8D3C5'),
  },
  rotation: ['kapur'],
  onPhoto: { ...onPhoto, tint: '#0B0C0B' },
  semantic: { ok: '#1E7A43', warn: '#8A5A00', bad: '#B3261E' },
  swatches: ['#EFECE3', '#141714', '#B3261E', '#1E7A43'],
};

export const SPORT_VARIANTS: readonly Variant[] = [papan, lapangan, kapur];
