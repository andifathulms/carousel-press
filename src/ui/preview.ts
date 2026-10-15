import { isBlocking } from 'carousel-core/src/core/types';
import type { Ctx } from 'carousel-core/src/render/ctx';
import { drawBaselineGrid, drawSafeOverlay } from 'carousel-core/src/render/overlay';
import { OVERFLOW_OUTLINE } from 'carousel-core/src/render/renderSlide';
import { CANVAS, CONTENT_W, ROWS, SAFE } from 'carousel-core/src/render/safezone';
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

const SWIPE_PX = 40;

export function mountPreview(root: HTMLElement, c: Controller): void {
  const canvas = h('canvas', { class: 'preview-canvas', role: 'img', 'aria-label': 'Slide preview' });
  const skeleton = h('div', { class: 'preview-skeleton' }, 'Loading fonts…');
  // Focus mode: the neighbouring slides peek in at the edges, the way the carousel feels on TikTok.
  const peekPrev = h('canvas', { class: 'peek peek-prev', 'aria-hidden': 'true' });
  const peekNext = h('canvas', { class: 'peek peek-next', 'aria-hidden': 'true' });
  const frame = h('div', { class: 'preview-frame', tabindex: '0', 'aria-label': 'Preview. Swipe, or use the left and right arrow keys, to change slides' },
    peekPrev, canvas, peekNext, skeleton, ...['tl', 'tr', 'bl', 'br'].map((k) => h('i', { class: `crop crop-${k}`, 'aria-hidden': 'true' })));
  const prev = h('button', { type: 'button', class: 'round-btn', 'aria-label': 'Previous slide' }, svg(UI_ICONS.prev));
  const next = h('button', { type: 'button', class: 'round-btn', 'aria-label': 'Next slide' }, svg(UI_ICONS.next));
  const counter = h('span', { class: 'preview-counter', 'aria-live': 'polite' });
  const dots = h('span', { class: 'preview-dots', 'aria-hidden': 'true' });
  const safeBtn = h('button', { type: 'button', class: 'stage-chip', 'aria-pressed': 'false' }, svg(UI_ICONS.safe), 'Safe zone');
  const exitFocus = h('button', { type: 'button', class: 'stage-chip exit-focus' }, svg(UI_ICONS.close), 'Exit focus');
  const stage = h('div', { class: 'preview-stage' }, frame);
  root.append(h('div', { class: 'stage-tools' }, safeBtn, exitFocus), stage, h('div', { class: 'preview-nav' }, prev, counter, dots, next));

  const go = (d: number): void => c.select(c.store.get().selected + d);
  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  safeBtn.addEventListener('click', () => {
    const v = !c.store.get().showSafe;
    c.store.set({ showSafe: v });
    c.updateSettings({ showSafe: v });
  });
  exitFocus.addEventListener('click', () => c.store.set({ focus: false }));
  frame.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { go(-1); e.preventDefault(); }
    if (e.key === 'ArrowRight') { go(1); e.preventDefault(); }
  });

  // Horizontal swipe on the slide (touch or pen); vertical moves are left alone.
  let start: { x: number; y: number; id: number } | null = null;
  stage.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') start = { x: e.clientX, y: e.clientY, id: e.pointerId };
  });
  stage.addEventListener('pointerup', (e) => {
    if (!start || start.id !== e.pointerId) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    start = null;
    if (Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
  });
  stage.addEventListener('pointercancel', () => { start = null; });

  // Fit a 9:16 frame into the stage, height first.
  const fit = (): void => {
    const r = stage.getBoundingClientRect();
    const cs = getComputedStyle(stage);
    const availW = r.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const availH = r.height - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    if (availW <= 0 || availH <= 0) return;
    let hh = availH;
    let w = (hh * CANVAS.w) / CANVAS.h;
    if (w > availW) {
      w = availW;
      hh = (w * CANVAS.h) / CANVAS.w;
    }
    frame.style.width = `${Math.floor(w)}px`;
    frame.style.height = `${Math.floor(hh)}px`;
    paint();
  };

  const paint = (): void => {
    const s = c.store.get();
    const n = s.parsed.deck.slides.length;
    counter.replaceChildren(h('b', {}, String(n ? s.selected + 1 : 0)), ` / ${n}`);
    if (dots.childElementCount !== n) dots.replaceChildren(...Array.from({ length: Math.min(n, 20) }, () => h('i', {})));
    [...dots.children].forEach((d, i) => d.classList.toggle('on', i === s.selected));
    prev.disabled = s.selected <= 0;
    next.disabled = s.selected >= n - 1;
    safeBtn.setAttribute('aria-pressed', String(s.showSafe));
    const cached = c.engine.get(s.selected);
    const ready = s.fontsReady && !!cached;
    skeleton.hidden = ready;
    skeleton.textContent = s.fontError ?? (n ? 'Loading fonts…' : 'Write a slide to see it here');
    if (s.focus) {
      paintBitmap(peekPrev, s.fontsReady ? c.engine.get(s.selected - 1)?.bitmap : undefined);
      paintBitmap(peekNext, s.fontsReady ? c.engine.get(s.selected + 1)?.bitmap : undefined);
      peekPrev.hidden = s.selected <= 0;
      peekNext.hidden = s.selected >= n - 1;
    }
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
    if (s.mobileTab !== p.mobileTab || s.focus !== p.focus || s.view !== p.view) requestAnimationFrame(fit);
  });
  fit();
}
