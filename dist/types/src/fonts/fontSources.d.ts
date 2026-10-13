/** One font file. `weight` is a single weight or a [min, max] range (variable-weight woff2). */
export interface FontFaceSource {
    family: string;
    weight: number | [number, number];
    style?: 'normal' | 'italic';
    url: string;
    unicodeRange?: string;
}
export interface FontConfig {
    /** URL of the package's fonts/ directory (default: ../fonts/ next to the module). */
    baseUrl?: string | URL;
    /** Per-file URL, for bundlers that rename assets. Wins over baseUrl. */
    resolveUrl?: (file: string) => string;
    /** Faces for host variants. They are matched before the bundled ones. */
    faces?: FontFaceSource[];
}
interface ManifestFace {
    family: string;
    style: string;
    weight: string;
    file: string;
    unicodeRange?: string;
}
export declare const BUNDLED_FACES: readonly ManifestFace[];
/** Set where fonts are served from and/or add host faces. Call before rendering. */
export declare function configureFonts(config: FontConfig): void;
/** The files that provide `family` at `weight`: host faces first, else the bundled ones. */
export declare function sourcesFor(family: string, weight: number, style?: string): FontFaceSource[];
/** Add the FontFaces for one family/weight to document.fonts (once each). Returns their URLs. */
export declare function registerFace(family: string, weight: number, style?: string): string[];
export {};
