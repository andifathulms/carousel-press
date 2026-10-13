import type { Ctx } from './ctx';
import type { Deck, Slide, Warning } from '../core/types';
import type { PoolIcon } from '../core/iconNames';
import { type TextMeasurer } from '../layout/measure';
import type { SlideLayout } from '../templates/common';
import type { Variant } from '../templates/types';
import { type PhotoInput } from './photo';
import { type Box } from './safezone';
export interface RenderAssets {
    photo: PhotoInput | null;
    /** 0–100 */
    darkness: number;
    icon: PoolIcon | null;
    /** Preview only: outline overflowing slides in red. Never set for export. */
    preview?: boolean;
}
export interface RenderResult {
    warnings: Warning[];
    boxes: Box[];
    overflow: boolean;
    layout: SlideLayout;
}
/** Overflow outline drawn in the preview only. */
export declare const OVERFLOW_OUTLINE: {
    color: string;
    width: number;
    dash: number[];
};
/** Pure layout of one slide (no drawing). */
export declare function layoutSlide(slide: Slide, deck: Deck, variant: Variant, measurer: TextMeasurer, icon: PoolIcon | null, hasPhoto: boolean): SlideLayout;
/** Icons for every slide of a deck under a variant's family. */
export declare function deckIcons(deck: Deck, variant: Variant): (PoolIcon | null)[];
/**
 * The one render path: draws a slide onto any 1080×1920 context. Preview and
 * export both call this, on different canvases.
 */
export declare function renderSlide(ctx: Ctx, slide: Slide, deck: Deck, variant: Variant, assets: RenderAssets): RenderResult;
