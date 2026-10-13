import type { ParseOptions } from '../core/parser';
import { type Deck, type Warning } from '../core/types';
import type { PhotoInput } from '../render/photo';
import type { Variant } from '../templates/types';
export { parseDeck } from './parse';
/** Wait for every face a variant (by id, or the variant itself) draws with. Rejects after 8 s. */
export declare function loadFonts(variant: string | Variant): Promise<void>;
/** Thrown by renderDeck() before anything is drawn when a slide overflows or can't render. */
export declare class BlockingWarningsError extends Error {
    readonly warnings: Warning[];
    constructor(warnings: Warning[]);
}
/**
 * Layout warnings for every slide with real fonts (the export gate). Fonts must
 * be loaded. `hasPhoto(i)` says whether slide i renders on a photo.
 */
export declare function layoutWarnings(deck: Deck, variant: Variant, hasPhoto?: (slideIndex: number) => boolean): Warning[];
export type PhotoSource = Record<string, PhotoInput> | ((id: string) => PhotoInput | null | Promise<PhotoInput | null>);
export interface RenderDeckOptions extends Omit<ParseOptions, 'templateFamily'> {
    /** Render with this template instead of the deck's own. */
    template?: string;
    /** Photo darkness 0–100 (default 50). */
    darkness?: number;
    /** Photos by id. With a record, its key order is the tray order for `photo=N`. */
    photos?: PhotoSource;
    /** 'throw' (default): throw BlockingWarningsError before drawing; 'render': render anyway. */
    onBlocking?: 'throw' | 'render';
    onProgress?: (done: number, total: number) => void;
    /** Every parse and layout warning, once the deck is checked. */
    onWarnings?: (warnings: Warning[], deck: Deck) => void;
}
/**
 * Render every slide to a 1080×1920 PNG, in order. Parses text with the
 * registry, waits for the font gate, picks icons and photos, and checks for
 * blocking warnings first. Each slide is drawn on a fresh offscreen canvas.
 */
export declare function renderDeck(input: string | Deck, opts?: RenderDeckOptions): Promise<Blob[]>;
