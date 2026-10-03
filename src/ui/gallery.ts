import { loadAllFonts } from '../fonts/loadFonts';
import { makeCanvas } from '../render/ctx';
import { deckIcons, renderSlide } from '../render/renderSlide';
import { CANVAS } from '../render/safezone';
import { VARIANTS } from '../templates/registry';
import type { Controller } from './controller';
import { openModal, toast } from './dialogs';
import { h } from './dom';
import { paintBitmap } from './preview';

/** PRD F12: the current deck's cover and first card in all 6 templates. Click one to apply it. */
export async function openGallery(c: Controller): Promise<void> {
  const m = openModal('Compare templates', { wide: true });
  const grid = h('div', { class: 'gallery' });
  m.body.append(grid);
  const s = c.store.get();
  const first = s.parsed.deck.slides.findIndex((x) => x.type !== 'cover');
  const picks = [0, first].filter((i, k, a) => i >= 0 && a.indexOf(i) === k);
  if (!picks.length) {
    grid.append(h('p', {}, 'Write at least one slide first.'));
    return;
  }

  const cells = VARIANTS.map((v) => {
    const canvases = picks.map(() => h('canvas', { class: 'gallery-canvas', 'aria-hidden': 'true' }));
    const btn = h('button', { type: 'button', class: `gallery-cell${v.id === s.variant.id ? ' current' : ''}`, 'aria-label': `Use ${v.name}` },
      h('div', { class: 'gallery-pair' }, ...canvases), h('span', { class: 'gallery-name' }, v.name, h('small', {}, v.id)));
    btn.addEventListener('click', () => {
      c.setTemplate(v.id);
      m.close();
    });
    grid.append(btn);
    return { v, canvases };
  });

  try {
    await loadAllFonts(VARIANTS);
  } catch (err) {
    toast(err instanceof Error ? err.message : String(err), 'error');
    return;
  }
  const { canvas, ctx } = makeCanvas(CANVAS.w, CANVAS.h);
  for (const { v, canvases } of cells) {
    const deck = s.parsed.deck;
    const icons = deckIcons(deck, v);
    for (const [k, i] of picks.entries()) {
      const slide = deck.slides[i];
      if (!slide) continue;
      const photo = slide.photoId ? await c.photos.photoInput(slide.photoId) : null;
      renderSlide(ctx, slide, deck, v, { photo, darkness: s.darkness, icon: icons[i] ?? null });
      paintBitmap(canvases[k]!, canvas as CanvasImageSource);
      await new Promise((r) => setTimeout(r, 0));
    }
  }
}
