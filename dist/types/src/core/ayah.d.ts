import type { Rich, Slide } from './types';
import { type Line, type Warn } from './lexicon';
export declare const AYAH_FIELDS: readonly ["arab", "terjemah", "ref", "source", "mark", "portion"];
export declare const HADITH_FIELDS: readonly ["arab", "text", "ref", "grade", "source"];
/** Translation text: only `|` line breaks apply (`\|` is a literal pipe). No accent or code markers. */
export declare function pipeLines(src: string): Rich;
/** `28` → `٢٨`. */
export declare function toArabicDigits(n: string): string;
/** End-of-ayah ornament for `mark` (default: last number in `ref`), or null when off/absent (SPEC-ayah §2). */
export declare function ayahMark(f: Record<string, string>): string | null;
export declare function fillAyah(slide: Slide, content: readonly Line[], warn: Warn): void;
export declare function fillHadith(slide: Slide, content: readonly Line[], warn: Warn): void;
