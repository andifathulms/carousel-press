/** Colour helpers (pure). Accepts #RGB, #RRGGBB and rgba(r,g,b,a). */
export interface RGBA {
    r: number;
    g: number;
    b: number;
    a: number;
}
export declare function parseColor(c: string): RGBA;
/** `rgba()` string of a colour at a given alpha. */
export declare function withAlpha(c: string, alpha: number): string;
/** Composite fg over an opaque bg. */
export declare function over(fg: RGBA, bg: RGBA): RGBA;
/** WCAG relative luminance. */
export declare function luminance(c: RGBA): number;
/** WCAG contrast ratio of fg (composited) on bg. */
export declare function contrast(fg: string, bg: string): number;
