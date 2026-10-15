import { isBlocking } from 'carousel-core/src/core/types';
import { type LeftTab, type MobileTab, allWarnings } from './appState';
import type { Controller } from './controller';
import { mountCheatsheet } from './cheatsheet';
import { h, svg, timeAgo } from './dom';
import { mountEditor } from './editor';
import { mountFilmstrip } from './filmstrip';
import { mountLibrary } from './library';
import { postStatus } from './libraryData';
import { mountPhotos } from './photos';
import { mountPreview, paintBitmap } from './preview';
import { mountPublishSheet } from './publishSheet';
import { deckOrigin } from './sampleIndex';
import { mountStylePanel } from './stylePanel';
import { REG_MARK, UI_ICONS } from './uiIcons';

const THUMB = { w: 90, h: 160, quality: 0.7 };

export function mountApp(root: HTMLElement, c: Controller): void {
  // ---- top bar ----
  const deckSwitcher = h('div', { class: 'deck-switcher' });
  const status = h('span', { class: 'status-pill' });
  const health = h('button', { type: 'button', class: 'health' });
  const saveStatus = h('span', { class: 'save-status', 'aria-live': 'polite' });
  const help = h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Syntax help' }, svg(UI_ICONS.help));
  const focusBtn = h('button', { type: 'button', class: 'icon-btn focus-btn', 'aria-label': 'Focus on the slides', 'aria-pressed': 'false' }, svg(UI_ICONS.expand));
  const publish = h('button', { type: 'button', class: 'btn primary publish-btn' }, svg(UI_ICONS.send), h('span', {}, 'Publish'));
  const topbar = h('header', { class: 'topbar' },
    h('div', { class: 'brand', 'aria-hidden': 'true' }, svg(REG_MARK)),
    deckSwitcher, status, h('div', { class: 'spacer' }), health, saveStatus, help, focusBtn, publish);

  const storageBanner = h('div', { class: 'banner warn', role: 'status', hidden: true },
    'Autosave is off in this browser. Use Save deck file to keep your work.');
  const tipClose = h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Dismiss tip' }, svg(UI_ICONS.close));
  const tip = h('div', { class: 'banner tip', role: 'status', hidden: true },
    h('span', {}, 'Edit the text on the left. Slides update live. Swipe the slide to move between slides.'), tipClose);

  // ---- left column: Write / Photos / Style ----
  const tabDefs: [LeftTab, string, string][] = [['write', 'Write', UI_ICONS.pen], ['photos', 'Photos', UI_ICONS.image], ['style', 'Style', UI_ICONS.style]];
  const tabs = tabDefs.map(([id, label, icon]) => h('button', {
    type: 'button', role: 'tab', class: 'tab', id: `tab-${id}`, 'aria-controls': `panel-${id}`, 'data-tab': id,
  }, svg(icon), label));
  const panels = new Map(tabDefs.map(([id]) => [id, h('div', { class: `panel panel-${id}`, id: `panel-${id}`, role: 'tabpanel', 'aria-labelledby': `tab-${id}` })]));
  const left = h('section', { class: 'col-left', 'aria-label': 'Editor' },
    h('div', { class: 'tabs', role: 'tablist' }, ...tabs), ...panels.values());

  const center = h('section', { class: 'col-center', 'aria-label': 'Preview' });
  const rail = h('nav', { class: 'col-rail', 'aria-label': 'Slides' });
  const main = h('main', { class: 'workspace' }, left, center, rail);

  const mobileTabs: [MobileTab, string, string][] = [
    ['write', 'Write', UI_ICONS.pen], ['photos', 'Photos', UI_ICONS.image],
    ['style', 'Style', UI_ICONS.style], ['preview', 'Preview', UI_ICONS.eye],
  ];
  const mobileNav = h('nav', { class: 'mobile-tabs', 'aria-label': 'Sections' }, ...mobileTabs.map(([id, label, icon]) => {
    const b = h('button', { type: 'button', 'data-tab': id }, svg(icon), h('span', {}, label));
    b.addEventListener('click', () => c.store.set({ mobileTab: id, leftTab: id === 'preview' ? c.store.get().leftTab : id }));
    return b;
  }));

  const app = h('div', { class: 'app' }, topbar, storageBanner, tip, main, mobileNav);
  root.replaceChildren(app);

  mountLibrary(deckSwitcher, c);
  mountEditor(panels.get('write')!, c);
  const cheat = mountCheatsheet(panels.get('write')!);
  mountPhotos(panels.get('photos')!, c);
  mountStylePanel(panels.get('style')!, c);
  mountPreview(center, c);
  mountFilmstrip(rail, c);
  mountPublishSheet(c);

  help.addEventListener('click', () => {
    c.store.set({ leftTab: 'write', mobileTab: 'write', focus: false });
    cheat.open = true;
    cheat.scrollIntoView({ block: 'nearest' });
    cheat.querySelector('summary')?.focus();
  });
  health.addEventListener('click', () => c.store.set({ leftTab: 'write', mobileTab: 'write', focus: false }));
  focusBtn.addEventListener('click', () => c.store.set({ focus: !c.store.get().focus }));
  publish.addEventListener('click', () => c.store.set({ publishOpen: true }));
  tipClose.addEventListener('click', () => {
    c.store.set({ tip: false });
    c.updateSettings({ tipDismissed: true });
  });
  for (const t of tabs) {
    t.addEventListener('click', () => {
      const id = t.dataset.tab as LeftTab;
      c.store.set({ leftTab: id, mobileTab: id, focus: false });
    });
  }

  c.store.watch((s) => s.leftTab, (t) => {
    for (const b of tabs) b.setAttribute('aria-selected', String(b.dataset.tab === t));
    for (const [id, p] of panels) p.hidden = id !== t;
  });
  c.store.watch((s) => s.mobileTab, (t) => {
    app.dataset.mobileTab = t;
    for (const b of mobileNav.querySelectorAll<HTMLButtonElement>('button')) b.setAttribute('aria-current', String(b.dataset.tab === t));
  });
  c.store.watch((s) => s.focus, (on) => {
    app.classList.toggle('focus', on);
    focusBtn.setAttribute('aria-pressed', String(on));
  });
  c.store.watch((s) => s.storageAvailable, (ok) => { storageBanner.hidden = ok; });
  c.store.watch((s) => s.tip, (on) => { tip.hidden = !on; });

  const paintHealth = (): void => {
    const s = c.store.get();
    const ws = allWarnings(s);
    const n = s.parsed.deck.slides.length;
    const blocking = ws.some(isBlocking);
    health.className = `health${ws.length ? (blocking ? ' blocking' : ' warn') : ''}`;
    health.replaceChildren(svg(ws.length ? UI_ICONS.warn : UI_ICONS.check),
      h('span', {}, ws.length ? `${ws.length} warning${ws.length === 1 ? '' : 's'}` : n ? `All ${n} slides fit` : 'No slides yet'));
    health.disabled = !ws.length;
    const { key } = deckOrigin(s.decks, s.deckId);
    const st = postStatus(s.marks, key);
    status.className = `status-pill st-${st}`;
    status.textContent = st === 'posted' ? 'Posted' : st === 'skip' ? 'Skipped' : 'To post';
  };
  c.store.subscribe((s, p) => {
    if (s.parsed !== p.parsed || s.renderWarnings !== p.renderWarnings || s.marks !== p.marks || s.decks !== p.decks || s.deckId !== p.deckId) paintHealth();
  });
  paintHealth();

  const paintStatus = (): void => {
    const s = c.store.get();
    saveStatus.textContent = s.saveStatus === 'off' ? 'Autosave off'
      : s.saveStatus === 'unsaved' ? 'Editing…' : `Saved ${timeAgo(s.savedAt)}`;
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
