import type { Lang } from '../core/types';
import { canSharePngs } from '../export/sharePhotos';
import { downloadAll, downloadCurrentSlide, downloadTestImage, saveToPhotos } from './actions';
import type { Controller } from './controller';
import { copyText, debounce, flash, h, svg } from './dom';
import { openGallery } from './gallery';
import { createTemplatePicker } from './templatePicker';
import { UI_ICONS } from './uiIcons';

const group = (label: string, ...children: (Node | string)[]): HTMLElement =>
  h('section', { class: 'group' }, h('h3', { class: 'label' }, label), ...children);

export function mountInspector(root: HTMLElement, c: Controller): void {
  const picker = createTemplatePicker((id) => c.setTemplate(id));
  const compare = h('button', { type: 'button', class: 'btn small' }, 'Compare templates');
  compare.addEventListener('click', () => openGallery(c));

  const handle = h('input', { class: 'input', type: 'text', placeholder: '@namaakun', 'aria-label': 'Handle', spellcheck: 'false' });
  const setHandle = debounce((v: string) => c.setHandle(v), 400);
  handle.addEventListener('input', () => setHandle(handle.value.trim()));
  handle.addEventListener('blur', () => setHandle.flush());

  const langs: Lang[] = ['id', 'en'];
  const langBtns = langs.map((l) => {
    const b = h('button', { type: 'button', class: 'seg', 'aria-pressed': 'false' }, l);
    b.addEventListener('click', () => c.setLang(l));
    return b;
  });
  const langSeg = h('div', { class: 'segmented', role: 'group', 'aria-label': 'Language' }, ...langBtns);

  const dark = h('input', { type: 'range', min: '0', max: '100', step: '1', class: 'range', 'aria-label': 'Photo darkness' });
  const darkVal = h('output', { class: 'range-val' });
  dark.addEventListener('input', () => c.setDarkness(Number(dark.value)));

  const toggle = (label: string, key: 'showSafe' | 'showGrid'): HTMLElement => {
    const box = h('input', { type: 'checkbox' });
    box.addEventListener('change', () => {
      c.store.set({ [key]: box.checked });
      c.updateSettings({ [key]: box.checked });
    });
    c.store.watch((s) => s[key], (v) => { box.checked = v; });
    return h('label', { class: 'check' }, box, h('span', {}, label));
  };

  const caption = h('p', { class: 'caption-text' });
  const capCount = h('span', { class: 'caption-count' });
  const capCopy = h('button', { type: 'button', class: 'btn small' }, svg(UI_ICONS.copy), 'Copy');
  capCopy.addEventListener('click', async () => {
    flash(capCopy, (await copyText(c.store.get().parsed.deck.caption)) ? 'Copied' : 'Copy failed');
  });

  const one = h('button', { type: 'button', class: 'btn' }, svg(UI_ICONS.download), 'Download slide');
  const all = h('button', { type: 'button', class: 'btn primary' }, svg(UI_ICONS.box), 'Download all (ZIP)');
  // Only where the browser can share files (iPad/iPhone Safari, macOS Safari).
  const photos = canSharePngs() ? h('button', { type: 'button', class: 'btn' }, svg(UI_ICONS.image), 'Save to Photos') : null;
  const test = h('button', { type: 'button', class: 'btn small ghost' }, 'Safe-zone test image');
  const hint = h('p', { class: 'hint', 'aria-live': 'polite' });
  one.addEventListener('click', () => void downloadCurrentSlide(c));
  all.addEventListener('click', () => void downloadAll(c));
  photos?.addEventListener('click', () => void saveToPhotos(c));
  test.addEventListener('click', () => void downloadTestImage(c));

  root.append(
    group('Template', picker.el, compare),
    group('Handle', handle),
    group('Language', langSeg),
    group('Photo darkness', h('div', { class: 'range-row' }, dark, darkVal)),
    group('View', toggle('Safe zone', 'showSafe'), toggle('Grid', 'showGrid')),
    h('section', { class: 'group caption-group' }, h('div', { class: 'caption-head' }, h('h3', { class: 'label' }, 'Caption'), capCount, capCopy), caption),
    h('section', { class: 'group export-group' }, one, all, ...(photos ? [photos] : []), hint, test),
  );

  c.store.watch((s) => s.parsed, (p) => {
    picker.set(p.deck.template);
    if (document.activeElement !== handle) handle.value = p.deck.handle;
    langBtns.forEach((b, i) => b.setAttribute('aria-pressed', String(langs[i] === p.deck.lang)));
    const cap = p.deck.caption;
    caption.textContent = cap || 'Add a caption: line to the header to see it here.';
    caption.classList.toggle('empty', !cap);
    capCount.textContent = cap ? `${Array.from(cap).length} chars` : '';
    capCopy.disabled = !cap;
  });
  c.store.watch((s) => s.darkness, (d) => {
    dark.value = String(d);
    darkVal.textContent = String(d);
  });
  const sync = (): void => {
    const s = c.store.get();
    const n = s.parsed.deck.slides.length;
    const blocked = !s.fontsReady || !!s.busy || n === 0;
    one.disabled = blocked;
    all.disabled = blocked;
    if (photos) photos.disabled = blocked;
    hint.textContent = s.busy ?? (s.fontError ? `${s.fontError}. Export is disabled.` : !s.fontsReady ? 'Loading fonts…' : '');
    hint.classList.toggle('error', !!s.fontError);
  };
  c.store.subscribe(sync);
  sync();
}
