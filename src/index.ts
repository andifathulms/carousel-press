// carousel-core: plain-text decks → 1080×1920 carousel PNGs, in the browser.
// Public API (docs/PORTING.md §2). Everything else is internal.

// Decks
export { parseDeck, renderDeck, loadFonts, layoutWarnings, BlockingWarningsError } from './api/deck';
export type { RenderDeckOptions, PhotoSource } from './api/deck';
export type { ParseOptions } from './core/parser';
export { resolvePhotos } from './core/parser';
export { setHeaderKey, getHeaderKey } from './core/headerEdit';
export { encodeDeckLink, decodeDeckLink } from './core/deckLink';
export { slugify, slideFileName } from './core/slug';
export { BLOCKING_CODES, BUILTIN_TEMPLATE_IDS, DEFAULT_TEMPLATE, isBlocking } from './core/types';
export type {
  Deck, DeckHeader, FamilyId, Lang, ParseResult, Slide, SlideType, TemplateId, Warning, WarningCode,
} from './core/types';

// Templates
export { registerVariant, getVariant, hasVariant, listVariants, checkVariant as validateVariant, VariantError } from './templates/registry';
export type { Variant, Surface, CodeTheme, Deco } from './templates/types';

// Fonts
export { configureFonts } from './fonts/fontSources';
export type { FontConfig, FontFaceSource } from './fonts/fontSources';

// Lower level: one slide on any 1080×1920 context
export { renderSlide, layoutSlide, deckIcons } from './render/renderSlide';
export type { RenderAssets, RenderResult } from './render/renderSlide';
export type { PhotoInput } from './render/photo';
export { CANVAS, SAFE } from './render/safezone';
