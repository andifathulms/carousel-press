import { type IconPolicy } from '../core/iconNames';
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
    weights(v: Variant): {
        serif?: number[];
        sans: number[];
        mono: number[];
    };
}
export declare const FAMILY_TRAITS: Record<FamilyId, FamilyTraits>;
export declare function traitsOf(v: Variant): FamilyTraits;
/** The variant's display face (serif role falls back to sans). */
export declare function displayFamily(v: Variant): string;
