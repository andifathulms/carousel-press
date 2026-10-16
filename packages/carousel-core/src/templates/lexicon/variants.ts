import type { CodeTheme, Surface, Variant } from '../types';

// Tokens are SPEC-lexicon §3.2 verbatim unless a comment says otherwise.

const S = (
  bg: string, ink: string, body: string, muted: string, accent: string,
  badgeBg: string, badgeInk: string, blob: string, icon: string, inlineCodeBg: string,
): Surface => ({ bg, ink, body, muted, accent, badgeBg, badgeInk, blob, icon, inlineCodeBg });

const onPhotoBase = {
  bg: '#000000', ink: '#FFFFFF', body: 'rgba(255,255,255,0.90)', muted: 'rgba(255,255,255,0.75)',
  icon: '#FFFFFF', blob: 'rgba(0,0,0,0)', inlineCodeBg: 'rgba(255,255,255,0.18)',
};

/** Paper code panel (not in the spec; lexicon decks rarely use code). */
const paperCode: CodeTheme = {
  panel: '#FFFFFF', border: '#DCCFB8', text: '#24292F', prompt: '#1D4ED8', command: '#16181D',
  subcommand: '#7C2D12', flag: '#8A3B00', string: '#0F6B3A', comment: '#6B7280', number: '#8A3B00',
  keyword: '#9B2C2C', fn: '#5B21B6', punct: '#3F3F46', dots: null,
};

export const kamus: Variant = {
  id: 'lexicon/kamus',
  name: 'Kamus',
  family: 'lexicon',
  fonts: { serif: 'Lora', sans: 'DM Sans', mono: 'JetBrains Mono' },
  surfaces: {
    paper: S('#F6F1E7', '#1E1B18', '#3A342D', '#6E665C', '#A3221B', '#B3261E', '#FFFFFF', '#F6F1E7', '#B3261E', '#EAE1CF'),
    'paper-alt': S('#EFE7D6', '#1E1B18', '#37312A', '#675F55', '#9E211A', '#B3261E', '#FFFFFF', '#EFE7D6', '#B3261E', '#E3D8C2'),
    deep: S('#2A211C', '#F6F1E7', '#E1D8C8', '#B3A894', '#F08A7E', '#F08A7E', '#2A211C', '#2A211C', '#F08A7E', '#3A2F28'),
  },
  rotation: ['paper', 'paper-alt'],
  onPhoto: { ...onPhotoBase, accent: '#F5B3AA', badgeBg: '#F08A7E', badgeInk: '#2A211C', tint: '#1A1410' },
  code: paperCode,
  deco: { blobs: false, dotGrid: false, scanlines: false, glow: false, bigGlyph: null, doubleRule: true },
  swatches: ['#F6F1E7', '#B3261E', '#1E1B18', '#E8DFCC'],
  lex: { rule: '#DCCFB8', highlight: '#F3D9A4', okBg: '#E3EEDB', okInk: '#2E5A2A', badBg: '#F6DCD8', badInk: '#8E1F17' },
};

export const notebook: Variant = {
  id: 'lexicon/notebook',
  name: 'Notebook',
  family: 'lexicon',
  fonts: { serif: 'Lora', sans: 'DM Sans', mono: 'JetBrains Mono' },
  surfaces: {
    page: S('#FBFBF7', '#1B2430', '#364152', '#677184', '#2448B8', '#2F5BD3', '#FFFFFF', '#FBFBF7', '#2F5BD3', '#EEF1F8'),
    deep: S('#1D2A44', '#F4F6FB', '#D5DBE8', '#A3AEC4', '#9DB6FF', '#FFE58A', '#1D2A44', '#1D2A44', '#FFE58A', '#2A3A5C'),
  },
  rotation: ['page'],
  onPhoto: { ...onPhotoBase, accent: '#FFE58A', badgeBg: '#FFE58A', badgeInk: '#1D2A44', tint: '#0E1424' },
  code: paperCode,
  deco: { blobs: false, dotGrid: false, scanlines: false, glow: false, bigGlyph: null, notebook: true },
  swatches: ['#FBFBF7', '#2F5BD3', '#1B2430', '#FFE58A'],
  lex: {
    rule: '#DCE4F2', highlight: '#FFE58A', okBg: '#DFF1E2', okInk: '#1F6B33', badBg: '#FBE0DD', badInk: '#A3261C', margin: '#E7877D',
  },
};

