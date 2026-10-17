// What differs between families outside their own layout/draw code: header,
// footer, icons, display face and the font weights the gate waits for.
// Data only (no layout imports), so common.ts, fonts and the registry can all use it.
import { DEV_ICONS, EDITORIAL_ICONS, type IconPolicy } from '../core/iconNames';
import type { FamilyId } from '../core/types';
import type { Variant } from './types';

export interface FamilyTraits {
  /** Right side of the header: the terminal path tag or a short rule. */
  headerRight: 'path' | 'rule';
  /** The cover's swipe hint leads with a circle-arrow icon. */
  coverSwipeIcon: boolean;
  /** Auto-icon pool, and the icon for slides without `icon=`. */
  icons: IconPolicy;
  /** Face for headline-styled extras (verdict stamps, diagram labels). */
  displayFace: 'serif' | 'sans';
  /** Weights per font role that the font gate waits for. */
  weights(v: Variant): { serif?: number[]; sans: number[]; mono: number[] };
}

const editorialWeights = (v: Variant): ReturnType<FamilyTraits['weights']> =>
  v.headlineFace === 'sans'
    ? // Sans headlines (editorial/tameng): the serif only draws quotes (and the 700 quote mark).
      { serif: [...new Set([v.quoteWeight ?? 600, 700])], sans: [...new Set([400, 500, 600, 700, v.headlineWeight ?? 700])], mono: [400, 500, 600] }
    : { serif: [500, 600, 700], sans: [400, 500, 600], mono: [400, 500, 600] };
const EDITORIAL_LIKE: Omit<FamilyTraits, 'icons'> = {
  headerRight: 'rule', coverSwipeIcon: true, displayFace: 'serif', weights: editorialWeights,
};

export const FAMILY_TRAITS: Record<FamilyId, FamilyTraits> = {
  editorial: { ...EDITORIAL_LIKE, icons: { pool: EDITORIAL_ICONS, fallback: 'auto' } },
  // Lexicon and serene decks are icon-free unless a slide asks for one.
  lexicon: { ...EDITORIAL_LIKE, icons: { pool: EDITORIAL_ICONS, fallback: 'none' } },
  serene: { ...EDITORIAL_LIKE, icons: { pool: EDITORIAL_ICONS, fallback: 'none' } },
  dev: {
    headerRight: 'path', coverSwipeIcon: false, displayFace: 'sans', icons: { pool: DEV_ICONS, fallback: 'none' },
    weights: (v) => ({ sans: [400, 500, 600, 700, v.headlineWeight ?? 800], mono: [400, 500, 600, 700] }),
  },
  sport: {
    headerRight: 'rule', coverSwipeIcon: false, displayFace: 'serif', icons: { pool: DEV_ICONS, fallback: 'none' },
    weights: (v) => ({ serif: [700, v.headlineWeight ?? 800], sans: [400, 500, 600, 700], mono: [400, 500, 600, 700] }),
  },
};

export function traitsOf(v: Variant): FamilyTraits {
  return FAMILY_TRAITS[v.family];
}

/** The variant's display face (serif role falls back to sans). */
export function displayFamily(v: Variant): string {
  return traitsOf(v).displayFace === 'sans' ? v.fonts.sans : v.fonts.serif ?? v.fonts.sans;
}
