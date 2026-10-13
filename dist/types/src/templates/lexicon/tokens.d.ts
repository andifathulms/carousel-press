import type { LexTokens, Surface, Variant } from '../types';
/** A surface is dark when white text reads better on it than near-black. */
export declare function isDarkSurface(s: Surface, onPhoto: boolean): boolean;
/** Lexicon tokens for a slide: the variant's own on paper, derived elsewhere. */
export declare function lexTokens(v: Variant, s: Surface, onPhoto: boolean): LexTokens;
