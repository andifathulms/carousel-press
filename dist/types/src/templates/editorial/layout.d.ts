import { type LayoutInput, type SlideLayout } from '../common';
/** Editorial type scale (DESIGN §3.4). */
export declare const TYPE: {
    coverHeadline: {
        face: "serif";
        weight: number;
        max: number;
        min: number;
        step: number;
        lh: number;
        maxLines: number;
        widowFix: true;
    };
    coverSubtitle: {
        face: "sans";
        weight: number;
        max: number;
        min: number;
        step: number;
        lh: number;
        maxLines: number;
    };
    cardHeadline: {
        face: "serif";
        weight: number;
        max: number;
        min: number;
        step: number;
        lh: number;
        maxLines: number;
        widowFix: true;
    };
    body: {
        face: "sans";
        weight: number;
        max: number;
        min: number;
        step: number;
        lh: number;
        maxLines: number;
    };
    note: {
        face: "sans";
        weight: number;
        max: number;
        min: number;
        step: number;
        lh: number;
        maxLines: number;
    };
    quote: {
        face: "serif";
        weight: number;
        max: number;
        min: number;
        step: number;
        lh: number;
        maxLines: number;
        widowFix: true;
    };
    endHeadline: {
        face: "serif";
        weight: number;
        max: number;
        min: number;
        step: number;
        lh: number;
        maxLines: number;
        widowFix: true;
    };
};
export declare const FIXED: {
    kicker: {
        size: number;
        weight: number;
        tracking: number;
        h: number;
    };
    attribution: {
        size: number;
        weight: number;
        lh: number;
    };
    badge: {
        d: number;
        digit: number;
        weight: number;
        opticalY: number;
    };
    icon: number;
    code: {
        max: number;
        min: number;
        step: number;
        lh: number;
        maxLines: number;
        pad: number;
        radius: number;
    };
    quoteMark: {
        size: number;
        weight: number;
        alpha: number;
        x: number;
        top: number;
    };
};
/** Stack anchors and gaps (DESIGN §5.2–5.6). */
export declare const STACK: {
    coverTop: number;
    cardTop: number;
    cardTopNoBadge: number;
    quoteTop: number;
    endTop: number;
    kickerGap: number;
    headlineGap: number;
    cardGap: number;
    iconGap: number;
    noteGap: number;
    attributionGap: number;
    quoteBodyGap: number;
};
export declare function layoutEditorial(input: LayoutInput, opts?: {
    center?: boolean;
}): SlideLayout;
