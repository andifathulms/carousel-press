export declare const SLUG_MAX = 40;
/**
 * Lowercase a–z0–9 and `-` only. Accents are transliterated via NFKD and
 * stripping combining marks; everything else becomes a separator.
 */
export declare function slugify(input: string, max?: number): string;
/**
 * Photo ID from a file name: strip the extension, slugify, de-duplicate.
 * All-digit names get a `photo-` prefix, since `photo=<integer>` is always a tray index.
 */
export declare function photoIdFromName(fileName: string, existing: Iterable<string>): string;
/** Append -2, -3… until the id is not taken. */
export declare function uniqueId(base: string, existing: Iterable<string>): string;
/** `{slug}_{NN}.png` with a 1-based, 2-digit index. */
export declare function slideFileName(slug: string, index: number): string;
