import { SAMPLES } from '../samples';
import { getVariant } from '../templates/registry';
import { isTemplateId } from '../core/types';
import {
  cleanUnusedPhotos, deleteDeck, duplicateDeck, loadSample, newBlankDeck, openDeck, openDeckFile, renameDeck, saveDeckFile,
} from './actions';
import type { Controller } from './controller';
import { h, svg, timeAgo } from './dom';
import { UI_ICONS } from './uiIcons';

/** Top-bar deck switcher: saved decks, deck actions, samples and deck files (PRD F10, F11, F15). */
export function mountLibrary(root: HTMLElement, c: Controller): void {
  const title = h('span', { class: 'deck-title' });
  const button = h('button', { type: 'button', class: 'deck-button', 'aria-haspopup': 'true', 'aria-expanded': 'false' },
    h('span', { class: 'deck-label' }, 'Deck:'), title, svg(UI_ICONS.down));
  const panel = h('div', { class: 'library', hidden: true, role: 'dialog', 'aria-label': 'Deck library' });
  const fileInput = h('input', { type: 'file', accept: '.json,application/json', class: 'visually-hidden', 'aria-label': 'Open deck file' });
  root.append(button, panel, fileInput);

  const close = (): void => {
    panel.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    document.removeEventListener('mousedown', outside);
    document.removeEventListener('keydown', onKey);
  };
  const outside = (e: MouseEvent): void => {
    if (!root.contains(e.target as Node)) close();
  };
  const onKey = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      close();
      button.focus();
    }
  };
  const act = (fn: () => unknown) => () => {
    close();
    void fn();
  };
  const item = (label: string, fn: () => unknown, cls = ''): HTMLButtonElement =>
    h('button', { type: 'button', class: `menu-item ${cls}`, onclick: act(fn) }, label);

  const render = (): void => {
    const s = c.store.get();
    const decks = s.decks.map((d) => {
      const tpl = isTemplateId(d.template) ? getVariant(d.template).name : d.template;
      const thumb = d.thumb ? h('img', { src: d.thumb, alt: '' }) : h('span', { class: 'deck-thumb-empty' });
      return h('li', {}, h('button', {
        type: 'button', class: `deck-row${d.id === s.deckId ? ' current' : ''}`, 'aria-current': d.id === s.deckId ? 'true' : 'false',
        onclick: act(() => openDeck(c, d.id)),
      }, h('span', { class: 'deck-thumb' }, thumb), h('span', { class: 'deck-meta' },
        h('strong', {}, d.title || 'Untitled'), h('small', {}, `${tpl} · ${timeAgo(d.updatedAt)}`))));
    });
    panel.replaceChildren(
      h('div', { class: 'library-actions' },
        item('New deck', () => newBlankDeck(c)), item('Duplicate', () => duplicateDeck(c)),
        item('Rename', () => renameDeck(c)), item('Delete', () => deleteDeck(c), 'danger')),
      h('h3', { class: 'label' }, 'Your decks'),
      decks.length ? h('ul', { class: 'deck-list' }, ...decks) : h('p', { class: 'hint' }, s.storageAvailable ? 'No saved decks yet.' : 'Autosave is off in this browser.'),
      h('h3', { class: 'label' }, 'Load sample'),
      h('div', { class: 'library-actions' }, ...SAMPLES.map((x) => item(x.name, () => loadSample(c, x.id)))),
      h('h3', { class: 'label' }, 'Deck file'),
      h('div', { class: 'library-actions' },
        item('Save deck file', () => saveDeckFile(c)), item('Open deck file…', () => fileInput.click()),
        item('Clean unused photos', () => cleanUnusedPhotos(c))),
    );
  };

  button.addEventListener('click', () => {
    if (!panel.hidden) return close();
    render();
    panel.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    (panel.querySelector('button') as HTMLButtonElement | null)?.focus();
    setTimeout(() => {
      document.addEventListener('mousedown', outside);
      document.addEventListener('keydown', onKey);
    }, 0);
  });
  fileInput.addEventListener('change', () => {
    const f = fileInput.files?.[0];
    if (f) void openDeckFile(c, f);
    fileInput.value = '';
  });
  c.store.watch((s) => s.parsed.deck.title, (t) => { title.textContent = t || 'Untitled'; });
}
