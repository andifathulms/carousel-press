import { loadFonts } from 'carousel-core/src/fonts/loadFonts';
import { makeCanvas } from 'carousel-core/src/render/ctx';
import type { PhotoInput } from 'carousel-core/src/render/photo';
import { deckIcons, renderSlide } from 'carousel-core/src/render/renderSlide';
import { CANVAS } from 'carousel-core/src/render/safezone';
import { getVariant } from 'carousel-core/src/templates/registry';
import { SAMPLES } from '../samples';
import { SAMPLE_PHOTOS } from '../samples/photos';
import type { Controller } from './controller';

// Queue cards show each sample's cover. They are drawn with the one render path,
// one at a time as cards scroll into view, and kept as small JPEG object URLs for the session.

const COVER = { w: 270, h: 480, quality: 0.8 };
const urls = new Map<string, Promise<string | null>>();
const bundled = new Map<string, Promise<PhotoInput | null>>();
let chain: Promise<unknown> = Promise.resolve();
let stage: ReturnType<typeof makeCanvas> | null = null;

function bundledPhoto(id: string): Promise<PhotoInput | null> {
  let p = bundled.get(id);
  if (!p) {
    const sp = SAMPLE_PHOTOS.find((x) => x.id === id);
    p = sp ? fetch(sp.url).then((r) => r.blob()).then(createImageBitmap)
      .then((image) => ({ image, width: image.width, height: image.height, focalX: sp.focalX, focalY: sp.focalY }))
      .catch(() => null) : Promise.resolve(null);
    bundled.set(id, p);
  }
  return p;
}

async function draw(c: Controller, sampleId: string): Promise<string | null> {
  const sample = SAMPLES.find((x) => x.id === sampleId);
  if (!sample) return null;
  const { deck } = c.parseText(sample.text);
  const slide = deck.slides[0];
  if (!slide) return null;
  const variant = getVariant(deck.template);
  await loadFonts(variant);
  // Photos the tray doesn't have yet (the sample was never opened) come straight from the bundle.
  const ref = slide.photoId ?? slide.attrs.photo;
  const photo = slide.photoId ? await c.photos.photoInput(slide.photoId) : ref ? await bundledPhoto(ref) : null;
  stage ??= makeCanvas(CANVAS.w, CANVAS.h);
  renderSlide(stage.ctx, slide, deck, variant, { photo, darkness: 50, icon: deckIcons(deck, variant)[0] ?? null });
  const small = document.createElement('canvas');
  small.width = COVER.w;
  small.height = COVER.h;
  const sctx = small.getContext('2d');
  if (!sctx) return null;
  sctx.imageSmoothingQuality = 'high';
  sctx.drawImage(stage.canvas as CanvasImageSource, 0, 0, COVER.w, COVER.h);
  const blob = await new Promise<Blob | null>((r) => small.toBlob(r, 'image/jpeg', COVER.quality));
  return blob ? URL.createObjectURL(blob) : null;
}

/** Object URL of a sample's rendered cover (null if it can't be drawn). */
export function sampleCover(c: Controller, sampleId: string): Promise<string | null> {
  let p = urls.get(sampleId);
  if (!p) {
    p = chain.then(() => draw(c, sampleId)).catch(() => null);
    chain = p.then(() => new Promise((r) => setTimeout(r, 0)));
    urls.set(sampleId, p);
  }
  return p;
}

/** Fill `.q-cover` boxes with sample covers as they scroll into view. */
export function sampleCovers(c: Controller, scroller: HTMLElement): { observe(el: HTMLElement, sampleId: string): void; reset(): void } {
  const ids = new WeakMap<Element, string>();
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      io.unobserve(e.target);
      const id = ids.get(e.target);
      if (!id) continue;
      void sampleCover(c, id).then((url) => {
        if (url && e.target.isConnected) e.target.prepend(Object.assign(document.createElement('img'), { src: url, alt: '' }));
      });
    }
  }, { root: scroller, rootMargin: '400px 0px' });
  return {
    observe(el, sampleId) {
      ids.set(el, sampleId);
      io.observe(el);
    },
    reset() {
      io.disconnect();
    },
  };
}
