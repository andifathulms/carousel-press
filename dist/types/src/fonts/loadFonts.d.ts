import type { Variant } from '../templates/types';
export { configureFonts, type FontConfig, type FontFaceSource } from './fontSources';
export interface Face {
    family: string;
    weight: number;
    /** Sample text that pulls in the subsets this face is used for. */
    text?: string;
}
/** IPA sample: latin-ext (ɔ ː ʃ ŋ ˈ) and greek (θ) subsets. */
export declare const IPA_SAMPLE = "\u03B8\u0254\u02D0\u00E6\u0283\u0292\u014B\u0259\u025C\u026A\u028A\u02C8\u02CC\u00F0";
export declare const FONT_TIMEOUT_MS = 8000;
/** Every face/weight a variant draws with. */
export declare function facesFor(v: Variant): Face[];
/**
 * Resolve once document.fonts.load() succeeded for every face the variant
 * uses. Rejects with the faces still missing after FONT_TIMEOUT_MS, or as soon
 * as a face fails. Never resolves with fallback fonts.
 */
export declare function loadFonts(v: Variant, timeoutMs?: number): Promise<void>;
/** Load every variant's faces (review page, template gallery). */
export declare function loadAllFonts(variants: readonly Variant[]): Promise<void>;
/** Load one face outside any variant (safe-zone overlay and test image). */
export declare function loadFace(family: string, weight: number, text?: string, timeoutMs?: number): Promise<void>;
