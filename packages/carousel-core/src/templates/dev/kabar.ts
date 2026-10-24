import type { Surface, Variant } from '../types';
import { githubDark } from './variants';

// Kabar Dev (Fathul Learn Coding, Oct 2026): tech and security news explained plainly. A news
// bulletin look, distinct from the terminal tutorials: deep ink, a red alert band across the top,
// warm paper-white type, severity stamps (KRITIS / PENTING / INFO) via verdict= and tone=.
// Tokens pass contrast.test.ts.

const S = (
  bg: string, ink: string, body: string, muted: string, accent: string,
  badgeBg: string, badgeInk: string, blob: string, icon: string, inlineCodeBg: string,
): Surface => ({ bg, ink, body, muted, accent, badgeBg, badgeInk, blob, icon, inlineCodeBg });

export const kabar: Variant = {
  ...githubDark,
  id: 'dev/kabar',
  name: 'Kabar',
  surfaces: {
    main: S('#11151D', '#F5F2EA', '#D3D6DD', '#959CAA', '#FF5A4F', '#FF5A4F', '#11151D', '#11151D', '#FF5A4F', '#1F2531'),
    deep: S('#0B0E14', '#F5F2EA', '#D3D6DD', '#9097A4', '#FF5A4F', '#FF5A4F', '#0B0E14', '#0B0E14', '#FF5A4F', '#1A1F2A'),
  },
  rotation: ['main'],
  onPhoto: { ...githubDark.onPhoto, accent: '#FF5A4F', badgeBg: '#FF5A4F', tint: '#05070A' },
  semantic: { ok: '#3DDC84', warn: '#FFC233', bad: '#FF5A4F' },
  deco: { blobs: false, dotGrid: false, scanlines: false, glow: false, bigGlyph: null, newsBand: true },
  swatches: ['#11151D', '#1F2531', '#FF5A4F', '#F5F2EA'],
};
