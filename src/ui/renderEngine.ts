import { hash } from 'carousel-core/src/core/hash';
import type { Deck, Warning } from 'carousel-core/src/core/types';
import { makeCanvas } from 'carousel-core/src/render/ctx';
import type { PhotoInput } from 'carousel-core/src/render/photo';
import { deckIcons, renderSlide } from 'carousel-core/src/render/renderSlide';
import { CANVAS } from 'carousel-core/src/render/safezone';
import { loadCrests } from 'carousel-core/src/render/crests';
import type { Variant } from 'carousel-core/src/templates/types';

export interface CachedSlide {
  key: string;
  bitmap: ImageBitmap | HTMLCanvasElement;
  warnings: Warning[];
  overflow: boolean;
  /** Top of the content stack (for the preview-only overflow outline). */
  stackTop: number;
}

export interface RenderJob {
  deck: Deck;
  variant: Variant;
  darkness: number;
  selected: number;
  getPhoto(id: string): Promise<PhotoInput | null>;
}

/**
 * Renders each slide with the one render path on an offscreen 1080×1920
 * canvas and caches the bitmap. Only slides whose key changed re-render.
 */
export class RenderEngine {
  private cache: CachedSlide[] = [];
  private run = 0;
  private onUpdate: (index: number) => void;

  constructor(onUpdate: (index: number) => void) {
    this.onUpdate = onUpdate;
  }

  get(i: number): CachedSlide | undefined {
    return this.cache[i];
  }

  /** Cache key: slide + variant + photo + focal + darkness + handle + lang + total (+ slug, icon). */
  static key(job: RenderJob, i: number, photo: PhotoInput | null, icon: string | null, crestKey = ''): string {
    const s = job.deck.slides[i]!;
    return String(hash(JSON.stringify(s) + job.variant.id + (s.photoId ?? '') +
      (photo ? `${photo.focalX},${photo.focalY},${photo.width}` : '') + job.darkness + job.deck.handle +
      job.deck.lang + s.counter.total + (job.deck.counter ?? true) + job.deck.slug + (icon ?? '') + crestKey));
  }

  async render(job: RenderJob): Promise<void> {
    const run = ++this.run;
    const n = job.deck.slides.length;
    this.cache.length = Math.min(this.cache.length, n);
    const icons = deckIcons(job.deck, job.variant);
    const crests = await loadCrests(job.deck, job.getPhoto);
    if (run !== this.run) return;
    // Importing a crest later must re-render the slides that use it.
    const crestKey = [...crests.keys()].sort().join(',');
    const order = [...Array(n).keys()].sort((a, b) => Math.abs(a - job.selected) - Math.abs(b - job.selected));
    for (const i of order) {
      const slide = job.deck.slides[i]!;
      const photo = slide.photoId ? await job.getPhoto(slide.photoId) : null;
      if (run !== this.run) return;
      const key = RenderEngine.key(job, i, photo, icons[i] ?? null, slide.match ? crestKey : '');
      if (this.cache[i]?.key === key) continue;
      const { canvas, ctx } = makeCanvas(CANVAS.w, CANVAS.h);
      const r = renderSlide(ctx, slide, job.deck, job.variant, { photo, darkness: job.darkness, icon: icons[i] ?? null, crests });
      const bitmap = 'transferToImageBitmap' in canvas ? canvas.transferToImageBitmap() : canvas;
      const old = this.cache[i]?.bitmap;
      if (old && 'close' in old) old.close();
      this.cache[i] = {
        key, bitmap, warnings: r.warnings, overflow: r.overflow, stackTop: r.layout.stack.placed[0]?.y ?? 0,
      };
      this.onUpdate(i);
      // Yield so typing never blocks on a long deck.
      await new Promise((res) => setTimeout(res, 0));
      if (run !== this.run) return;
    }
  }

  warnings(): Warning[][] {
    return this.cache.map((c) => c?.warnings ?? []);
  }

  clear(): void {
    this.run++;
    this.cache = [];
  }
}
