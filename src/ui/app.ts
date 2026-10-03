import type { MobileTab } from './appState';
import type { Controller } from './controller';
import { mountCheatsheet } from './cheatsheet';
import { h, svg, timeAgo } from './dom';
import { mountEditor } from './editor';
import { mountFilmstrip } from './filmstrip';
import { mountInspector } from './inspector';
import { mountLibrary } from './library';
import { mountPhotos } from './photos';
import { mountPreview, paintBitmap } from './preview';
import { REG_MARK, UI_ICONS } from './uiIcons';

const THUMB = { w: 90, h: 160, quality: 0.7 };

export function mountApp(root: HTMLElement, c: Controller): void {
  // ---- top bar ----
  const deckSwitcher = h('div', { class: 'deck-switcher' });
  const saveStatus = h('span', { class: 'save-status', 'aria-live': 'polite' });
  const help = h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Syntax help' }, svg(UI_ICONS.help));
  const topbar = h('header', { class: 'topbar' },
    h('div', { class: 'brand' }, svg(REG_MARK), h('span', { class: 'wordmark' }, 'CAROUSEL PRESS')),
    deckSwitcher, h('div', { class: 'spacer' }), saveStatus, help);

  const storageBanner = h('div', { class: 'banner warn', role: 'status', hidden: true },
    'Autosave is off in this browser. Use Save deck file to keep your work.');
  const tipClose = h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Dismiss tip' }, svg(UI_ICONS.close));
  const tip = h('div', { class: 'banner tip', role: 'status', hidden: true },
    h('span', {}, 'Edit the text on the left. Slides update live.'), tipClose);

  // ---- left column: Write / Photos ----
  const tabWrite = h('button', { type: 'button', role: 'tab', class: 'tab', id: 'tab-write', 'aria-controls': 'panel-write' }, 'Write');
  const tabPhotos = h('button', { type: 'button', role: 'tab', class: 'tab', id: 'tab-photos', 'aria-controls': 'panel-photos' }, 'Photos');
  const panelWrite = h('div', { class: 'panel panel-write', id: 'panel-write', role: 'tabpanel', 'aria-labelledby': 'tab-write' });
  const panelPhotos = h('div', { class: 'panel panel-photos', id: 'panel-photos', role: 'tabpanel', 'aria-labelledby': 'tab-photos' });
  const left = h('section', { class: 'col-left', 'aria-label': 'Editor' },
    h('div', { class: 'tabs', role: 'tablist' }, tabWrite, tabPhotos), panelWrite, panelPhotos);

  const center = h('section', { class: 'col-center', 'aria-label': 'Preview' });
  const inspector = h('aside', { class: 'col-right inspector', 'aria-label': 'Settings and export' });
  const main = h('main', { class: 'workspace' }, left, center, inspector);

  const mobileTabs: [MobileTab, string, string][] = [
    ['write', 'Write', UI_ICONS.pen], ['photos', 'Photos', UI_ICONS.image],
    ['preview', 'Preview', UI_ICONS.eye], ['export', 'Export', UI_ICONS.download],
  ];
  const mobileNav = h('nav', { class: 'mobile-tabs', 'aria-label': 'Sections' }, ...mobileTabs.map(([id, label, icon]) => {
    const b = h('button', { type: 'button', 'data-tab': id }, svg(icon), h('span', {}, label));
    b.addEventListener('click', () => c.store.set({ mobileTab: id, leftTab: id === 'photos' ? 'photos' : id === 'write' ? 'write' : c.store.get().leftTab }));
    return b;
  }));

  const app = h('div', { class: 'app' }, topbar, storageBanner, tip, main, mobileNav);
  root.replaceChildren(app);

  mountLibrary(deckSwitcher, c);
  mountEditor(panelWrite, c);
  const cheat = mountCheatsheet(panelWrite);
  mountPhotos(panelPhotos, c);
  mountPreview(center, c);
  mountFilmstrip(center, c);
  mountInspector(inspector, c);

  help.addEventListener('click', () => {
    c.store.set({ leftTab: 'write', mobileTab: 'write' });
    cheat.open = true;
    cheat.scrollIntoView({ block: 'nearest' });
    cheat.querySelector('summary')?.focus();
  });
  tipClose.addEventListener('click', () => {
    c.store.set({ tip: false });
    c.updateSettings({ tipDismissed: true });
  });
  const setLeft = (t: 'write' | 'photos'): void => c.store.set({ leftTab: t, mobileTab: t });
  tabWrite.addEventListener('click', () => setLeft('write'));
  tabPhotos.addEventListener('click', () => setLeft('photos'));

  c.store.watch((s) => s.leftTab, (t) => {
    tabWrite.setAttribute('aria-selected', String(t === 'write'));
    tabPhotos.setAttribute('aria-selected', String(t === 'photos'));
    panelWrite.hidden = t !== 'write';
    panelPhotos.hidden = t !== 'photos';
  });
  c.store.watch((s) => s.mobileTab, (t) => {
    app.dataset.mobileTab = t;
    for (const b of mobileNav.querySelectorAll<HTMLButtonElement>('button')) b.setAttribute('aria-current', String(b.dataset.tab === t));
  });
  c.store.watch((s) => s.storageAvailable, (ok) => { storageBanner.hidden = ok; });
  c.store.watch((s) => s.tip, (on) => { tip.hidden = !on; });

  const paintStatus = (): void => {
    const s = c.store.get();
    saveStatus.textContent = s.saveStatus === 'off' ? 'autosave off'
      : s.saveStatus === 'unsaved' ? 'editing…' : `saved · ${timeAgo(s.savedAt)}`;
    saveStatus.dataset.state = s.saveStatus;
  };
  c.store.subscribe((s, p) => {
    if (s.saveStatus !== p.saveStatus || s.savedAt !== p.savedAt) paintStatus();
  });
  setInterval(paintStatus, 15000);
  paintStatus();

  // Library thumbnail: a small JPEG of the cover once it has rendered.
  const thumbCanvas = h('canvas', { style: `width:${THUMB.w}px;height:${THUMB.h}px;position:fixed;left:-9999px` });
  document.body.append(thumbCanvas);
  let thumbKey = '';
  c.store.subscribe((s, p) => {
    if (s.renderVersion === p.renderVersion && s.savedAt === p.savedAt) return;
    const cover = c.engine.get(0);
    if (!cover || !s.deckId || s.saveStatus !== 'saved' || thumbKey === `${s.deckId}:${cover.key}`) return;
    thumbKey = `${s.deckId}:${cover.key}`;
    paintBitmap(thumbCanvas, cover.bitmap);
    try {
      c.decks.setThumb(s.deckId, thumbCanvas.toDataURL('image/jpeg', THUMB.quality));
    } catch {
      // thumbnails are optional
    }
  });
}
