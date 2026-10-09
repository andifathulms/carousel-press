import { contrast, withAlpha } from '../../core/color';
import type { LexTokens, Surface, Variant } from '../types';

/** Fixed ok/bad pairs for families without lexicon tokens (SPEC-lexicon §4). */
const LIGHT = { okBg: '#E3EEDB', okInk: '#2E5A2A', badBg: '#F6DCD8', badInk: '#8E1F17' };
const DARK = { okBg: '#1E3A24', okInk: '#9BE3A6', badBg: '#3E1E1C', badInk: '#F5A39A' };

/** A surface is dark when white text reads better on it than near-black. */
export function isDarkSurface(s: Surface, onPhoto: boolean): boolean {
  if (onPhoto) return true;
  return contrast('#FFFFFF', s.bg) > contrast('#111111', s.bg);
}

/** Lexicon tokens for a slide: the variant's own on paper, derived elsewhere. */
export function lexTokens(v: Variant, s: Surface, onPhoto: boolean): LexTokens {
  const dark = isDarkSurface(s, onPhoto);
  if (v.lex && !dark) return v.lex;
  const pair = dark ? DARK : LIGHT;
  return { rule: withAlpha(s.muted, 0.3), highlight: withAlpha(s.accent, 0.22), ...pair };
}
