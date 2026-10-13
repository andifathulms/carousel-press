export interface FontSpec {
    family: string;
    weight: number;
    size: number;
}
export interface TextMeasurer {
    width(text: string, font: FontSpec): number;
    /** False when `family` isn't loaded for `sample` (real fonts only). Absent = assume loaded. */
    hasFace?(family: string, sample: string): boolean;
}
export declare function isMonoFamily(family: string): boolean;
/**
 * Legibility floor for a face: monospace glyphs are ~15% wider than sans, so a mono face
 * reads like sans at about 2 px more. Minimum sizes are written for proportional faces.
 */
export declare function legibleMin(min: number, family: string): number;
/** Generic fallbacks per face. The real faces are always loaded before export. */
export declare function fallbackStack(family: string): string;
/** Arabic inside Latin text (honorifics such as ﷺ) falls through to the bundled Amiri face (arabic subset only). */
export declare const ARABIC_FALLBACK = "Amiri";
/** Full CSS/canvas font string, e.g. `700 92px "Playfair Display", "Amiri", Georgia, serif`. */
export declare function fontString(f: FontSpec): string;
/** Minimal surface of a 2D context needed to measure text. */
export interface MeasureContext {
    font: string;
    measureText(text: string): {
        width: number;
    };
}
/** Canvas-backed measurer with a small cache. The context (and optional face check) is passed in. */
export declare function createCanvasMeasurer(ctx: MeasureContext, hasFace?: (family: string, sample: string) => boolean): TextMeasurer;
/** Deterministic measurer for tests: length × size × 0.52 (mono 0.6), combining marks excluded. */
export declare const fakeMeasurer: TextMeasurer;
