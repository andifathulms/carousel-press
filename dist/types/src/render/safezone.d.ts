export declare const CANVAS: {
    w: number;
    h: number;
};
/** Regions TikTok's photo-mode UI covers (estimates; verified by the owner with the test image). */
export declare const UI_ZONES: {
    tabs: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    buttons: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    caption: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
};
/** Everything that carries meaning must stay inside this box. Content width 816. */
export declare const SAFE: {
    left: number;
    right: number;
    top: number;
    bottom: number;
};
export declare const CONTENT_W: number;
/** Shared rows (DESIGN §2–3). */
export declare const ROWS: {
    headerBaseline: number;
    stackTopCard: number;
    stackTopCover: number;
    stackLimit: number;
    footerBaseline: number;
};
export declare const GRID = 8;
export interface Box {
    x: number;
    y: number;
    w: number;
    h: number;
    kind: string;
}
export declare function insideSafe(b: Box): boolean;
