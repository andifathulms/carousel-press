import type { Surface, Variant } from '../types';

// Tokens are DESIGN §6.1 verbatim unless a comment says otherwise.

const S = (
  bg: string, ink: string, body: string, muted: string, accent: string,
  badgeBg: string, badgeInk: string, blob: string, icon: string, inlineCodeBg: string,
): Surface => ({ bg, ink, body, muted, accent, badgeBg, badgeInk, blob, icon, inlineCodeBg });

const darkOnPhoto = {
  bg: '#000000', ink: '#FFFFFF', body: 'rgba(255,255,255,0.88)', muted: 'rgba(255,255,255,0.75)',
  accent: '#56D364', badgeBg: '#3FB950', badgeInk: '#0D1117', blob: 'rgba(0,0,0,0)', icon: '#FFFFFF',
  inlineCodeBg: 'rgba(255,255,255,0.18)', tint: '#05070A',
};

export const githubDark: Variant = {
  id: 'dev/github-dark',
  name: 'GitHub Dark',
  family: 'dev',
  fonts: { sans: 'Inter', mono: 'JetBrains Mono' },
  surfaces: {
    main: S('#0D1117', '#F0F6FC', '#C9D1D9', '#8B949E', '#3FB950', '#3FB950', '#0D1117', '#0D1117', '#3FB950', '#1F2630'),
    deep: S('#0A0D12', '#F0F6FC', '#C9D1D9', '#8B949E', '#3FB950', '#3FB950', '#0A0D12', '#0A0D12', '#3FB950', '#1F2630'),
  },
  rotation: ['main'],
  onPhoto: darkOnPhoto,
  code: {
    panel: '#161B22', border: '#30363D', text: '#C9D1D9', prompt: '#3FB950', command: '#F0F6FC',
    subcommand: '#79C0FF', flag: '#FFA657', string: '#A5D6FF', comment: '#8B949E', number: '#79C0FF',
    keyword: '#FF7B72', fn: '#D2A8FF', punct: '#C9D1D9', dots: ['#FF7B72', '#E3B341', '#3FB950'],
  },
  deco: {
    blobs: false, dotGrid: true, scanlines: false, glow: true, bigGlyph: '$_',
    dotColor: 'rgba(255,255,255,0.05)', glowAlpha: 0.08,
  },
  swatches: ['#0D1117', '#161B22', '#3FB950', '#F0F6FC'],
};

export const terminal: Variant = {
  id: 'dev/terminal',
  name: 'Terminal',
  family: 'dev',
  fonts: { sans: 'JetBrains Mono', mono: 'JetBrains Mono' },
  surfaces: {
    main: S('#0B0F0C', '#D7FBD9', '#A9C9AB', '#6B8A6E', '#39D353', '#39D353', '#0B0F0C', '#0B0F0C', '#39D353', '#16201A'),
    deep: S('#070A08', '#D7FBD9', '#A9C9AB', '#6B8A6E', '#39D353', '#39D353', '#070A08', '#070A08', '#39D353', '#16201A'),
  },
  rotation: ['main'],
  onPhoto: { ...darkOnPhoto, accent: '#39D353', badgeBg: '#39D353', badgeInk: '#0B0F0C' },
  code: {
    panel: '#101712', border: '#1E2C21', text: '#B9E5BC', prompt: '#39D353', command: '#D7FBD9',
    subcommand: '#7EE787', flag: '#E3B341', string: '#9BE9A8',
    comment: '#6B8A6E',
    number: '#E3B341', keyword: '#39D353', fn: '#A5F3B0', punct: '#A9C9AB', dots: null,
  },
  deco: { blobs: false, dotGrid: false, scanlines: true, glow: true, bigGlyph: '>_', glowAlpha: 0.06 },
  swatches: ['#0B0F0C', '#101712', '#39D353', '#D7FBD9'],
  headlineWeight: 700,
  headlinePrefix: '> ',
};

export const paperLight: Variant = {
  id: 'dev/paper-light',
  name: 'Paper Light',
  family: 'dev',
  fonts: { sans: 'Inter', mono: 'JetBrains Mono' },
  surfaces: {
    main: S('#F7F5F0', '#16181D', '#3A3F47', '#6B7079', '#1D4ED8', '#2563EB', '#FFFFFF', '#F7F5F0', '#2563EB', '#ECE8DE'),
    deep: S('#EFECE4', '#16181D', '#3A3F47', '#6B7079', '#1D4ED8', '#2563EB', '#FFFFFF', '#EFECE4', '#2563EB', '#E4DFD3'),
  },
  rotation: ['main'],
  onPhoto: darkOnPhoto,
  code: {
    panel: '#FFFFFF', border: '#E3DFD5', text: '#24292F', prompt: '#1D4ED8', command: '#16181D',
    subcommand: '#0550AE', flag: '#B35900', string: '#0A7A3D', comment: '#6E7781', number: '#0550AE',
    keyword: '#C0283B', fn: '#6F42C1', punct: '#3A3F47', dots: ['#E5E1D8', '#E5E1D8', '#E5E1D8'],
  },
  deco: { blobs: false, dotGrid: true, scanlines: false, glow: false, bigGlyph: '{ }', dotColor: 'rgba(0,0,0,0.06)' },
  swatches: ['#F7F5F0', '#FFFFFF', '#2563EB', '#16181D'],
};

export const DEV_VARIANTS: readonly Variant[] = [githubDark, terminal, paperLight];