/**
 * SKD Harian (Oct 2026): an exam answer sheet. Square-grid paper with teal ink, graphite
 * covers with a pencil-yellow accent, Barlow throughout (printed-form feel, lining figures).
 * Not in SPEC-lexicon; tokens checked by contrast.test.ts.
 */
export const lembar: Variant = {
  id: 'lexicon/lembar',
  name: 'Lembar',
  family: 'lexicon',
  fonts: { serif: 'Barlow', sans: 'Barlow', mono: 'JetBrains Mono' },
  surfaces: {
    paper: S('#FBFBF8', '#1C2024', '#394047', '#666E76', '#0B6B61', '#0B6B61', '#FFFFFF', '#FBFBF8', '#0B6B61', '#E6F0EE'),
    deep: S('#23272C', '#F5F5F2', '#D6D8D6', '#A2A7AB', '#F2C94C', '#F2C94C', '#23272C', '#23272C', '#F2C94C', '#31363C'),
  },
  rotation: ['paper'],
  onPhoto: { ...onPhotoBase, accent: '#F2C94C', badgeBg: '#F2C94C', badgeInk: '#23272C', tint: '#121417' },
  code: paperCode,
  deco: { blobs: false, dotGrid: false, scanlines: false, glow: false, bigGlyph: null, grid: 'squares', gridColor: 'rgba(11,107,97,0.08)' },
  swatches: ['#FBFBF8', '#0B6B61', '#23272C', '#F2C94C'],
  lex: { rule: '#D5E2DF', highlight: '#FBE38E', okBg: '#DDF0E6', okInk: '#17633A', badBg: '#FBE0DD', badInk: '#A3261C' },
};

/** Kosakata Arab (SPEC-script §10.1): ivory exercise-book paper, lapis ink, terracotta root letters. Tokens verbatim. */
export const arab: Variant = {
  id: 'lexicon/arab',
  name: 'Arab',
  family: 'lexicon',
  fonts: { serif: 'Lora', sans: 'DM Sans', mono: 'JetBrains Mono' },
  surfaces: {
    paper: S('#F7F3EA', '#1C2230', '#364052', '#646A7A', '#1F4E8C', '#1F4E8C', '#FFFFFF', '#F7F3EA', '#1F4E8C', '#ECE5D6'),
    'paper-alt': S('#EFE8DA', '#1C2230', '#343E50', '#5E6474', '#1D4A85', '#1F4E8C', '#FFFFFF', '#EFE8DA', '#1F4E8C', '#E4DCCB'),
    deep: S('#142338', '#F7F3EA', '#D6DCE6', '#A2ACBC', '#E9B872', '#E9B872', '#142338', '#142338', '#E9B872', '#1F3150'),
  },
  rotation: ['paper', 'paper-alt'],
  onPhoto: { ...onPhotoBase, accent: '#F2D59B', badgeBg: '#E9B872', badgeInk: '#142338', tint: '#0B1220' },
  code: paperCode,
  deco: { blobs: false, dotGrid: false, scanlines: false, glow: false, bigGlyph: null, notebookRight: true },
  swatches: ['#F7F3EA', '#1F4E8C', '#A3402A', '#1C2230'],
  lex: { rule: '#DDD3C0', highlight: '#F2D59B', okBg: '#E3EEDB', okInk: '#2E5A2A', badBg: '#F6DCD8', badInk: '#8E1F17', root: '#A3402A' },
  lexSurfaces: { 'paper-alt': { root: '#9C3D28' }, deep: { root: '#F2A285' } },
};

export const LEXICON_VARIANTS: readonly Variant[] = [kamus, notebook, lembar, arab];
