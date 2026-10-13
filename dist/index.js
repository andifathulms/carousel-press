import { parseDeck } from "./parse.js";
import { decodeDeckLink, encodeDeckLink, getHeaderKey, resolvePhotos, setHeaderKey } from "./parse.js";
import { g as getVariant, i as isBlocking, c as createCanvasMeasurer } from "./registry-CfRP1EtO.js";
import { B, a, C, D, S, V, h, l, r, s, b, d } from "./registry-CfRP1EtO.js";
import { m as makeCanvas, d as deckIcons, l as layoutSlide, a as loadFonts$1, e as exportSlidePng, f as faceAvailable } from "./exportPng-JWI_EmEW.js";
import { c, r as r2 } from "./exportPng-JWI_EmEW.js";
function loadFonts(variant) {
  return loadFonts$1(typeof variant === "string" ? getVariant(variant) : variant);
}
class BlockingWarningsError extends Error {
  constructor(warnings) {
    super(`carousel-core: ${warnings.length} blocking warning(s): ${warnings.map((w) => w.message).join("; ")}`);
    this.warnings = warnings;
    this.name = "BlockingWarningsError";
  }
  warnings;
}
function layoutWarnings(deck, variant, hasPhoto = () => false) {
  const { ctx } = makeCanvas(8, 8);
  const m = createCanvasMeasurer(ctx, faceAvailable);
  const icons = deckIcons(deck, variant);
  return deck.slides.flatMap((slide, i) => layoutSlide(slide, deck, variant, m, icons[i] ?? null, hasPhoto(i)).warnings);
}
async function renderDeck(input, opts = {}) {
  const photos = opts.photos;
  const photoIds = opts.photoIds ?? (photos && typeof photos === "object" ? Object.keys(photos) : void 0);
  const parseOpts = {
    ...opts.defaultTemplate ? { defaultTemplate: opts.defaultTemplate } : {},
    ...opts.defaultHandle !== void 0 ? { defaultHandle: opts.defaultHandle } : {},
    ...photoIds ? { photoIds } : {}
  };
  const parsed = typeof input === "string" ? parseDeck(input, parseOpts) : { deck: input, warnings: [] };
  const { deck } = parsed;
  const variant = getVariant(opts.template ?? deck.template);
  await loadFonts$1(variant);
  const lookup = async (id) => !photos ? null : typeof photos === "function" ? await photos(id) ?? null : photos[id] ?? null;
  const images = await Promise.all(deck.slides.map((s2) => s2.photoId ? lookup(s2.photoId) : null));
  const warnings = [...parsed.warnings, ...layoutWarnings(deck, variant, (i) => !!images[i])];
  opts.onWarnings?.(warnings, deck);
  const blocking = warnings.filter(isBlocking);
  if (blocking.length && (opts.onBlocking ?? "throw") === "throw") throw new BlockingWarningsError(blocking);
  const icons = deckIcons(deck, variant);
  const blobs = [];
  for (const [i, slide] of deck.slides.entries()) {
    const r3 = await exportSlidePng(slide, deck, variant, { photo: images[i] ?? null, darkness: opts.darkness ?? 50, icon: icons[i] ?? null });
    blobs.push(r3.blob);
    opts.onProgress?.(i + 1, deck.slides.length);
  }
  return blobs;
}
export {
  B as BLOCKING_CODES,
  a as BUILTIN_TEMPLATE_IDS,
  BlockingWarningsError,
  C as CANVAS,
  D as DEFAULT_TEMPLATE,
  S as SAFE,
  V as VariantError,
  c as configureFonts,
  deckIcons,
  decodeDeckLink,
  encodeDeckLink,
  getHeaderKey,
  getVariant,
  h as hasVariant,
  isBlocking,
  layoutSlide,
  layoutWarnings,
  l as listVariants,
  loadFonts,
  parseDeck,
  r as registerVariant,
  renderDeck,
  r2 as renderSlide,
  resolvePhotos,
  setHeaderKey,
  s as slideFileName,
  b as slugify,
  d as validateVariant
};
//# sourceMappingURL=index.js.map
