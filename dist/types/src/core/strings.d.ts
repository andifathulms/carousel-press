import type { Lang } from './types';
export type StringKey = 'swipe' | 'coverSwipe' | 'cta' | 'compareWrong' | 'compareRight' | 'labelMeaning' | 'labelExample' | 'labelOrigin' | 'labelSay' | 'portion' | 'gradeLabel' | 'hadithLabel';
/** Built-in slide strings (PRD §4.7). Add a language by adding one column. */
export declare const STRINGS: Record<StringKey, Record<Lang, string>>;
export declare function t(key: StringKey, lang: Lang): string;
/**
 * Split a trailing arrow off a string. Renderers draw the arrow as an icon
 * (font coverage of "→" differs), never as a glyph.
 */
export declare function splitArrow(text: string): {
    text: string;
    arrow: boolean;
};
