import type { Lang } from 'carousel-core/src/core/types';
import { loadAllFonts } from 'carousel-core/src/fonts/loadFonts';
import { makeCanvas } from 'carousel-core/src/render/ctx';
import { deckIcons, renderSlide } from 'carousel-core/src/render/renderSlide';
import { CANVAS } from 'carousel-core/src/render/safezone';
import { listVariants } from 'carousel-core/src/templates/registry';
import type { Variant } from 'carousel-core/src/templates/types';
import type { Controller } from './controller';
import { debounce, h } from './dom';
import { openGallery } from './gallery';
import { paintBitmap } from './preview';

const FAMILIES: { label: string; family: Variant['family'] }[] = [
  { label: 'Editorial', family: 'editorial' },
  { label: 'Dev', family: 'dev' },
  { label: 'Sport', family: 'sport' },
  { label: 'Lexicon', family: 'lexicon' },
  { label: 'Serene', family: 'serene' },
];

/** An on/off switch row (a real checkbox underneath, styled as a switch). */
function switchRow(label: string, key: 'showSafe' | 'showGrid', c: Controller): HTMLElement {
  const box = h('input', { type: 'checkbox', class: 'switch', role: 'switch' });
  box.addEventListener('change', () => {
    c.store.set({ [key]: box.checked });
    c.updateSettings({ [key]: box.checked });
  });
  c.store.watch((s) => s[key], (v) => { box.checked = v; });
  return h('label', { class: 'switch-row' }, h('span', {}, label), box);
}

/**
 * Style tab: template grid (the deck's first card drawn in every template), handle,
 * language, photo darkness and guides. Template, handle and language rewrite header lines.
 */
export function mountStylePanel(root: HTMLElement, c: Controller): void {
  const cells = listVariants().map((v) => {
    const canvas = h('canvas', { class: 'tpl-canvas', 'aria-hidden': 'true' });
    const btn = h('button', { type: 'button', class: 'tpl', 'aria-pressed': 'false', 'aria-label': `Use ${v.name}` },
      canvas, h('span', { class: 'tpl-name' }, v.name));
    btn.addEventListener('click', () => c.setTemplate(v.id));
    return { v, btn, canvas };
  });
  const groups = FAMILIES.map(({ label, family }) => {
    const mine = cells.filter((x) => x.v.family === family);
    return mine.length ? h('div', { class: 'tpl-group' }, h('h4', { class: 'label' }, label), h('div', { class: 'tpl-grid' }, ...mine.map((x) => x.btn))) : null;
  });
  const compare = h('button', { type: 'button', class: 'btn quiet small' }, 'Compare cover and card');
  compare.addEventListener('click', () => void openGallery(c));

  const handle = h('input', { class: 'input', type: 'text', placeholder: '@namaakun', 'aria-label': 'Handle', spellcheck: 'false', autocapitalize: 'off' });
  const setHandle = debounce((v: string) => c.setHandle(v), 400);
  handle.addEventListener('input', () => setHandle(handle.value.trim()));
  handle.addEventListener('blur', () => setHandle.flush());

  const langs: Lang[] = ['id', 'en'];
  const langBtns = langs.map((l) => {
    const b = h('button', { type: 'button', class: 'seg', 'aria-pressed': 'false' }, l);
    b.addEventListener('click', () => c.setLang(l));
    return b;
  });

  const dark = h('input', { type: 'range', min: '0', max: '100', step: '1', class: 'range', 'aria-label': 'Photo darkness' });
  const darkVal = h('output', { class: 'range-val' });
  dark.addEventListener('input', () => c.setDarkness(Number(dark.value)));

  root.append(
    h('section', { class: 'style-sec' }, h('div', { class: 'style-head' }, h('h3', { class: 'label' }, 'Template'), compare),
      ...groups.filter((g): g is HTMLDivElement => g !== null)),
    h('section', { class: 'style-sec style-row' },
      h('div', { class: 'field' }, h('h3', { class: 'label' }, 'Handle'), handle),
      h('div', { class: 'field' }, h('h3', { class: 'label' }, 'Language'), h('div', { class: 'segmented', role: 'group', 'aria-label': 'Language' }, ...langBtns))),
    h('section', { class: 'style-sec' }, h('h3', { class: 'label' }, 'Photo darkness'), h('div', { class: 'range-row' }, dark, darkVal)),
    h('section', { class: 'style-sec' }, h('h3', { class: 'label' }, 'Guides'), switchRow('Safe zone', 'showSafe', c), switchRow('Baseline grid', 'showGrid', c)),
  );

  c.store.watch((s) => s.parsed, (p) => {
    if (document.activeElement !== handle) handle.value = p.deck.handle;
    langBtns.forEach((b, i) => b.setAttribute('aria-pressed', String(langs[i] === p.deck.lang)));
    for (const x of cells) x.btn.setAttribute('aria-pressed', String(x.v.id === p.deck.template));
  });
  c.store.watch((s) => s.darkness, (d) => {
    dark.value = String(d);
    darkVal.textContent = String(d);
  });

  // Thumbnails: rendered only while the tab is visible, after edits settle.
  let stale = true;
  let running = false;
  const paintAll = async (): Promise<void> => {
    if (running || !stale || root.offsetParent === null) return;
    running = true;
    stale = false;
    try {
      await loadAllFonts(listVariants());
      const { canvas, ctx } = makeCanvas(CANVAS.w, CANVAS.h);
      const s = c.store.get();
      const deck = s.parsed.deck;
      const i = Math.max(0, deck.slides.findIndex((x) => x.type !== 'cover'));
      const slide = deck.slides[i];
      if (slide) {
        const photo = slide.photoId ? await c.photos.photoInput(slide.photoId) : null;
        for (const x of cells) {
          renderSlide(ctx, slide, deck, x.v, { photo, darkness: s.darkness, icon: deckIcons(deck, x.v)[i] ?? null });
          paintBitmap(x.canvas, canvas as CanvasImageSource);
          await new Promise((r) => setTimeout(r, 0));
        }
      }
    } catch {
      stale = true; // fonts failed; try again next time the tab opens
    } finally {
      running = false;
    }
    if (stale) void paintAll();
  };
  const soon = debounce(() => void paintAll(), 400);
  c.store.subscribe((s, p) => {
    if (s.parsed !== p.parsed || s.darkness !== p.darkness || s.photos !== p.photos) {
      stale = true;
      soon();
    }
    if (s.leftTab !== p.leftTab || s.mobileTab !== p.mobileTab || s.view !== p.view) requestAnimationFrame(() => void paintAll());
  });
}
