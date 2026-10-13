// Public deck API: parse with the registry, check, and render a whole deck to PNGs.
import type { ParseOptions } from '../core/parser';
import { parseDeck } from './parse';
import { type Deck, type ParseResult, type Warning, isBlocking } from '../core/types';
import { exportSlidePng } from '../export/exportPng';
import { loadFonts as loadVariantFonts } from '../fonts/loadFonts';
import { makeCanvas } from '../render/ctx';
import { faceAvailable } from '../render/fontCheck';
import type { PhotoInput } from '../render/photo';
import { deckIcons, layoutSlide } from '../render/renderSlide';
import { createCanvasMeasurer } from '../layout/measure';
import { getVariant } from '../templates/registry';
import type { Variant } from '../templates/types';

export { parseDeck } from './parse';

/** Wait for every face a variant (by id, or the variant itself) draws with. Rejects after 8 s. */
export function loadFonts(variant: string | Variant): Promise<void> {
  return loadVariantFonts(typeof variant === 'string' ? getVariant(variant) : variant);
}

/** Thrown by renderDeck() before anything is drawn when a slide overflows or can't render. */
export class BlockingWarningsError extends Error {
  constructor(readonly warnings: Warning[]) {
    super(`carousel-core: ${warnings.length} blocking warning(s): ${warnings.map((w) => w.message).join('; ')}`);
    this.name = 'BlockingWarningsError';
  }
}

/**
 * Layout warnings for every slide with real fonts (the export gate). Fonts must
 * be loaded. `hasPhoto(i)` says whether slide i renders on a photo.
 */
export function layoutWarnings(deck: Deck, variant: Variant, hasPhoto: (slideIndex: number) => boolean = () => false): Warning[] {
  const { ctx } = makeCanvas(8, 8);
  const m = createCanvasMeasurer(ctx, faceAvailable);
  const icons = deckIcons(deck, variant);
  return deck.slides.flatMap((slide, i) => layoutSlide(slide, deck, variant, m, icons[i] ?? null, hasPhoto(i)).warnings);
}

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
export async function renderDeck(input: string | Deck, opts: RenderDeckOptions = {}): Promise<Blob[]> {
  const photos = opts.photos;
  // A photo record doubles as the tray: its key order resolves `photo=N`.
  const photoIds = opts.photoIds ?? (photos && typeof photos === 'object' ? Object.keys(photos) : undefined);
  const parseOpts: Omit<ParseOptions, 'templateFamily'> = {
    ...(opts.defaultTemplate ? { defaultTemplate: opts.defaultTemplate } : {}),
    ...(opts.defaultHandle !== undefined ? { defaultHandle: opts.defaultHandle } : {}),
    ...(photoIds ? { photoIds } : {}),
  };
  const parsed: ParseResult = typeof input === 'string' ? parseDeck(input, parseOpts) : { deck: input, warnings: [] };
  const { deck } = parsed;
  const variant = getVariant(opts.template ?? deck.template);
  await loadVariantFonts(variant);

  const lookup = async (id: string): Promise<PhotoInput | null> =>
    !photos ? null : typeof photos === 'function' ? (await photos(id)) ?? null : photos[id] ?? null;
  const images = await Promise.all(deck.slides.map((s) => (s.photoId ? lookup(s.photoId) : null)));

  const warnings = [...parsed.warnings, ...layoutWarnings(deck, variant, (i) => !!images[i])];
  opts.onWarnings?.(warnings, deck);
  const blocking = warnings.filter(isBlocking);
  if (blocking.length && (opts.onBlocking ?? 'throw') === 'throw') throw new BlockingWarningsError(blocking);

  const icons = deckIcons(deck, variant);
  const blobs: Blob[] = [];
  for (const [i, slide] of deck.slides.entries()) {
    const r = await exportSlidePng(slide, deck, variant, { photo: images[i] ?? null, darkness: opts.darkness ?? 50, icon: icons[i] ?? null });
    blobs.push(r.blob);
    opts.onProgress?.(i + 1, deck.slides.length);
  }
  return blobs;
}
