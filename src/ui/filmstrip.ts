import { isBlocking } from '../core/types';
import { slideWarnings } from './appState';
import type { Controller } from './controller';
import { h } from './dom';
import { paintBitmap } from './preview';

export function mountFilmstrip(root: HTMLElement, c: Controller): void {
  const strip = h('ol', { class: 'filmstrip', 'aria-label': 'Slides' });
  root.append(strip);
  let items: { li: HTMLLIElement; btn: HTMLButtonElement; canvas: HTMLCanvasElement; dot: HTMLElement }[] = [];

  const build = (n: number): void => {
    if (items.length === n) return;
    items = Array.from({ length: n }, (_, i) => {
      const canvas = h('canvas', { class: 'thumb-canvas', 'aria-hidden': 'true' });
      const dot = h('span', { class: 'thumb-dot', hidden: true });
      const btn = h('button', { type: 'button', class: 'thumb', 'aria-label': `Slide ${i + 1}` }, canvas, dot);
      btn.addEventListener('click', () => c.jumpToSlide(i));
      const li = h('li', {}, btn, h('span', { class: 'thumb-num' }, String(i + 1)));
      return { li, btn, canvas, dot };
    });
    strip.replaceChildren(...items.map((x) => x.li));
  };

  const paint = (): void => {
    const s = c.store.get();
    build(s.parsed.deck.slides.length);
    items.forEach((it, i) => {
      const active = i === s.selected;
      it.btn.classList.toggle('active', active);
      it.btn.setAttribute('aria-current', active ? 'true' : 'false');
      const ws = slideWarnings(s, i);
      it.dot.hidden = ws.length === 0;
      it.dot.classList.toggle('blocking', ws.some(isBlocking));
      it.btn.title = ws.map((w) => w.message).join('\n');
      const cached = c.engine.get(i);
      if (s.fontsReady && cached) paintBitmap(it.canvas, cached.bitmap);
    });
    // Keep the active thumbnail visible without scrolling the page itself.
    const li = items[s.selected]?.li;
    if (li && (li.offsetLeft < strip.scrollLeft || li.offsetLeft + li.offsetWidth > strip.scrollLeft + strip.clientWidth)) {
      strip.scrollLeft = li.offsetLeft - strip.clientWidth / 2 + li.offsetWidth / 2;
    }
  };

  c.store.subscribe((s, p) => {
    if (s.parsed !== p.parsed || s.selected !== p.selected || s.renderVersion !== p.renderVersion ||
      s.fontsReady !== p.fontsReady || s.renderWarnings !== p.renderWarnings) paint();
  });
  paint();
}
