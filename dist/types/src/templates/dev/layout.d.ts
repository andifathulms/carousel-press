import { type LayoutInput, type SlideLayout } from '../common';
/** Dev type scale (DESIGN §3.4). Headline weights may be overridden per variant (terminal). */
export declare const TYPE: {
    coverHeadline: {
        weight: number;
        max: number;
        min: number;
        step: number;
        lh: number;
        maxLines: number;
        widowFix: true;
    };
    coverSubtitle: {
        weight: number;
        max: number;
        min: number;
        step: number;
        lh: number;
        maxLines: number;
    };
    cardHeadline: {
        weight: number;
        max: number;
        min: number;
        step: number;
        lh: number;
        maxLines: number;
        widowFix: true;
    };
    codeHeadline: {
        weight: number;
        max: number;
        min: number;
        step: number;
        lh: number;
        maxLines: number;
        widowFix: true;
    };
    body: {
        weight: number;
        max: number;
        min: number;
        step: number;
        lh: number;
        maxLines: number;
    };
    note: {
        weight: number;
        max: number;
        min: number;
        step: number;
        lh: number;
        maxLines: number;
    };
    quote: {
        weight: number;
        max: number;
        min: number;
        step: number;
        lh: number;
        maxLines: number;
        widowFix: true;
    };
    endHeadline: {
        weight: number;
        max: number;
        min: number;
        step: number;
        lh: number;
        maxLines: number;
        widowFix: true;
    };
};
/** Sport headlines: Barlow Condensed capitals are ~25% narrower, so they run larger (DESIGN §6.6). */
export declare const SPORT_TYPE: {
    coverHeadline: {
        max: number;
        min: number;
        weight: number;
        step: number;
        lh: number;
        maxLines: number;
        widowFix: true;
    };
    cardHeadline: {
        max: number;
        min: number;
        lh: number;
        maxLines: number;
        weight: number;
        step: number;
        widowFix: true;
    };
    codeHeadline: {
        max: number;
        min: number;
        lh: number;
        weight: number;
        step: number;
        maxLines: number;
        widowFix: true;
    };
    endHeadline: {
        max: number;
        min: number;
        lh: number;
        weight: number;
        step: number;
        maxLines: number;
        widowFix: true;
    };
};
export declare const FIXED: {
    number: {
        size: number;
        weight: number;
        h: number;
        bar: {
            w: number;
            h: number;
            gap: number;
        };
    };
    kicker: {
        size: number;
        weight: number;
        tracking: number;
        padY: number;
        padX: number;
        border: number;
        radius: number;
    };
    attribution: {
        size: number;
        weight: number;
        lh: number;
    };
    icon: number;
    code: {
        max: number;
        maxShort: number;
        shortLines: number;
        min: number;
        step: number;
        lh: number;
        maxLines: number;
        padX: number;
        padY: number;
        titleBar: number;
        radius: number;
    };
    quoteMark: {
        size: number;
        weight: number;
        x: number;
        top: number;
    };
};
/** Stack anchors and gaps (DESIGN §6.3). */
export declare const STACK: {
    coverTop: number;
    cardTop: number;
    quoteTop: number;
    endTop: number;
    gap: number;
    codeNumberGap: number;
    codeBodyGap: number;
    codeGap: number;
    noteGap: number;
    iconGap: number;
    quoteBodyGap: number;
    endCtaGap: number;
};
export declare function layoutDev(input: LayoutInput): SlideLayout;
