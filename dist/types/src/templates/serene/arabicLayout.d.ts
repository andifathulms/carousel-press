import { type TextMeasurer } from '../../layout/measure';
import { type LayoutInput, type SlideLayout } from '../common';
export declare const AYAH_FACE = "Amiri Quran";
export declare const HADITH_FACE = "Amiri";
/** Text that pulls in the Arabic subset (letters, harakat, digits, ornate parentheses). */
export declare const ARABIC_SAMPLE = "\u0628\u0650\u0633\u0652\u0645\u0650 \u0671\u0644\u0644\u064E\u0651\u0647\u0650 \uFD3F\u0661\u0662\uFD3E";
/** SPEC-ayah §2–3.2. `baseline` = first baseline below the line top, in em (room for marks above). */
export declare const AYAH: {
    top: number;
    bottom: number;
    star: {
        size: number;
        width: number;
        alpha: number;
        gap: number;
    };
    arab: {
        max: number;
        min: number;
        step: number;
        lh: number;
        baseline: number;
        gap: number;
    };
    divider: {
        w: number;
        h: number;
        alpha: number;
        gap: number;
    };
    terjemah: {
        weight: number;
        max: number;
        min: number;
        step: number;
        lh: number;
        maxLines: number;
        gap: number;
    };
    ref: {
        size: number;
        weight: number;
        lh: number;
        gap: number;
    };
    source: {
        size: number;
        weight: number;
        lh: number;
    };
};
export declare const HADITH: {
    pill: {
        size: number;
        weight: number;
        tracking: number;
        padX: number;
        h: number;
        gap: number;
    };
    arab: {
        max: number;
        min: number;
        step: number;
        lh: number;
        baseline: number;
        gap: number;
    };
    text: {
        weight: number;
        max: number;
        min: number;
        step: number;
        lh: number;
        maxLines: number;
        gap: number;
    };
    ref: {
        size: number;
        weight: number;
        lh: number;
        gap: number;
    };
    grade: {
        size: number;
        weight: number;
        padX: number;
        h: number;
        radius: number;
        gapX: number;
        gap: number;
    };
    source: {
        size: number;
        weight: number;
        lh: number;
    };
};
interface ArabicWrap {
    lines: string[];
    widths: number[];
    fits: boolean;
}
/**
 * Greedy wrap at spaces only. Words are measured whole (with their marks). The
 * end-of-ayah mark is glued to the last word so it never sits alone.
 */
export declare function wrapArabic(text: string, family: string, size: number, width: number, m: TextMeasurer, mark: string | null): ArabicWrap;
export declare function layoutArabicSlide(input: LayoutInput): SlideLayout;
export {};
