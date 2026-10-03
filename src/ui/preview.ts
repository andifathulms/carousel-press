import { isBlocking } from '../core/types';
import type { Ctx } from '../render/ctx';
import { drawBaselineGrid, drawSafeOverlay } from '../render/overlay';
import { OVERFLOW_OUTLINE } from '../render/renderSlide';
import { CANVAS, CONTENT_W, ROWS, SAFE } from '../render/safezone';
import { slideWarnings } from './appState';
import type { Controller } from './controller';
import { h, svg } from './dom';
import { UI_ICONS } from './uiIcons';

/** Draw a cached slide bitmap into a visible canvas sized to its CSS box. */
export function paintBitmap(canvas: HTMLCanvasElement, bitmap: CanvasImageSource | undefined): CanvasRenderingContext2D | null {
  const dpr = window.devicePixelRatio || 1;
  const w = Math.round(canvas.clientWidth * dpr);
  const hh = Math.round(canvas.clientHeight * dpr);
  if (!w || !hh) return null;
  if (canvas.width !== w || canvas.height !== hh) {
    canvas.width = w;
    canvas.height = hh;
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, w, hh);
  if (bitmap) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, 0, 0, w, hh);
  }
  ctx.setTransform(w / CANVAS.w, 0, 0, hh / CANVAS.h, 0, 0);
  return ctx;
}

export function mountPreview(root: HTMLElement, c: Controller): void {
  const canvas = h('canvas', { class: 'preview-canvas', role: 'img', 'aria-label': 'Slide preview' });
  const skeleton = h('div', { class: 'preview-skeleton' }, 'Loading fonts…');
  const frame = h('div', { class: 'preview-frame', tabindex: '0', 'aria-label': 'Preview. Use left and right arrow keys to change slides' },
    canvas, skeleton, ...['tl', 'tr', 'bl', 'br'].map((k) => h('i', { class: `crop crop-${k}`, 'aria-hidden': 'true' })));
  const prev = h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Previous slide' }, svg(UI_ICONS.prev));
  const next = h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Next slide' }, svg(UI_ICONS.next));
  const counter = h('span', { class: 'preview-counter', 'aria-live': 'polite' });
  const stage = h('div', { class: 'preview-stage' }, frame);
  root.append(stage, h('div', { class: 'preview-nav' }, prev, counter, next));

  const go = (d: number): void => c.select(c.store.get().selected + d);
  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  frame.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { go(-1); e.preventDefault(); }
    if (e.key === 'ArrowRight') { go(1); e.preventDefault(); }
  });

  // Fit a 9:16 frame into the stage (height-first, max 80vh via CSS).
  const fit = (): void => {
    const r = stage.getBoundingClientRect();
    const maxH = Math.min(r.height, window.innerHeight * 0.8);
    let hh = maxH;
    let w = (hh * CANVAS.w) / CANVAS.h;
    if (w > r.width) {
      w = r.width;
      hh = (w * CANVAS.h) / CANVAS.w;
    }
    frame.style.width = `${Math.floor(w)}px`;
    frame.style.height = `${Math.floor(hh)}px`;
    paint();
  };

  const paint = (): void => {
    const s = c.store.get();
    const n = s.parsed.deck.slides.length;
    counter.textContent = n ? `${s.selected + 1} / ${n}` : '0 / 0';
    prev.disabled = s.selected <= 0;
    next.disabled = s.selected >= n - 1;
    const cached = c.engine.get(s.selected);
    const ready = s.fontsReady && !!cached;
    skeleton.hidden = ready;
    skeleton.textContent = s.fontError ?? (n ? 'Loading fonts…' : 'Write a slide to see it here');
    const ctx = paintBitmap(canvas, ready ? cached.bitmap : undefined);
    if (!ctx || !ready) return;
    if (s.showGrid) drawBaselineGrid(ctx as Ctx);
    if (s.showSafe) drawSafeOverlay(ctx as Ctx);
    if (cached.overflow || slideWarnings(s, s.selected).some(isBlocking)) {
      ctx.setLineDash(OVERFLOW_OUTLINE.dash);
      ctx.strokeStyle = OVERFLOW_OUTLINE.color;
      ctx.lineWidth = OVERFLOW_OUTLINE.width;
      const top = cached.stackTop || ROWS.stackTopCard;
      ctx.strokeRect(SAFE.left, top, CONTENT_W, ROWS.stackLimit - top);
      ctx.setLineDash([]);
    }
  };

  new ResizeObserver(fit).observe(stage);
  window.addEventListener('resize', fit);
  c.store.subscribe((s, p) => {
    if (s.selected !== p.selected || s.renderVersion !== p.renderVersion || s.fontsReady !== p.fontsReady ||
      s.showSafe !== p.showSafe || s.showGrid !== p.showGrid || s.parsed !== p.parsed || s.fontError !== p.fontError) paint();
    if (s.mobileTab !== p.mobileTab) requestAnimationFrame(fit);
  });
  fit();
}
